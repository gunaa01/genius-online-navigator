"""
Workflow API Endpoints

This module provides API endpoints for creating, managing, and executing
workflow instances using the workflow engine.
"""

from typing import Dict, List, Optional, Any
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query
from pydantic import BaseModel, Field

# Import workflow components
from ...agents.workflows.registry import get_workflow_registry
from ...agents.workflows.engine import GraphWorkflowEngine
from ...agents.workflows.templates.seo_workflow import (
    create_seo_workflow_template,
    create_seo_workflow_instance,
    run_seo_workflow
)

# Import agent and tool registries
from ...agents.core.base_agent import AgentCore
from ...agents.tools import ToolRegistry

# Create router
router = APIRouter(prefix="/workflows", tags=["workflows"])


# Dependencies
def get_agent_registry():
    """Get the agent registry"""
    # This would be implemented based on your actual agent registry
    # For now, return a mock registry
    return {
        "seo_analyst": AgentCore({}),
        "content_strategist": AgentCore({}),
        "content_writer": AgentCore({}),
        "editor": AgentCore({})
    }


def get_tool_registry():
    """Get the tool registry"""
    # This would be implemented based on your actual tool registry
    # For now, return a mock registry
    registry = ToolRegistry({})
    return registry.tools


# Models
class WorkflowMetadata(BaseModel):
    """Workflow metadata model"""
    id: str
    name: str
    description: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    created_at: str
    last_updated: str
    version: str
    is_template: bool
    usage_count: int


class WorkflowListResponse(BaseModel):
    """Response model for listing workflows"""
    workflows: List[WorkflowMetadata]
    count: int


class WorkflowInstanceRequest(BaseModel):
    """Request model for creating a workflow instance"""
    template_id: str
    name: str
    description: Optional[str] = None
    initial_context: Dict[str, Any] = Field(default_factory=dict)


class WorkflowInstanceResponse(BaseModel):
    """Response model for workflow instance operations"""
    workflow_id: str
    name: str
    status: str = "created"
    initial_context: Dict[str, Any] = Field(default_factory=dict)


class SEOWorkflowRequest(BaseModel):
    """Request model for SEO workflow creation"""
    content_topic: str
    instance_name: Optional[str] = None


class WorkflowExecuteResponse(BaseModel):
    """Response model for workflow execution"""
    execution_id: str
    workflow_id: str
    status: str
    message: str


class WorkflowResult(BaseModel):
    """Response model for workflow results"""
    workflow_id: str
    execution_id: str
    status: str
    results: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None


# Active executions tracking
active_executions: Dict[str, Dict[str, Any]] = {}


# Routes
@router.get("/", response_model=WorkflowListResponse)
async def list_workflows(
    tags: Optional[List[str]] = Query(None),
    is_template: Optional[bool] = Query(None)
):
    """List available workflows with optional filtering"""
    registry = get_workflow_registry("./data/workflows")
    
    workflows = registry.list_workflows(tags=tags, is_template=is_template)
    
    return {
        "workflows": workflows,
        "count": len(workflows)
    }


@router.get("/{workflow_id}", response_model=WorkflowMetadata)
async def get_workflow(workflow_id: str):
    """Get details of a specific workflow"""
    registry = get_workflow_registry("./data/workflows")
    
    # Get the workflow
    workflow = registry.get_workflow(workflow_id)
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Get metadata
    metadata = registry.metadata.get(workflow_id)
    
    if not metadata:
        raise HTTPException(status_code=404, detail="Workflow metadata not found")
    
    return metadata


@router.post("/instances", response_model=WorkflowInstanceResponse)
async def create_workflow_instance(request: WorkflowInstanceRequest):
    """Create a new workflow instance from a template"""
    registry = get_workflow_registry("./data/workflows")
    
    # Create the instance
    instance_id = registry.create_workflow_instance(
        template_id=request.template_id,
        instance_name=request.name,
        instance_description=request.description
    )
    
    if not instance_id:
        raise HTTPException(status_code=404, detail="Template not found or instance creation failed")
    
    # Get the instance metadata
    metadata = registry.metadata.get(instance_id)
    
    return {
        "workflow_id": instance_id,
        "name": metadata.get("name", request.name),
        "status": "created",
        "initial_context": request.initial_context
    }


