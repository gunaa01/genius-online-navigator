"""
Workflow module for the AgentForge OSS framework.
This module provides unified interfaces for different workflow engines.
"""

import logging
from typing import Dict, List, Any, Optional

from ..core.agent_types import WorkflowEngineType, WorkflowConfig

logger = logging.getLogger(__name__)

def get_workflow_engine(config: WorkflowConfig) -> 'BaseWorkflow':
    """Factory function to get the appropriate workflow engine"""
    if config.backend == WorkflowEngineType.PREFECT:
        from .prefect import PrefectWorkflow
        return PrefectWorkflow(config)
    elif config.backend == WorkflowEngineType.WINDMILL:
        from .windmill import WindmillWorkflow
        return WindmillWorkflow(config)
    elif config.backend == WorkflowEngineType.LANGGRAPH:
        from .langgraph_workflow import LangGraphWorkflow
        return LangGraphWorkflow(config)
    else:
        raise ValueError(f"Unsupported workflow engine: {config.backend}")

class BaseWorkflow:
    """Base class for workflow engines"""
    
    def __init__(self, config: WorkflowConfig):
        """Initialize the workflow engine with a configuration"""
        self.config = config
    
    async def create_workflow(self, workflow_spec: Dict[str, Any]) -> str:
        """
        Create a new workflow from a specification.
        
        Args:
            workflow_spec: The workflow specification
            
        Returns:
            The workflow ID
        """
        raise NotImplementedError("Subclasses must implement this method")
    
    async def execute_workflow(self, workflow_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a workflow with the given context.
        
        Args:
            workflow_id: The ID of the workflow to execute
            context: The execution context
            
        Returns:
            The workflow execution result
        """
        raise NotImplementedError("Subclasses must implement this method")
    
    async def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """
        Get the status of a workflow.
        
        Args:
            workflow_id: The ID of the workflow
            
        Returns:
            The workflow status
        """
        raise NotImplementedError("Subclasses must implement this method")
    
    async def cancel_workflow(self, workflow_id: str) -> bool:
        """
        Cancel a running workflow.
        
        Args:
            workflow_id: The ID of the workflow to cancel
            
        Returns:
            True if the workflow was successfully canceled, False otherwise
        """
        raise NotImplementedError("Subclasses must implement this method")
    
    async def list_workflows(self, status: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        List workflows, optionally filtered by status.
        
        Args:
            status: The status to filter by (e.g., 'running', 'completed', 'failed')
            limit: The maximum number of workflows to return
            
        Returns:
            A list of workflow information
        """
        raise NotImplementedError("Subclasses must implement this method") 