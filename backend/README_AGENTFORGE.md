# AgentForge OSS

A modular, open-source framework for building autonomous AI agents.

## Overview

AgentForge OSS is a Python framework for building, deploying, and managing AI agents. It provides a unified interface for working with different language models, memory systems, tool ecosystems, and orchestration systems, all in an open-source package.

## Core Features

- **100% Open-Source Components**: No proprietary dependencies
- **Multiple Agent Types**:
  - Single-agent (ReAct planning)
  - Multi-agent collaboration
  - Human-in-the-loop agents
- **Native Performance Optimization**:
  - vLLM/TensorRT-LLM inference
  - GGUF/AWQ quantization
- **Unified Interfaces**:
  - Memory (Qdrant/Chroma)
  - Tools (Playwright/Prefect)
  - Evaluation (MLflow)

## Project Structure

```
backend/src/
  agents/
    core/               # Core agent classes
      agent_types.py    # Type definitions
      base_agent.py     # Base agent implementation
    memory/             # Memory interfaces
      qdrant/           # Qdrant vector database adapter
      chroma/           # Chroma vector database adapter
    tools/              # Tool registry
      builtin/          # Built-in tools
    workflows/          # Workflow orchestration
    evaluation/         # Agent evaluation
    security/           # Security and sandboxing
  llm/                  # LLM interfaces
    vllm/               # vLLM integration
    quantization/       # GGUF/AWQ support
```

## Installation

### Prerequisites

- Python 3.10+
- Qdrant/Chroma for vector storage
- vLLM/llama.cpp for LLM inference

### Install from Source

```bash
# Clone the repository
git clone https://github.com/your-org/agentforge.git
cd agentforge

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Usage

### Basic Example

```python
from agents.core import AgentCore, Task, AgentConfig, LLMConfig, MemoryConfig, ToolConfig
from agents.core.agent_types import AgentType, LLMBackendType, MemoryBackendType

# Configure the agent
config = AgentConfig(
    llm_config=LLMConfig(
        backend=LLMBackendType.VLLM,
        model_path="mistralai/Mistral-7B-v0.1"
    ),
    memory_config=MemoryConfig(
        backend=MemoryBackendType.QDRANT,
        connection_string="./qdrant_data"
    ),
    tools_config=ToolConfig(
        allowed_tools=["search", "calculator", "datetime"]
    ),
    workflow_config=WorkflowConfig(
        backend=WorkflowEngineType.PREFECT,
        connection_string="http://localhost:4200/api"
    ),
    tracer_config=TracerConfig(
        enabled=True,
        storage_path="./traces"
    )
)

# Create the agent
agent = AgentCore(config)

# Create a task
task = Task(
    query="What is the weather in London today?",
    agent_type=AgentType.REACT
)

# Execute the task
result = await agent.execute(task)
print(result.output)
```

## Contributing

We welcome contributions to AgentForge OSS! Please see our [Contributing Guide](CONTRIBUTING.md) for more information.

## Security Model

AgentForge includes a robust security model for tool execution:

1. **Sandboxed Execution**: Tools run in isolated environments
2. **Resource Limits**: Memory, CPU, and execution time constraints
3. **Permission Controls**: Tools require explicit authorization
4. **Audit Logging**: All agent actions are traced and logged

## License

AgentForge OSS is licensed under the AGPLv3 with a commercial exception. See the [LICENSE](LICENSE) file for details.

## Roadmap

1. ✓ Core agent class with plugin system
2. ✓ vLLM integration with Mistral-7B
3. ✓ Qdrant memory implementation
4. ⬜ Prefect workflow orchestration
5. ⬜ Playwright web automation tool
6. ⬜ LangSmith-like tracing
7. ⬜ Kubernetes deployment templates 