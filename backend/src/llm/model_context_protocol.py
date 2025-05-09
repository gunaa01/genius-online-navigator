"""
Model Context Protocol for Genius Navigator

This module defines a standardized interface for interacting with different LLM backends.
It provides a consistent way to handle context, function calling, and model responses
across various model providers and implementations.
"""

from typing import Dict, List, Optional, Union, Any, Callable
from enum import Enum
from dataclasses import dataclass, field
from pydantic import BaseModel, Field


class FunctionParameter(BaseModel):
    """Definition of a function parameter for LLM function calling"""
    name: str
    description: str
    type: str
    required: bool = False
    enum: Optional[List[str]] = None
    default: Optional[Any] = None


class FunctionDefinition(BaseModel):
    """Definition of a function for LLM function calling"""
    name: str
    description: str
    parameters: List[FunctionParameter]


class ModelCapability(str, Enum):
    """Capabilities that models might support"""
    FUNCTION_CALLING = "function_calling"
    TOOL_USE = "tool_use"
    CODE_GENERATION = "code_generation"
    VISION = "vision"
    LONG_CONTEXT = "long_context"
    STREAMING = "streaming"
    EMBEDDING = "embedding"


@dataclass
class ModelContext:
    """Standard context container for model interactions"""
    # Core components
    messages: List[Dict[str, Any]] = field(default_factory=list)
    functions: List[FunctionDefinition] = field(default_factory=list)
    
    # Context management
    system_prompt: Optional[str] = None
    max_tokens: int = 2048
    context_window: int = 8192
    used_tokens: int = 0
    
    # Model configuration
    temperature: float = 0.7
    top_p: float = 0.95
    top_k: int = 50
    capabilities: List[ModelCapability] = field(default_factory=list)
    
    # Execution context
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def add_user_message(self, content: str) -> None:
        """Add a user message to the context"""
        self.messages.append({"role": "user", "content": content})
    
    def add_assistant_message(self, content: str) -> None:
        """Add an assistant message to the context"""
        self.messages.append({"role": "assistant", "content": content})
    
    def add_system_message(self, content: str) -> None:
        """Add a system message to the context"""
        self.messages.append({"role": "system", "content": content})
    
    def add_function_call(self, function_name: str, arguments: Dict[str, Any]) -> None:
        """Add a function call to the context"""
        self.messages.append({
            "role": "assistant", 
            "content": None,
            "function_call": {
                "name": function_name,
                "arguments": arguments
            }
        })
    
    def add_function_result(self, function_name: str, result: Any) -> None:
        """Add a function result to the context"""
        self.messages.append({
            "role": "function", 
            "name": function_name,
            "content": str(result)
        })
    
    def register_function(self, function_def: FunctionDefinition) -> None:
        """Register a function for the model to call"""
        self.functions.append(function_def)
    
    def clear(self) -> None:
        """Clear all messages while preserving system prompt and functions"""
        system_messages = [m for m in self.messages if m["role"] == "system"]
        self.messages = system_messages
        self.used_tokens = 0


class ModelContextProtocol:
    """Protocol adapter for different LLM backends"""
    
    def __init__(self, model_name: str, model_config: Dict[str, Any] = None):
        """Initialize the protocol with model configuration"""
        self.model_name = model_name
        self.model_config = model_config or {}
        self.capabilities = self._detect_capabilities()
    
    def _detect_capabilities(self) -> List[ModelCapability]:
        """Detect capabilities of the current model"""
        # This should be implemented by specific adapters
        return []
    
    async def generate_completion(self, context: ModelContext) -> str:
        """Generate a text completion using the provided context"""
        raise NotImplementedError("Must be implemented by adapter")
    
    async def generate_chat_response(self, context: ModelContext) -> Dict[str, Any]:
        """Generate a chat response with possible function calls"""
        raise NotImplementedError("Must be implemented by adapter")
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for the provided texts"""
        raise NotImplementedError("Must be implemented by adapter")
    
    def estimate_tokens(self, text: str) -> int:
        """Estimate the number of tokens in the text"""
        # Simple approximation - should be overridden by specific adapters
        return len(text.split()) * 1.3
    
    def get_max_context_size(self) -> int:
        """Get the maximum context size for this model"""
        return self.model_config.get("max_context_size", 8192) 