# Genius Navigator Agentic AI Backend

This backend implements a powerful agentic AI framework for the Genius Navigator application, providing a flexible and extensible system for building, managing, and executing AI agent workflows.

## Features

- **Model Context Protocol**: A unified interface for interacting with different LLM backends
- **Graph-based Workflow Engine**: A LangGraph-inspired workflow system for complex agent orchestration
- **Extensible Agent Architecture**: Support for various agent types including ReAct, multi-agent, and human-in-loop
- **Tool Registry**: A system for registering and managing tools that agents can use
- **Workflow Registry**: Persistence and management of workflow templates and instances

## Architecture

The backend follows a modular architecture:

- `src/llm/`: LLM integrations including various backend adapters (vLLM, MLC-LLM, etc.)
- `src/agents/`: Core agent implementation and specialized agents
- `src/agents/core/`: Base agent classes and types
- `src/agents/tools/`: Tool registry and implementations
- `src/agents/memory/`: Memory systems for agents
- `src/agents/workflows/`: Workflow engine and templates
- `src/routes/`: API endpoints

## Getting Started

### Prerequisites

- Python 3.9+
- FastAPI
- Necessary LLM backends (depends on your configuration)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/genius-online-navigator.git
   cd genius-online-navigator/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   uvicorn src.main:app --reload
   ```

5. Visit the API documentation at `http://localhost:8000/docs`

## Using the Agentic AI Framework

### Creating a Workflow

```python
from backend.src.agents.workflows.engine import (
    create_workflow,
    add_agent_node,
    add_tool_node,
    connect_nodes
)
from backend.src.agents.workflows.graph_engine import NodeType, EdgeCondition
from backend.src.agents.workflows.registry import get_workflow_registry

# Create a workflow
workflow = create_workflow(
    name="My Custom Workflow",
    description="A custom workflow example"
)

# Add nodes
research_node = add_agent_node(
    graph=workflow,
    id="research",
    name="Research",
    agent_name="researcher",
    agent_type="react",
    query="Research {topic} and provide key insights",
    max_steps=5
)

analysis_node = add_agent_node(
    graph=workflow,
    id="analysis",
    name="Analysis",
    agent_name="analyst",
    agent_type="react",
    query="Analyze the research findings and provide recommendations",
    max_steps=5,
    input_mappings=[
        {
            "source_node": "research",
            "source_key": "output.output",
            "target_key": "research_findings"
        }
    ]
)

# Connect nodes
connect_nodes(workflow, "start", research_node)
connect_nodes(workflow, research_node, analysis_node)
connect_nodes(workflow, analysis_node, "end")

# Register the workflow
registry = get_workflow_registry("./data/workflows")
workflow_id = registry.register_workflow(
    workflow=workflow,
    tags=["research", "analysis"],
    is_template=True,
    version="1.0.0"
)
```

### Executing a Workflow

```python
from backend.src.agents.workflows.engine import GraphWorkflowEngine
from backend.src.agents.workflows.registry import get_workflow_registry

# Get the workflow
registry = get_workflow_registry("./data/workflows")
workflow = registry.get_workflow("my_custom_workflow")

# Get agent and tool registries
agent_registry = get_agent_registry()
tool_registry = get_tool_registry()

# Initialize the workflow engine
engine = GraphWorkflowEngine(
    agent_registry=agent_registry,
    tool_registry=tool_registry
)

# Execute the workflow
result = await engine.execute_workflow(
    workflow=workflow,
    initial_context={"topic": "agentic AI"}
)

# Process the result
print(result)
```

### Using the API

The backend exposes several API endpoints for managing workflows:

- `GET /workflows/`: List available workflows
- `POST /workflows/instances`: Create a workflow instance from a template
- `POST /workflows/templates/seo`: Create an SEO content optimization workflow
- `POST /workflows/{workflow_id}/execute`: Execute a workflow
- `GET /workflows/executions/{execution_id}`: Get workflow execution results

Example using curl:

```bash
# Create an SEO workflow
curl -X POST "http://localhost:8000/workflows/templates/seo" \
  -H "Content-Type: application/json" \
  -d '{"content_topic": "Agentic AI in marketing"}'

# Execute a workflow
curl -X POST "http://localhost:8000/workflows/{workflow_id}/execute" \
  -H "Content-Type: application/json" \
  -d '{"initial_context": {"topic": "Agentic AI"}}'
```

## Extending the Framework

### Adding a New Agent

1. Create a new agent class in `src/agents/core/`:

```python
from .base_agent import AgentCore
from .agent_types import AgentConfig, Task, AgentResult

class MyCustomAgent(AgentCore):
    """Custom agent implementation"""
    
    def __init__(self, config: AgentConfig):
        """Initialize the agent"""
        super().__init__(config)
        # Add custom initialization
    
    async def execute(self, task: Task) -> AgentResult:
        """Execute a task using the agent"""
        # Implement custom execution logic
        result = await super().execute(task)
        # Add custom post-processing
        return result
```

### Adding a New Tool

1. Create a new tool in `src/agents/tools/custom/`:

```python
async def my_custom_tool(params: dict) -> dict:
    """A custom tool for the agent to use"""
    # Implement tool logic
    return {"result": "Tool output"}
```

2. Register the tool:

```python
from backend.src.agents.tools import get_tool_registry

registry = get_tool_registry()
registry.register_tool(
    "my_custom_tool", 
    my_custom_tool,
    "A custom tool for the agent to use"
)
```

### Creating a Custom Workflow Template

1. Create a new template in `src/agents/workflows/templates/`:

```python
from ..engine import (
    create_workflow,
    add_agent_node,
    add_tool_node,
    connect_nodes
)
from ..registry import get_workflow_registry

def create_custom_workflow_template() -> str:
    """Create and register a custom workflow template"""
    # Create workflow
    workflow = create_workflow(
        name="Custom Workflow",
        description="A custom workflow template"
    )
    
    # Add nodes and connections
    # ...
    
    # Register the template
    registry = get_workflow_registry("./data/workflows")
    workflow_id = registry.register_workflow(
        workflow=workflow,
        tags=["custom"],
        is_template=True
    )
    
    return workflow_id
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