@router.post("/templates/seo", response_model=WorkflowInstanceResponse)
async def create_seo_workflow(request: SEOWorkflowRequest):
    """Create a new SEO content optimization workflow instance"""
    # Initialize the SEO workflow template if it doesn't exist
    registry = get_workflow_registry("./data/workflows")
    
    if "seo_content_optimization_workflow" not in registry.workflows:
        create_seo_workflow_template()
    
    # Create a workflow instance
    instance_info = create_seo_workflow_instance(
        content_topic=request.content_topic,
        instance_name=request.instance_name
    )
    
    if "error" in instance_info:
        raise HTTPException(status_code=500, detail=instance_info.get("error"))
    
    return {
        "workflow_id": instance_info.get("workflow_id"),
        "name": instance_info.get("name"),
        "status": "created",
        "initial_context": instance_info.get("initial_context")
    }


@router.post("/{workflow_id}/execute", response_model=WorkflowExecuteResponse)
async def execute_workflow(
    workflow_id: str,
    background_tasks: BackgroundTasks,
    initial_context: Dict[str, Any] = None
):
    """Execute a workflow asynchronously"""
    registry = get_workflow_registry("./data/workflows")
    
    # Get the workflow
    workflow = registry.get_workflow(workflow_id)
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Generate execution ID
    from uuid import uuid4
    execution_id = str(uuid4())
    
    # Store execution information
    active_executions[execution_id] = {
        "workflow_id": workflow_id,
        "status": "queued",
        "results": None,
        "error": None
    }
    
    # Schedule background task
    background_tasks.add_task(
        _execute_workflow_background,
        execution_id=execution_id,
        workflow_id=workflow_id,
        initial_context=initial_context or {}
    )
    
    return {
        "execution_id": execution_id,
        "workflow_id": workflow_id,
        "status": "queued",
        "message": "Workflow execution has been queued"
    }


@router.get("/executions/{execution_id}", response_model=WorkflowResult)
async def get_execution_result(execution_id: str):
    """Get the results of a workflow execution"""
    if execution_id not in active_executions:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    execution_info = active_executions[execution_id]
    
    return {
        "execution_id": execution_id,
        "workflow_id": execution_info.get("workflow_id"),
        "status": execution_info.get("status"),
        "results": execution_info.get("results") or {},
        "error": execution_info.get("error")
    }


# Background task function
async def _execute_workflow_background(execution_id: str, workflow_id: str, initial_context: Dict[str, Any]):
    """Execute a workflow in the background"""
    try:
        # Update status
        active_executions[execution_id]["status"] = "running"
        
        # Get dependencies
        registry = get_workflow_registry("./data/workflows")
        workflow = registry.get_workflow(workflow_id)
        agent_registry = get_agent_registry()
        tool_registry = get_tool_registry()
        
        # Initialize engine
        engine = GraphWorkflowEngine(
            agent_registry=agent_registry,
            tool_registry=tool_registry
        )
        
        # Execute workflow
        result = await engine.execute_workflow(
            workflow=workflow,
            initial_context=initial_context
        )
        
        # Update execution info
        active_executions[execution_id]["status"] = "completed"
        active_executions[execution_id]["results"] = result
    
    except Exception as e:
        # Handle errors
        active_executions[execution_id]["status"] = "error"
        active_executions[execution_id]["error"] = str(e)
        
        import logging
        logging.error(f"Error executing workflow {workflow_id}: {e}")


# Include this router in your main API router
def setup_workflow_routes(app):
    """Set up the workflow routes in the main FastAPI app"""
    app.include_router(router)
    
    # Initialize the workflow templates
    @app.on_event("startup")
    async def initialize_workflow_templates():
        """Initialize workflow templates at startup"""
        create_seo_workflow_template() 