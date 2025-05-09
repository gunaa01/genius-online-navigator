"""
Type definitions for the AgentForge OSS framework.
This module defines the core data structures and types used throughout the agent system.
"""

from typing import Dict, List, Optional, Union, Any
from enum import Enum
from dataclasses import dataclass, field
from uuid import UUID, uuid4

class LLMBackendType(str, Enum):
    """Supported LLM backends"""
    VLLM = "vLLM"
    LLAMA_CPP = "llama.cpp"
    MLC_LLM = "MLC-LLM"
    TENSORRT_LLM = "TensorRT-LLM"

class MemoryBackendType(str, Enum):
    """Supported memory backends"""
    QDRANT = "Qdrant"
    CHROMA = "Chroma"
    WEAVIATE = "Weaviate"
    MILVUS = "Milvus"

class WorkflowEngineType(str, Enum):
    """Supported workflow engines"""
    PREFECT = "Prefect"
    WINDMILL = "Windmill"
    LANGGRAPH = "LangGraph"
    AIRFLOW = "Airflow"

class AgentType(str, Enum):
    """Supported agent types"""
    REACT = "react"
    MULTI_AGENT = "multi_agent"
    HUMAN_IN_LOOP = "human_in_loop"
    AUTOGEN = "autogen"
    CREWAI = "crewai"

class ToolType(str, Enum):
    """Supported tool types"""
    HTTP = "http"
    SQL = "sql"
    CUSTOM = "custom"
    PYTHON = "python"
    OS = "os"
    SEARCH = "search"
    CALCULATOR = "calculator"
    FILE = "file"
    N8N = "n8n"
    ZAPIER = "zapier"
    OPENBB = "openbb"

@dataclass
class LLMConfig:
    """Configuration for LLM backends"""
    backend: LLMBackendType
    model_path: str
    max_tokens: int = 2048
    temperature: float = 0.7
    top_p: float = 0.95
    top_k: int = 50
    quantization: Optional[str] = None  # "GGUF" or "AWQ"
    tensor_parallel_size: int = 1
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class MemoryConfig:
    """Configuration for memory backends"""
    backend: MemoryBackendType
    connection_string: str
    collection_name: str = "agent_memory"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ToolConfig:
    """Configuration for tool registry"""
    allowed_tools: List[str]
    sandbox_mode: bool = True
    timeout_seconds: int = 30
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class WorkflowConfig:
    """Configuration for workflow engines"""
    backend: WorkflowEngineType
    connection_string: str
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class TracerConfig:
    """Configuration for tracing system"""
    enabled: bool = True
    storage_path: str = "./traces"
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class AgentConfig:
    """Complete configuration for an agent"""
    llm_config: LLMConfig
    memory_config: MemoryConfig
    tools_config: ToolConfig
    workflow_config: WorkflowConfig
    tracer_config: TracerConfig
    name: str = "AgentForge Agent"
    description: str = ""
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class Task:
    """Task definition for agent execution"""
    id: UUID = field(default_factory=uuid4)
    query: str
    agent_type: AgentType = AgentType.REACT
    context_key: str = field(default_factory=lambda: f"context:{uuid4()}")
    result_key: str = field(default_factory=lambda: f"result:{uuid4()}")
    max_steps: Optional[int] = 10
    tools_allowed: Optional[List[str]] = None
    parameters: Dict[str, Any] = field(default_factory=dict)

@dataclass
class AgentResult:
    """Result of an agent execution"""
    task_id: UUID
    success: bool
    output: str
    thoughts: List[str] = field(default_factory=list)
    actions: List[Dict[str, Any]] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None 