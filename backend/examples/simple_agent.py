"""
Simple Agent Example for AgentForge OSS.

This example demonstrates how to create and use a single agent with 
the AgentForge OSS framework.
"""

import asyncio
import os
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Add parent directory to Python path
import sys
sys.path.append(str(Path(__file__).parent.parent))

# Import AgentForge components
from src.agents.core import AgentCore, Task
from src.agents.core.agent_types import (
    AgentConfig, LLMConfig, MemoryConfig, ToolConfig, 
    WorkflowConfig, TracerConfig, AgentType, 
    LLMBackendType, MemoryBackendType, WorkflowEngineType
)

async def main():
    """Run a simple agent example"""
    logging.info("Starting AgentForge simple agent example")
    
    # Define the agent configuration
    config = AgentConfig(
        llm_config=LLMConfig(
            backend=LLMBackendType.LLAMA_CPP,  # Use llama.cpp instead of vLLM for wider compatibility
            model_path="models/mistral-7b-instruct-v0.2.Q4_K_M.gguf",  # Path to your model file
            max_tokens=2048,
            temperature=0.7,
            top_p=0.95,
            quantization="GGUF"  # Using GGUF quantization
        ),
        memory_config=MemoryConfig(
            backend=MemoryBackendType.QDRANT,
            connection_string="./data/qdrant",  # Local Qdrant storage
            collection_name="agent_memory"
        ),
        tools_config=ToolConfig(
            allowed_tools=["search", "calculator", "datetime"],
            sandbox_mode=True,
            timeout_seconds=30
        ),
        workflow_config=WorkflowConfig(
            backend=WorkflowEngineType.PREFECT,
            connection_string=""  # Local Prefect instance
        ),
        tracer_config=TracerConfig(
            enabled=True,
            storage_path="./data/traces"
        ),
        name="SimpleAgent",
        description="A simple demonstration agent for AgentForge OSS"
    )
    
    # Initialize directories
    os.makedirs("./data/qdrant", exist_ok=True)
    os.makedirs("./data/traces", exist_ok=True)
    os.makedirs("./models", exist_ok=True)
    
    # Check if model exists, otherwise print instructions
    if not os.path.exists(config.llm_config.model_path):
        logging.warning(f"Model file not found: {config.llm_config.model_path}")
        logging.info(
            "Please download a GGUF model file and place it in the models directory. "
            "You can download models from https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF"
        )
        return
    
    try:
        # Create the agent
        agent = AgentCore(config)
        logging.info("Agent created successfully")
        
        # Create a task
        task = Task(
            query="What is the capital of France, and what is the current time there?",
            agent_type=AgentType.REACT,
            max_steps=5
        )
        logging.info(f"Created task: {task.query}")
        
        # Execute the task
        logging.info("Executing task...")
        result = await agent.execute(task)
        
        # Display the result
        logging.info(f"Task completed: Success={result.success}")
        logging.info(f"Output: {result.output}")
        
        # Display the agent's thoughts
        logging.info("Agent thoughts:")
        for i, thought in enumerate(result.thoughts):
            logging.info(f"  Thought {i+1}: {thought}")
        
        # Display the actions taken
        logging.info("Agent actions:")
        for i, action in enumerate(result.actions):
            tool = action.get("tool", "unknown")
            input_data = action.get("tool_input", "")
            result_data = action.get("result", "")
            logging.info(f"  Action {i+1}: Used {tool} with input: {input_data}")
            logging.info(f"    Result: {result_data}")
        
    except Exception as e:
        logging.error(f"Error executing agent: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main()) 