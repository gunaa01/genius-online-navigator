"""
LangGraph workflow implementation for AgentForge OSS.
This module provides workflow orchestration using LangGraph.
"""

import logging
import json
import asyncio
from typing import Dict, List, Any, Optional, Callable

from ..core.agent_types import WorkflowConfig, Task

logger = logging.getLogger(__name__)

class LangGraphWorkflow:
    """
    LangGraph-based workflow engine for AgentForge OSS.
    This provides stateful orchestration for agents.
    """
    
    def __init__(self, config: WorkflowConfig):
        """Initialize the LangGraph workflow engine"""
        self.config = config
        self.workflows: Dict[str, Dict[str, Any]] = {}
        self._verify_dependencies()
    
    def _verify_dependencies(self):
        """Verify that LangGraph dependencies are installed"""
        try:
            import langgraph
            logger.info(f"Using LangGraph version: {langgraph.__version__}")
        except ImportError:
            logger.warning("LangGraph is not installed. Please install with: pip install langgraph")
            
    async def create_workflow(self, workflow_spec: Dict[str, Any]) -> str:
        """
        Create a new workflow from a specification.
        
        Args:
            workflow_spec: The workflow specification
            
        Returns:
            The workflow ID
        """
        try:
            # Import here to avoid dependency issues if not installed
            from langgraph.graph import StateGraph
            import uuid
            
            # Generate workflow ID
            workflow_id = str(uuid.uuid4())
            
            # Create state schema based on the workflow spec
            state_schema = self._create_state_schema(workflow_spec)
            
            # Create the state graph
            graph = StateGraph(state_schema)
            
            # Add nodes from the workflow specification
            for node_name, node_spec in workflow_spec.get("nodes", {}).items():
                graph.add_node(node_name, self._create_node_function(node_spec))
            
            # Add edges from the workflow specification
            for edge in workflow_spec.get("edges", []):
                source = edge.get("source")
                target = edge.get("target")
                condition = edge.get("condition")
                
                if source and target:
                    if condition:
                        condition_func = self._create_condition_function(condition)
                        graph.add_conditional_edge(source, target, condition_func)
                    else:
                        graph.add_edge(source, target)
            
            # Set the entry point
            entry_point = workflow_spec.get("entry_point", list(workflow_spec.get("nodes", {}).keys())[0])
            graph.set_entry_point(entry_point)
            
            # Compile the graph
            compiled_graph = graph.compile()
            
            # Store the workflow
            self.workflows[workflow_id] = {
                "spec": workflow_spec,
                "graph": compiled_graph
            }
            
            logger.info(f"Created workflow {workflow_id} with {len(workflow_spec.get('nodes', {}))} nodes")
            
            return workflow_id
            
        except Exception as e:
            logger.error(f"Error creating workflow: {e}")
            raise
    
    async def execute_workflow(self, workflow_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a workflow with the given context.
        
        Args:
            workflow_id: The ID of the workflow to execute
            context: The execution context
            
        Returns:
            The workflow execution result
        """
        if workflow_id not in self.workflows:
            raise ValueError(f"Workflow {workflow_id} not found")
        
        try:
            # Get the compiled graph
            compiled_graph = self.workflows[workflow_id]["graph"]
            
            # Create initial state
            initial_state = {
                "context": context,
                "results": {},
                "current_step": None,
                "history": [],
                "errors": []
            }
            
            # Execute the graph
            # We run in a thread to avoid blocking the event loop
            loop = asyncio.get_event_loop()
            result_state = await loop.run_in_executor(None, lambda: compiled_graph.invoke(initial_state))
            
            # Extract the results
            results = result_state.get("results", {})
            
            output = {
                "success": not bool(result_state.get("errors")),
                "output": results.get("final_output", "No output produced"),
                "thoughts": result_state.get("history", []),
                "actions": []
            }
            
            # Convert steps to actions for compatibility with AgentResult
            for step in result_state.get("history", []):
                if isinstance(step, dict) and "action" in step:
                    output["actions"].append(step["action"])
            
            logger.info(f"Executed workflow {workflow_id} successfully")
            
            return output
            
        except Exception as e:
            logger.error(f"Error executing workflow {workflow_id}: {e}")
            return {
                "success": False,
                "output": f"Error executing workflow: {str(e)}",
                "thoughts": [],
                "actions": []
            }
    
    async def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """
        Get the status of a workflow.
        
        Args:
            workflow_id: The ID of the workflow
            
        Returns:
            The workflow status
        """
        if workflow_id not in self.workflows:
            raise ValueError(f"Workflow {workflow_id} not found")
        
        # In this simple implementation, we don't maintain workflow status
        # In a real implementation, this would retrieve status from a database
        return {
            "id": workflow_id,
            "status": "completed",  # In real implementation this would be dynamic
            "spec": self.workflows[workflow_id]["spec"]
        }
    
    async def cancel_workflow(self, workflow_id: str) -> bool:
        """
        Cancel a running workflow.
        
        Args:
            workflow_id: The ID of the workflow to cancel
            
        Returns:
            True if the workflow was successfully canceled, False otherwise
        """
        # LangGraph doesn't have built-in cancellation, but we can implement it
        # if needed in a more complete implementation
        logger.warning(f"Cancellation not supported for workflow {workflow_id}")
        return False
    
    async def list_workflows(self, status: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        List workflows, optionally filtered by status.
        
        Args:
            status: The status to filter by (e.g., 'running', 'completed', 'failed')
            limit: The maximum number of workflows to return
            
        Returns:
            A list of workflow information
        """
        workflows = []
        
        for workflow_id, workflow in list(self.workflows.items())[:limit]:
            workflow_info = {
                "id": workflow_id,
                "spec": workflow["spec"]
            }
            workflows.append(workflow_info)
        
        return workflows
    
    def _create_state_schema(self, workflow_spec: Dict[str, Any]) -> Dict[str, Any]:
        """Create a state schema for the workflow"""
        # In a real implementation, this would be based on the workflow spec
        # For now, we'll use a simple schema
        return {
            "context": Dict[str, Any],
            "results": Dict[str, Any],
            "current_step": Optional[str],
            "history": List[Dict[str, Any]],
            "errors": List[str]
        }
    
    def _create_node_function(self, node_spec: Dict[str, Any]) -> Callable:
        """Create a function for a workflow node"""
        node_type = node_spec.get("type", "process")
        
        if node_type == "llm":
            return self._create_llm_node(node_spec)
        elif node_type == "tool":
            return self._create_tool_node(node_spec)
        elif node_type == "decision":
            return self._create_decision_node(node_spec)
        elif node_type == "human_in_loop":
            return self._create_human_node(node_spec)
        else:
            # Default processing node
            return self._create_process_node(node_spec)
    
    def _create_llm_node(self, node_spec: Dict[str, Any]) -> Callable:
        """Create a function for an LLM node"""
        def llm_node(state):
            # In a real implementation, this would call the LLM
            # For now, we'll just update the state
            context = state.get("context", {})
            prompt = node_spec.get("prompt", "")
            
            # In a real implementation, we would call the LLM here
            result = f"LLM response for prompt: {prompt}"
            
            # Update the state
            new_state = state.copy()
            results = new_state.get("results", {})
            results[node_spec.get("id", "llm")] = result
            
            history = new_state.get("history", [])
            history.append({
                "step": node_spec.get("id", "llm"),
                "type": "llm",
                "prompt": prompt,
                "result": result
            })
            
            new_state["current_step"] = node_spec.get("id", "llm")
            new_state["results"] = results
            new_state["history"] = history
            
            return new_state
        
        return llm_node
    
    def _create_tool_node(self, node_spec: Dict[str, Any]) -> Callable:
        """Create a function for a tool node"""
        def tool_node(state):
            # In a real implementation, this would call a tool
            tool_name = node_spec.get("tool_name", "unknown_tool")
            tool_input = self._extract_tool_input(state, node_spec)
            
            # In a real implementation, we would call the tool here
            result = f"Tool {tool_name} execution result with input: {tool_input}"
            
            # Update the state
            new_state = state.copy()
            results = new_state.get("results", {})
            results[node_spec.get("id", "tool")] = result
            
            history = new_state.get("history", [])
            history.append({
                "step": node_spec.get("id", "tool"),
                "type": "tool",
                "tool": tool_name,
                "input": tool_input,
                "result": result,
                "action": {
                    "tool": tool_name,
                    "tool_input": tool_input,
                    "result": result
                }
            })
            
            new_state["current_step"] = node_spec.get("id", "tool")
            new_state["results"] = results
            new_state["history"] = history
            
            return new_state
        
        return tool_node
    
    def _create_decision_node(self, node_spec: Dict[str, Any]) -> Callable:
        """Create a function for a decision node"""
        def decision_node(state):
            # This node helps determine which path to take next
            # The actual branching is handled by conditional edges
            
            # Update the state to indicate we've reached this decision point
            new_state = state.copy()
            new_state["current_step"] = node_spec.get("id", "decision")
            
            history = new_state.get("history", [])
            history.append({
                "step": node_spec.get("id", "decision"),
                "type": "decision"
            })
            
            new_state["history"] = history
            
            return new_state
        
        return decision_node
    
    def _create_human_node(self, node_spec: Dict[str, Any]) -> Callable:
        """Create a function for a human-in-the-loop node"""
        def human_node(state):
            # In a real implementation, this would pause execution and wait for human input
            # For now, we'll simulate a response
            
            # Extract the question to ask the human
            question = node_spec.get("question", "Please provide feedback")
            
            # In a real implementation, we would pause here and wait for input
            # Instead, we'll simulate a response
            simulated_response = "Simulated human feedback"
            
            # Update the state
            new_state = state.copy()
            results = new_state.get("results", {})
            results[node_spec.get("id", "human")] = simulated_response
            
            history = new_state.get("history", [])
            history.append({
                "step": node_spec.get("id", "human"),
                "type": "human_in_loop",
                "question": question,
                "response": simulated_response
            })
            
            new_state["current_step"] = node_spec.get("id", "human")
            new_state["results"] = results
            new_state["history"] = history
            
            return new_state
        
        return human_node
    
    def _create_process_node(self, node_spec: Dict[str, Any]) -> Callable:
        """Create a function for a general processing node"""
        def process_node(state):
            # Generic processing node that manipulates state based on the spec
            process_type = node_spec.get("process_type", "passthrough")
            
            # Create a new state to avoid modifying the original
            new_state = state.copy()
            
            if process_type == "aggregate":
                # Aggregate results from previous nodes
                results = new_state.get("results", {})
                source_keys = node_spec.get("source_keys", [])
                aggregated_data = {}
                
                for key in source_keys:
                    if key in results:
                        aggregated_data[key] = results[key]
                
                results[node_spec.get("id", "aggregate")] = aggregated_data
                new_state["results"] = results
            
            elif process_type == "transform":
                # Apply a transformation to data
                # In a real implementation, this would be more sophisticated
                results = new_state.get("results", {})
                source_key = node_spec.get("source_key")
                
                if source_key and source_key in results:
                    source_data = results[source_key]
                    
                    # Simple transformation (in reality, this would be configurable)
                    results[node_spec.get("id", "transform")] = f"Transformed: {source_data}"
                    new_state["results"] = results
            
            # Update history
            history = new_state.get("history", [])
            history.append({
                "step": node_spec.get("id", "process"),
                "type": "process",
                "process_type": process_type
            })
            
            new_state["current_step"] = node_spec.get("id", "process")
            new_state["history"] = history
            
            return new_state
        
        return process_node
    
    def _create_condition_function(self, condition_spec: Dict[str, Any]) -> Callable:
        """Create a condition function for conditional edges"""
        condition_type = condition_spec.get("type", "equals")
        
        def condition_func(state):
            try:
                # Extract the value to check
                source_key = condition_spec.get("source", {})
                key_path = source_key.get("path", [])
                
                # Navigate through the state to get the value
                value = state
                for key in key_path:
                    if isinstance(value, dict) and key in value:
                        value = value[key]
                    else:
                        # If path doesn't exist, return False
                        return False
                
                # Apply the condition
                if condition_type == "equals":
                    expected = condition_spec.get("value")
                    return value == expected
                elif condition_type == "contains":
                    expected = condition_spec.get("value")
                    return expected in value if isinstance(value, (str, list, dict)) else False
                elif condition_type == "not_empty":
                    return bool(value)
                elif condition_type == "greater_than":
                    threshold = condition_spec.get("value", 0)
                    return value > threshold if isinstance(value, (int, float)) else False
                else:
                    logger.warning(f"Unknown condition type: {condition_type}")
                    return False
            except Exception as e:
                logger.error(f"Error evaluating condition: {e}")
                return False
        
        return condition_func
    
    def _extract_tool_input(self, state: Dict[str, Any], node_spec: Dict[str, Any]) -> Any:
        """Extract tool input from state based on the node spec"""
        input_spec = node_spec.get("input", {})
        input_type = input_spec.get("type", "static")
        
        if input_type == "static":
            # Use static input from the spec
            return input_spec.get("value")
        
        elif input_type == "from_context":
            # Extract from context
            path = input_spec.get("path", [])
            context = state.get("context", {})
            
            value = context
            for key in path:
                if isinstance(value, dict) and key in value:
                    value = value[key]
                else:
                    # If path doesn't exist, return empty
                    return None
            
            return value
        
        elif input_type == "from_results":
            # Extract from previous results
            source_node = input_spec.get("source_node")
            results = state.get("results", {})
            
            if source_node and source_node in results:
                return results[source_node]
            
            return None
        
        else:
            # Default to empty input
            return None 