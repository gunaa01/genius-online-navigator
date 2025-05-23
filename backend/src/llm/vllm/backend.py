"""
vLLM backend implementation for AgentForge OSS.
Provides high-performance inference using vLLM.
"""

import json
import logging
import asyncio
from typing import Dict, List, Any, Optional

from ...agents.core.agent_types import LLMConfig, Task
from .. import BaseLLM

logger = logging.getLogger(__name__)

class VLLMBackend(BaseLLM):
    """vLLM backend for LLM inference"""
    
    def __init__(self, config: LLMConfig):
        """Initialize the vLLM backend"""
        super().__init__(config)
        self.client = None
        self._initialize_vllm()
    
    def _initialize_vllm(self):
        """Initialize vLLM with the configured model"""
        logger.info(f"Initializing vLLM with model: {self.config.model_path}")
        
        try:
            from vllm import LLM, SamplingParams
            
            # vLLM configuration
            self.sampling_params = SamplingParams(
                temperature=self.config.temperature,
                top_p=self.config.top_p,
                top_k=self.config.top_k,
                max_tokens=self.config.max_tokens
            )
            
            # Initialize vLLM with the model
            self.client = LLM(
                model=self.config.model_path,
                tensor_parallel_size=self.config.tensor_parallel_size,
                **self.config.extra_params
            )
            
            logger.info("vLLM backend initialized successfully")
        except ImportError:
            logger.error("vLLM package not found. Please install vLLM: pip install vllm")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize vLLM: {e}")
            raise
    
    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate text from a prompt using vLLM"""
        logger.debug(f"Generating text with prompt: {prompt[:100]}...")
        
        try:
            # Override default sampling parameters if provided
            sampling_params = self.sampling_params
            if kwargs:
                from vllm import SamplingParams
                sampling_params = SamplingParams(
                    temperature=kwargs.get('temperature', self.config.temperature),
                    top_p=kwargs.get('top_p', self.config.top_p),
                    top_k=kwargs.get('top_k', self.config.top_k),
                    max_tokens=kwargs.get('max_tokens', self.config.max_tokens)
                )
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                lambda: self.client.generate(prompt, sampling_params)
            )
            
            generated_text = result[0].outputs[0].text
            logger.debug(f"Generated text: {generated_text[:100]}...")
            
            return generated_text
        except Exception as e:
            logger.error(f"Error generating text with vLLM: {e}")
            raise
    
    async def generate_plan(self, task: Task, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a plan for a task"""
        prompt = self._create_plan_prompt(task, context)
        
        # Generate the plan
        raw_plan = await self.generate(prompt)
        
        try:
            # Parse the plan from JSON format
            plan_text = raw_plan.strip()
            # Extract JSON block if wrapped in markdown or other formats
            if "```json" in plan_text:
                json_content = plan_text.split("```json")[1].split("```")[0].strip()
                plan = json.loads(json_content)
            else:
                plan = json.loads(plan_text)
            
            return plan
        except json.JSONDecodeError:
            logger.error(f"Failed to parse plan as JSON: {raw_plan}")
            # Fallback to a basic plan structure
            return {
                "first_step": "analyze_task",
                "steps": {
                    "analyze_task": {
                        "description": "Analyze the task requirements",
                        "next_step": "execute_task"
                    },
                    "execute_task": {
                        "description": "Execute the task directly",
                        "next_step": "finish"
                    },
                    "finish": {
                        "description": "Finish the task",
                        "is_final": True
                    }
                }
            }
    
    async def get_next_action(self, current_step: str, actions: List[Dict], 
                             thoughts: List[str], context: Dict) -> Dict[str, Any]:
        """Get the next action for a ReAct agent"""
        prompt = self._create_next_action_prompt(current_step, actions, thoughts, context)
        
        # Generate the next action
        raw_action = await self.generate(prompt)
        
        try:
            # Parse the action from JSON format
            action_text = raw_action.strip()
            # Extract JSON block if wrapped in markdown or other formats
            if "```json" in action_text:
                json_content = action_text.split("```json")[1].split("```")[0].strip()
                action = json.loads(json_content)
            else:
                action = json.loads(action_text)
            
            return action
        except json.JSONDecodeError:
            logger.error(f"Failed to parse action as JSON: {raw_action}")
            # Fallback to a basic action
            return {
                "thought": f"I need to think about the next step after {current_step}",
                "tool": "search",
                "tool_input": context.get("query", ""),
                "next_step": "finish"
            }
    
    async def generate_final_answer(self, task: Task, thoughts: List[str], 
                                  actions: List[Dict], context: Dict) -> str:
        """Generate a final answer for a task"""
        prompt = self._create_final_answer_prompt(task, thoughts, actions, context)
        
        # Generate the final answer
        return await self.generate(prompt)
    
    def _create_plan_prompt(self, task: Task, context: Dict) -> str:
        """Create a prompt for plan generation"""
        return f"""You are an autonomous agent planning how to solve a task.
        
Task: {task.query}

Context information:
{json.dumps(context, indent=2)}

Create a step-by-step plan to solve this task. 
The plan should be a valid JSON object with the following structure:
{{
  "first_step": "step_id",
  "steps": {{
    "step_id": {{
      "description": "Step description",
      "next_step": "next_step_id",
      "tools": ["tool1", "tool2"]
    }},
    ...
    "final_step": {{
      "description": "Final step description",
      "is_final": true
    }}
  }}
}}

Return only the JSON object with no other text:
"""
    
    def _create_next_action_prompt(self, current_step: str, actions: List[Dict], 
                                 thoughts: List[str], context: Dict) -> str:
        """Create a prompt for next action generation"""
        action_history = "\n".join([
            f"Action {i+1}: Used tool '{a['tool']}' with input '{a['tool_input']}' and got result: {a['result']}"
            for i, a in enumerate(actions)
        ])
        
        thought_history = "\n".join([f"Thought {i+1}: {t}" for i, t in enumerate(thoughts)])
        
        return f"""You are an autonomous agent solving a task step by step.

Current step: {current_step}

Previous thoughts:
{thought_history}

Action history:
{action_history}

Context information:
{json.dumps(context, indent=2)}

Determine the next action to take. Think about what needs to be done in the current step, then decide on the appropriate tool to use.
Return your response as a JSON object with the following structure:
{{
  "thought": "Your reasoning about what to do next",
  "tool": "tool_name",
  "tool_input": "input for the tool",
  "next_step": "next_step_id",
  "done": false
}}

If you believe the task is complete, set "done" to true and don't include tool or tool_input.

Return only the JSON object with no other text:
"""
    
    def _create_final_answer_prompt(self, task: Task, thoughts: List[str], 
                                  actions: List[Dict], context: Dict) -> str:
        """Create a prompt for final answer generation"""
        thought_history = "\n".join([f"Thought {i+1}: {t}" for i, t in enumerate(thoughts)])
        
        action_history = "\n".join([
            f"Action {i+1}: Used tool '{a['tool']}' with input '{a['tool_input']}' and got result: {a['result']}"
            for i, a in enumerate(actions)
        ])
        
        return f"""You are an autonomous agent that has completed a task.

Task: {task.query}

Thought history:
{thought_history}

Action history:
{action_history}

Context information:
{json.dumps(context, indent=2)}

Based on the above information, provide a comprehensive final answer to the task.
Be specific, clear, and directly address the original task.

Final answer:
"""