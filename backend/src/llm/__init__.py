"""
LLM module for the AgentForge OSS framework.
This module provides unified interfaces for different LLM backends.
"""

from typing import Dict, Any, List, Optional
import logging
import os
import json

from ..agents.core.agent_types import LLMBackendType, LLMConfig, Task
from .metrics_util import ModelMetricsCollector, measure_execution, estimate_tokens

logger = logging.getLogger(__name__)

def get_llm_backend(config: LLMConfig) -> 'BaseLLM':
    """Factory function to get the appropriate LLM backend"""
    if config.backend == LLMBackendType.VLLM:
        from .vllm import VLLMBackend
        return VLLMBackend(config)
    elif config.backend == LLMBackendType.LLAMA_CPP:
        from .llama_cpp import LlamaCppBackend
        return LlamaCppBackend(config)
    elif config.backend == LLMBackendType.MLC_LLM:
        from .mlc_llm import MLCLLMBackend
        return MLCLLMBackend(config)
    else:
        raise ValueError(f"Unsupported LLM backend: {config.backend}")

def get_model_router() -> 'ModelRouter':
    """Get the model router with available models configuration"""
    from .model_router import ModelRouter
    
    # Load models configuration
    config_path = os.path.join(os.path.dirname(__file__), "models_config.json")
    
    if os.path.exists(config_path):
        try:
            with open(config_path, "r") as f:
                models_config = json.load(f)
            logger.info(f"Loaded configuration for {len(models_config)} models")
        except Exception as e:
            logger.error(f"Error loading models configuration: {e}")
            models_config = get_default_models_config()
    else:
        models_config = get_default_models_config()
        # Save default config
        try:
            with open(config_path, "w") as f:
                json.dump(models_config, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving default models configuration: {e}")
    
    return ModelRouter(models_config)

def get_default_models_config() -> List[Dict[str, Any]]:
    """Get default models configuration"""
    return [
        {
            "name": "Mixtral-8x7B",
            "backend": "vLLM",
            "model_path": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "max_tokens": 4096,
            "temperature": 0.7,
            "capabilities": {
                "handles_complex_tasks": True,
                "handles_medium_tasks": True,
                "multi_agent_coordination": True,
                "human_interaction": True,
                "logical_reasoning": True,
                "creative_reasoning": True,
                "handles_long_generation": True
            },
            "resource_efficiency": 0.6,
            "tensor_parallel_size": 2
        },
        {
            "name": "Llama-2-13B",
            "backend": "vLLM",
            "model_path": "meta-llama/Llama-2-13b-chat-hf",
            "max_tokens": 4096,
            "temperature": 0.7,
            "capabilities": {
                "handles_complex_tasks": False,
                "handles_medium_tasks": True,
                "multi_agent_coordination": True,
                "human_interaction": True,
                "logical_reasoning": True,
                "causal_reasoning": True,
                "efficient_short_responses": True
            },
            "resource_efficiency": 0.7,
            "tensor_parallel_size": 1
        },
        {
            "name": "Llama-2-7B-GGUF",
            "backend": "LLAMA_CPP",
            "model_path": "models/llama-2-7b.Q4_K_M.gguf",
            "max_tokens": 2048,
            "temperature": 0.7,
            "quantization": "GGUF",
            "capabilities": {
                "handles_complex_tasks": False,
                "handles_medium_tasks": False,
                "multi_agent_coordination": False,
                "human_interaction": True,
                "logical_reasoning": False,
                "efficient_short_responses": True
            },
            "resource_efficiency": 0.9
        },
        {
            "name": "Phi-2-GGUF",
            "backend": "LLAMA_CPP",
            "model_path": "models/phi-2.Q4_K_M.gguf",
            "max_tokens": 1024,
            "temperature": 0.7,
            "quantization": "GGUF",
            "capabilities": {
                "handles_complex_tasks": False,
                "handles_medium_tasks": False,
                "multi_agent_coordination": False,
                "human_interaction": False,
                "logical_reasoning": True,
                "procedural_reasoning": True,
                "efficient_short_responses": True
            },
            "resource_efficiency": 0.95
        }
    ]

class BaseLLM:
    """Base class for LLM backends"""
    
    def __init__(self, config: LLMConfig):
        """Initialize the LLM backend with a configuration"""
        self.config = config
        self.metrics_collector = ModelMetricsCollector()
        
    @measure_execution
    async def generate(self, prompt: str, **kwargs) -> str:
        """Generate text from a prompt"""
        raise NotImplementedError("Subclasses must implement this method")
        
    @measure_execution
    async def generate_plan(self, task, context) -> Dict[str, Any]:
        """Generate a plan for a task"""
        raise NotImplementedError("Subclasses must implement this method")
        
    @measure_execution
    async def get_next_action(self, current_step, actions, thoughts, context) -> Dict[str, Any]:
        """Get the next action for a ReAct agent"""
        raise NotImplementedError("Subclasses must implement this method")
        
    @measure_execution
    async def generate_final_answer(self, task, thoughts, actions, context) -> str:
        """Generate a final answer for a task"""
        raise NotImplementedError("Subclasses must implement this method")
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics for this LLM instance"""
        return self.metrics_collector.get_metrics() 