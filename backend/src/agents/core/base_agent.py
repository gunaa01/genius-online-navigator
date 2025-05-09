"""
Base Agent Class for AgentForge OSS
This is the core agent implementation that handles task execution,
memory management, and tool orchestration.
"""

from typing import Dict, List, Optional, Any
import asyncio
import logging
import time
from datetime import datetime

# Import necessary types
from .agent_types import AgentConfig, Task, AgentResult, LLMConfig

logger = logging.getLogger(__name__)

class AgentCore:
    """Core agent implementation for AgentForge OSS"""
    
    def __init__(self, config: AgentConfig):
        """Initialize the agent with a configuration"""
        self.config = config
        self.model_router = self._init_model_router()
        self.llm_backend = self._init_llm(config.llm_config)
        self.memory = self._init_memory(config.memory_config)
        self.tool_registry = self._init_tools(config.tools_config)
        self.workflow_engine = self._init_workflow(config.workflow_config)
        self.tracer = self._init_tracer(config.tracer_config)
        self.current_model_path = None
        self.fallback_models = []  # List of fallback models to try if primary fails
        
        logger.info(f"Agent initialized with default backend: {config.llm_config.backend}")
    
    def _init_model_router(self):
        """Initialize the model router"""
        from ...llm import get_model_router
        
        return get_model_router()
    
    def _init_llm(self, config):
        """Initialize the LLM backend based on configuration"""
        from ...llm import get_llm_backend
        
        return get_llm_backend(config)
    
    def _init_memory(self, config):
        """Initialize the memory system"""
        from ..memory import get_memory_adapter
        
        return get_memory_adapter(config)
    
    def _init_tools(self, config):
        """Initialize tool registry"""
        from ..tools import ToolRegistry
        
        return ToolRegistry(config)
    
    def _init_workflow(self, config):
        """Initialize workflow engine"""
        from ..workflows import get_workflow_engine
        
        return get_workflow_engine(config)
    
    def _init_tracer(self, config):
        """Initialize tracing system"""
        from ..evaluation import get_tracer
        
        return get_tracer(config)
    
    async def execute(self, task: Task) -> AgentResult:
        """Execute a task using the agent framework"""
        self.tracer.start_trace(task)
        start_time = time.time()
        
        try:
            # Retrieve relevant context from memory
            context = await self.memory.retrieve(task.context_key)
            
            # Use model router to select the best LLM for this task
            llm_config, selection_reason = self.model_router.select_model(task, context)
            # Log the model selection
            self.tracer.log_model_selection(llm_config, selection_reason)
            
            # Keep track of the current model for metrics updates
            self.current_model_path = llm_config.model_path
            
            # Initialize the selected LLM backend
            from ...llm import get_llm_backend
            selected_llm = get_llm_backend(llm_config)
            
            # Generate a plan using the selected LLM
            try:
                plan = await selected_llm.generate_plan(task, context)
                self.tracer.log_plan(plan)
            except Exception as plan_error:
                logger.warning(f"Error generating plan with primary model: {plan_error}")
                
                # Try fallback if available
                if not self.fallback_models:
                    # Get default fallback models if not initialized
                    self._init_fallback_models()
                
                for fallback_config in self.fallback_models:
                    try:
                        logger.info(f"Trying fallback model: {fallback_config.model_path}")
                        fallback_llm = get_llm_backend(fallback_config)
                        plan = await fallback_llm.generate_plan(task, context)
                        self.tracer.log_model_selection(fallback_config, "Fallback model selected due to primary model failure")
                        selected_llm = fallback_llm
                        self.current_model_path = fallback_config.model_path
                        break
                    except Exception as fallback_error:
                        logger.warning(f"Fallback model failed too: {fallback_error}")
                else:
                    # Re-raise original error if all fallbacks failed
                    raise plan_error
            
            # Execute the plan using tools
            if task.agent_type == "react":
                result = await self._execute_react(task, plan, context, selected_llm)
            elif task.agent_type == "multi_agent":
                result = await self._execute_multi_agent(task, plan, context, selected_llm)
            elif task.agent_type == "human_in_loop":
                result = await self._execute_human_in_loop(task, plan, context, selected_llm)
            else:
                raise ValueError(f"Unsupported agent type: {task.agent_type}")
            
            # Save results to memory
            await self.memory.store(task.result_key, result)
            
            # Calculate and record execution metrics
            end_time = time.time()
            execution_time = end_time - start_time
            
            # Get performance metrics from LLM
            llm_metrics = selected_llm.get_performance_metrics()
            
            # Calculate token efficiency if available
            token_efficiency = None
            if hasattr(selected_llm, 'tokens_in') and hasattr(selected_llm, 'tokens_out'):
                if selected_llm.tokens_in > 0:
                    token_efficiency = selected_llm.tokens_out / selected_llm.tokens_in
            
            # Update model performance metrics
            self.model_router.update_model_metrics(
                self.current_model_path,
                {
                    "success_rate": 1.0 if result.success else 0.0,
                    "avg_latency": execution_time * 1000,  # Convert to ms
                    "last_used": end_time,
                    "task_type": self._get_task_type(task),
                    "success": result.success,
                    "token_efficiency": token_efficiency or llm_metrics.get("token_efficiency", 0.5),
                    "accuracy": result.metrics.get("accuracy", 0.8) if result.success else 0.0
                }
            )
            
            # Add metrics to result
            result.metrics["execution_time"] = execution_time
            result.metrics["model_path"] = self.current_model_path
            result.metrics["model_selection_reason"] = selection_reason
            if llm_metrics:
                result.metrics.update(llm_metrics)
            
            return result
        except Exception as e:
            logger.error(f"Error executing task: {e}")
            self.tracer.log_error(e)
            
            # Calculate execution time even for failed tasks
            end_time = time.time()
            execution_time = end_time - start_time
            
            # Update model metrics for failure case
            if self.current_model_path:
                self.model_router.update_model_metrics(
                    self.current_model_path,
                    {
                        "success_rate": 0.0,
                        "avg_latency": execution_time * 1000,  # Convert to ms
                        "last_used": end_time,
                        "task_type": self._get_task_type(task),
                        "success": False
                    }
                )
            
            # Create error result
            error_result = AgentResult(
                task_id=task.id,
                success=False,
                output=f"Error executing task: {str(e)}",
                error=str(e),
                metrics={"execution_time": execution_time, "error": str(e)}
            )
            
            return error_result
        finally:
            self.tracer.end_trace()
    
    def _init_fallback_models(self):
        """Initialize fallback models"""
        from ...llm import get_default_models_config
        from .agent_types import LLMConfig, LLMBackendType
        
        # Get default models
        default_models = get_default_models_config()
        
        # Create fallback configurations
        self.fallback_models = []
        
        # Use lightweight models as fallbacks
        for model_conf in default_models:
            if model_conf.get("resource_efficiency", 0) > 0.8:  # Only efficient models as fallbacks
                self.fallback_models.append(LLMConfig(
                    backend=LLMBackendType(model_conf["backend"]),
                    model_path=model_conf["model_path"],
                    max_tokens=model_conf.get("max_tokens", 2048),
                    temperature=model_conf.get("temperature", 0.7),
                    top_p=model_conf.get("top_p", 0.95),
                    top_k=model_conf.get("top_k", 50),
                    quantization=model_conf.get("quantization"),
                    tensor_parallel_size=1,  # Always use minimal parallelism for fallbacks
                    extra_params=model_conf.get("extra_params", {})
                ))
    
    def _get_task_type(self, task: Task) -> str:
        """Extract task type from task for metrics tracking"""
        # Simple heuristic-based task type detection
        query = task.query.lower()
        
        if "summarize" in query or "summary" in query:
            return "summarization"
        elif "translate" in query:
            return "translation"
        elif "code" in query or "function" in query or "programming" in query:
            return "coding"
        elif "search" in query or "find information" in query:
            return "information_retrieval"
        elif "creative" in query or "write a story" in query or "poem" in query:
            return "creative_writing"
        elif "analyze" in query or "data" in query:
            return "data_analysis"
        
        # Default to general
        return "general"
    
    async def _execute_react(self, task: Task, plan: dict, context: dict, llm: Any) -> AgentResult:
        """Execute a ReAct planning-based agent"""
        thoughts = []
        actions = []
        
        current_step = plan["first_step"]
        max_steps = task.max_steps or 10
        
        for step in range(max_steps):
            # Get next action based on current state
            next_action = await llm.get_next_action(current_step, actions, thoughts, context)
            thoughts.append(next_action["thought"])
            
            # Check if we're done
            if next_action.get("done", False):
                break
                
            # Execute tool
            tool_name = next_action["tool"]
            tool_input = next_action["tool_input"]
            
            self.tracer.log_tool_start(tool_name, tool_input)
            tool_result = await self.tool_registry.execute_tool(tool_name, tool_input)
            self.tracer.log_tool_end(tool_name, tool_result)
            
            actions.append({
                "tool": tool_name,
                "tool_input": tool_input,
                "result": tool_result,
                "timestamp": datetime.now().isoformat()
            })
            
            current_step = next_action["next_step"]
        
        # Generate final answer
        final_answer = await llm.generate_final_answer(task, thoughts, actions, context)
        
        # Extract metrics from LLM if available
        metrics = {}
        if hasattr(llm, 'get_performance_metrics'):
            metrics = llm.get_performance_metrics()
        
        return AgentResult(
            task_id=task.id,
            success=True,
            output=final_answer,
            thoughts=thoughts,
            actions=actions,
            metrics=metrics
        )
    
    async def _execute_multi_agent(self, task: Task, plan: dict, context: dict, llm: Any) -> AgentResult:
        """Execute a multi-agent workflow"""
        workflow_id = await self.workflow_engine.create_workflow(plan["workflow_spec"])
        workflow_result = await self.workflow_engine.execute_workflow(workflow_id, context)
        
        # Extract metrics from LLM if available
        metrics = {}
        if hasattr(llm, 'get_performance_metrics'):
            metrics = llm.get_performance_metrics()
        
        # Get result metrics from workflow if available
        if isinstance(workflow_result, dict) and "metrics" in workflow_result:
            metrics.update(workflow_result["metrics"])
        
        return AgentResult(
            task_id=task.id,
            success=workflow_result["success"],
            output=workflow_result["output"],
            thoughts=workflow_result.get("thoughts", []),
            actions=workflow_result.get("actions", []),
            metrics=metrics
        )
    
    async def _execute_human_in_loop(self, task: Task, plan: dict, context: dict, llm: Any) -> AgentResult:
        """Execute a human-in-the-loop agent"""
        # Initial execution without human input
        initial_result = await self._execute_react(task, plan, context, llm)
        
        if plan.get("requires_human_validation", True):
            human_feedback = await self._get_human_feedback(task, initial_result)
            
            # Update context with human feedback
            context["human_feedback"] = human_feedback
            
            # Re-execute with human feedback
            return await self._execute_react(task, plan, context, llm)
        
        return initial_result
    
    async def _get_human_feedback(self, task: Task, initial_result: AgentResult) -> Dict:
        """Get feedback from human"""
        # This would typically integrate with a frontend component
        # Here we're just implementing the interface
        return {
            "approved": False,
            "comments": "This is a placeholder for human feedback",
            "modifications": {},
            "timestamp": datetime.now().isoformat()
        } 