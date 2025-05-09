"""
vLLM Adapter for the Model Context Protocol

This module provides an implementation of the Model Context Protocol
for the vLLM backend, enabling high-performance inference with
optimized attention mechanisms and quantization support.
"""

import json
import asyncio
from typing import Dict, List, Optional, Any, Union

# Import the Model Context Protocol
from ..model_context_protocol import (
    ModelContextProtocol,
    ModelContext,
    ModelCapability,
    FunctionDefinition
)

# Assuming vLLM is installed and available
try:
    from vllm import AsyncLLMEngine, SamplingParams
    from vllm.engines.arg_utils import AsyncEngineArgs
    VLLM_AVAILABLE = True
except ImportError:
    VLLM_AVAILABLE = False
    # Define minimal placeholders to avoid errors when vLLM is not available
    class AsyncLLMEngine:
        pass
    
    class SamplingParams:
        pass
    
    class AsyncEngineArgs:
        pass


class VLLMAdapter(ModelContextProtocol):
    """vLLM implementation of the Model Context Protocol"""
    
    def __init__(self, model_name: str, model_config: Dict[str, Any] = None):
        """Initialize the vLLM adapter"""
        super().__init__(model_name, model_config)
        
        if not VLLM_AVAILABLE:
            raise ImportError("vLLM is not installed. Please install it with pip install vllm")
        
        # Extract configuration parameters
        self.tensor_parallel_size = model_config.get("tensor_parallel_size", 1)
        self.gpu_memory_utilization = model_config.get("gpu_memory_utilization", 0.9)
        self.quantization = model_config.get("quantization", None)
        
        # Initialize the vLLM engine
        self.engine = self._initialize_engine()
    
    def _initialize_engine(self) -> AsyncLLMEngine:
        """Initialize the vLLM engine with the specified configuration"""
        # Configure engine arguments
        engine_args = AsyncEngineArgs(
            model=self.model_name,
            tensor_parallel_size=self.tensor_parallel_size,
            gpu_memory_utilization=self.gpu_memory_utilization,
            quantization=self.quantization,
            max_model_len=self.model_config.get("max_context_size", 8192)
        )
        
        # Create the engine
        return AsyncLLMEngine.from_engine_args(engine_args)
    
    def _detect_capabilities(self) -> List[ModelCapability]:
        """Detect the capabilities of the vLLM model"""
        capabilities = [
            ModelCapability.STREAMING,
            ModelCapability.LONG_CONTEXT
        ]
        
        # Check for function calling support based on model name
        if "mistral" in self.model_name.lower() or "claude" in self.model_name.lower() or "gpt" in self.model_name.lower():
            capabilities.append(ModelCapability.FUNCTION_CALLING)
        
        # Check for code generation support
        if "code" in self.model_name.lower() or "starcoder" in self.model_name.lower() or "codellama" in self.model_name.lower():
            capabilities.append(ModelCapability.CODE_GENERATION)
        
        return capabilities
    
    def _create_prompt_from_context(self, context: ModelContext) -> str:
        """Create a prompt string from the context for non-chat models"""
        # For basic completion models, concatenate messages
        parts = []
        
        # Add system prompt if available
        if context.system_prompt:
            parts.append(f"System: {context.system_prompt}\n\n")
        
        # Add all messages
        for message in context.messages:
            role = message["role"]
            content = message.get("content", "")
            
            if role == "system":
                # Skip system messages as they're handled above
                continue
            elif role == "user":
                parts.append(f"User: {content}\n")
            elif role == "assistant":
                parts.append(f"Assistant: {content}\n")
            elif role == "function":
                parts.append(f"Function {message['name']}: {content}\n")
        
        # Add final assistant prefix
        parts.append("Assistant: ")
        
        return "".join(parts)
    
    def _prepare_chat_messages(self, context: ModelContext) -> List[Dict[str, Any]]:
        """Prepare chat messages for models that support chat format"""
        messages = []
        
        # Add system message if provided
        if context.system_prompt:
            messages.append({"role": "system", "content": context.system_prompt})
        
        # Add all other messages
        for message in context.messages:
            # Deep copy the message to avoid modifying the original
            message_copy = message.copy()
            messages.append(message_copy)
        
        return messages
    
    def _prepare_sampling_params(self, context: ModelContext) -> SamplingParams:
        """Prepare sampling parameters for generation"""
        return SamplingParams(
            temperature=context.temperature,
            top_p=context.top_p,
            top_k=context.top_k,
            max_tokens=context.max_tokens,
            stop_token_ids=None,  # Use default stop tokens for the model
            stop=["User:", "\nUser:"]  # Stop on user turns
        )
    
    def _create_function_calling_prompt(self, context: ModelContext) -> str:
        """Create a function calling prompt for models without native function calling"""
        # Add function definitions to the prompt
        function_definitions = []
        for func in context.functions:
            param_descriptions = []
            for param in func.parameters:
                required_str = "required" if param.required else "optional"
                param_descriptions.append(f"- {param.name}: {param.description} ({param.type}, {required_str})")
            
            function_definitions.append(
                f"Function: {func.name}\n"
                f"Description: {func.description}\n"
                f"Parameters:\n" + "\n".join(param_descriptions)
            )
        
        functions_text = "\n\n".join(function_definitions)
        
        # Create the base prompt
        base_prompt = self._create_prompt_from_context(context)
        
        # Add the function calling instructions
        return (
            f"You have access to the following functions:\n\n{functions_text}\n\n"
            "To call a function, respond in the following format:\n"
            "```json\n{\"function\": \"function_name\", \"parameters\": {\"param1\": \"value1\", \"param2\": \"value2\"}}\n```\n\n"
            f"{base_prompt}"
        )
    
    async def generate_completion(self, context: ModelContext) -> str:
        """Generate a text completion using vLLM"""
        # Create the prompt
        prompt = self._create_prompt_from_context(context)
        
        # Set up sampling parameters
        sampling_params = self._prepare_sampling_params(context)
        
        # Generate the completion
        results = await self.engine.generate(prompt, sampling_params)
        
        # Extract and return the generated text
        generated_text = results[0].outputs[0].text
        
        return generated_text
    
    async def generate_chat_response(self, context: ModelContext) -> Dict[str, Any]:
        """Generate a chat response with possible function calls"""
        # Check if the model supports function calling
        if ModelCapability.FUNCTION_CALLING in self.capabilities and context.functions:
            # For models with native function calling support
            messages = self._prepare_chat_messages(context)
            
            # Convert function definitions to the format expected by the model
            function_defs = []
            for func in context.functions:
                function_defs.append({
                    "name": func.name,
                    "description": func.description,
                    "parameters": {
                        "type": "object",
                        "properties": {
                            param.name: {
                                "type": param.type,
                                "description": param.description
                            } for param in func.parameters
                        },
                        "required": [param.name for param in func.parameters if param.required]
                    }
                })
            
            # Add function definitions to sampling params
            sampling_params = self._prepare_sampling_params(context)
            # This would need to be customized based on how vLLM implements function calling
            
            # Generate with function calling (implementation depends on vLLM's API)
            results = await self.engine.generate(messages, sampling_params)
            
            # Extract the response
            response = results[0].outputs[0].text
            
            # Parse for function calls
            try:
                # Check if the response contains a function call
                if "```json" in response:
                    # Extract the JSON part
                    json_start = response.find("```json") + 7
                    json_end = response.find("```", json_start)
                    json_str = response[json_start:json_end].strip()
                    
                    # Parse the JSON
                    function_call = json.loads(json_str)
                    
                    return {
                        "content": None,
                        "function_call": {
                            "name": function_call["function"],
                            "arguments": function_call["parameters"]
                        }
                    }
                else:
                    return {"content": response}
            except Exception:
                # If parsing fails, return the raw text
                return {"content": response}
        else:
            # For models without function calling, we'll simulate it
            if context.functions:
                prompt = self._create_function_calling_prompt(context)
            else:
                prompt = self._create_prompt_from_context(context)
            
            # Set up sampling parameters
            sampling_params = self._prepare_sampling_params(context)
            
            # Generate the completion
            results = await self.engine.generate(prompt, sampling_params)
            
            # Extract the generated text
            response = results[0].outputs[0].text
            
            # Try to parse function calls from the response
            try:
                if "```json" in response:
                    # Extract the JSON part
                    json_start = response.find("```json") + 7
                    json_end = response.find("```", json_start)
                    json_str = response[json_start:json_end].strip()
                    
                    # Parse the JSON
                    function_call = json.loads(json_str)
                    
                    return {
                        "content": None,
                        "function_call": {
                            "name": function_call["function"],
                            "arguments": function_call["parameters"]
                        }
                    }
                else:
                    return {"content": response}
            except Exception:
                # If parsing fails, return the raw text
                return {"content": response}
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for the provided texts"""
        # vLLM doesn't natively support embeddings, so we'd need to use a different library
        # This is a placeholder - in a real implementation, you might use SentenceTransformers or another library
        raise NotImplementedError("Embedding generation is not implemented in the vLLM adapter")
    
    def estimate_tokens(self, text: str) -> int:
        """Estimate the number of tokens in the text"""
        # vLLM has tokenization utilities we could use here
        # This is a simple approximation
        words = text.split()
        return int(len(words) * 1.3)  # Approximate token count 