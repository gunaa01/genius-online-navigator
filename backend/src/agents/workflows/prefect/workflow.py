"""
Prefect workflow implementation for AgentForge OSS.
Provides workflow orchestration using Prefect.
"""

import logging
import json
import uuid
import asyncio
from typing import Dict, List, Any, Optional, Union, Callable
import datetime

from ...core.agent_types import WorkflowConfig
from .. import BaseWorkflow

logger = logging.getLogger(__name__)

class PrefectWorkflow(BaseWorkflow):
    """Prefect-based workflow implementation"""
    
    def __init__(self, config: WorkflowConfig):
        """Initialize the Prefect workflow engine"""
        super().__init__(config)
        self.client = None
        self.flows = {}  # Local flow registry
        self._initialize_prefect()
    
    def _initialize_prefect(self):
        """Initialize Prefect client and connect to the Prefect API"""
        logger.info(f"Initializing Prefect with connection: {self.config.connection_string}")
        
        try:
            # Dynamically import Prefect to avoid hard dependency
            from prefect import get_client
            import importlib.util
            
            # Check if prefect is installed
            if importlib.util.find_spec("prefect") is None:
                raise ImportError("Prefect package not found")
            
            # Set Prefect API URL if provided
            if self.config.connection_string:
                import os
                os.environ["PREFECT_API_URL"] = self.config.connection_string
            
            # Create an async client
            async def create_client():
                return await get_client()
            
            # Run in event loop
            loop = asyncio.get_event_loop()
            self.client = loop.run_until_complete(create_client())
            
            logger.info("Prefect client initialized successfully")
        except ImportError:
            logger.warning("Prefect not installed, using simulated Prefect functionality")
            self.client = None
        except Exception as e:
            logger.error(f"Failed to initialize Prefect: {e}")
            self.client = None
            # Fall back to simulated implementation
            logger.warning("Using simulated Prefect functionality")
    
    async def _create_flow_from_spec(self, workflow_spec: Dict[str, Any]) -> Callable:
        """
        Create a Prefect flow from a workflow specification
        
        Args:
            workflow_spec: The workflow specification
            
        Returns:
            A Prefect flow function
        """
        if self.client is None:
            # Return a simulated flow function
            return self._create_simulated_flow(workflow_spec)
        
        try:
            from prefect import flow, task
            from prefect.flows import Flow
            
            # Parse the workflow specification
            flow_name = workflow_spec.get("name", f"flow_{uuid.uuid4()}")
            steps = workflow_spec.get("steps", {})
            
            # Create tasks for each step
            tasks = {}
            for step_id, step_config in steps.items():
                # Create a task for this step
                @task(name=f"{flow_name}.{step_id}")
                async def step_task(step_id=step_id, step_config=step_config, context=None):
                    logger.info(f"Executing step: {step_id}")
                    
                    # Execute the step function (simulated)
                    step_type = step_config.get("type", "generic")
                    
                    if step_type == "agent":
                        # This would execute another agent
                        return {"result": f"Agent execution for {step_id}", "success": True}
                    elif step_type == "tool":
                        # This would execute a tool
                        tool_name = step_config.get("tool", "")
                        tool_input = step_config.get("input", {})
                        return {"result": f"Tool {tool_name} execution for {step_id}", "success": True}
                    else:
                        # Generic step
                        return {"result": f"Executed step {step_id}", "success": True}
                
                tasks[step_id] = step_task
            
            # Create the flow
            @flow(name=flow_name)
            async def workflow_flow(context: Dict[str, Any] = None):
                """
                The generated workflow flow
                
                Args:
                    context: The execution context
                """
                context = context or {}
                results = {}
                
                # Execute the flow steps according to the DAG
                for step_id, step_config in steps.items():
                    # Check if dependencies are satisfied
                    dependencies = step_config.get("dependencies", [])
                    if all(dep in results for dep in dependencies):
                        # Execute the step
                        step_context = {**context, "previous_results": {dep: results[dep] for dep in dependencies}}
                        results[step_id] = await tasks[step_id].fn(step_id, step_config, step_context)
                    else:
                        logger.warning(f"Skipping step {step_id} due to unsatisfied dependencies")
                
                return {
                    "flow_name": flow_name,
                    "results": results,
                    "success": all(r.get("success", False) for r in results.values())
                }
            
            return workflow_flow
            
        except ImportError:
            logger.warning("Prefect tasks/flows not available, using simulated flow")
            return self._create_simulated_flow(workflow_spec)
    
    def _create_simulated_flow(self, workflow_spec: Dict[str, Any]) -> Callable:
        """Create a simulated flow when Prefect is not available"""
        flow_name = workflow_spec.get("name", f"flow_{uuid.uuid4()}")
        steps = workflow_spec.get("steps", {})
        
        async def simulated_flow(context: Dict[str, Any] = None):
            context = context or {}
            results = {}
            
            logger.info(f"Executing simulated flow: {flow_name}")
            
            # Execute steps in topological order (simplified)
            for step_id, step_config in steps.items():
                logger.info(f"Simulating step: {step_id}")
                
                # Wait for a short time to simulate processing
                await asyncio.sleep(0.5)
                
                # Generate a simulated result
                results[step_id] = {
                    "result": f"Simulated execution of {step_id}",
                    "success": True
                }
            
            return {
                "flow_name": flow_name,
                "results": results,
                "success": True
            }
        
        return simulated_flow
    
    async def create_workflow(self, workflow_spec: Dict[str, Any]) -> str:
        """
        Create a new workflow from a specification.
        
        Args:
            workflow_spec: The workflow specification
            
        Returns:
            The workflow ID
        """
        logger.info(f"Creating workflow: {workflow_spec.get('name', 'unnamed')}")
        
        try:
            # Generate a unique ID for this workflow
            workflow_id = str(uuid.uuid4())
            
            # Create a flow from the specification
            flow_func = await self._create_flow_from_spec(workflow_spec)
            
            # Store the flow in our local registry
            self.flows[workflow_id] = {
                "id": workflow_id,
                "spec": workflow_spec,
                "flow": flow_func,
                "created_at": datetime.datetime.now().isoformat(),
                "status": "created"
            }
            
            logger.info(f"Created workflow with ID: {workflow_id}")
            
            return workflow_id
        except Exception as e:
            logger.error(f"Error creating workflow: {e}")
            raise
    
    async def execute_workflow(self, workflow_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a workflow with the given context.
        
        Args:
            workflow_id: The ID of the workflow to execute
            context: The execution context
            
        Returns:
            The workflow execution result
        """
        logger.info(f"Executing workflow: {workflow_id}")
        
        if workflow_id not in self.flows:
            raise ValueError(f"Workflow not found: {workflow_id}")
        
        try:
            # Get the flow
            flow_data = self.flows[workflow_id]
            flow_func = flow_data["flow"]
            
            # Update status
            flow_data["status"] = "running"
            flow_data["started_at"] = datetime.datetime.now().isoformat()
            
            # Execute the flow
            result = await flow_func(context)
            
            # Update status
            flow_data["status"] = "completed" if result.get("success", False) else "failed"
            flow_data["completed_at"] = datetime.datetime.now().isoformat()
            flow_data["result"] = result
            
            logger.info(f"Workflow execution completed: {workflow_id}")
            
            return result
        except Exception as e:
            logger.error(f"Error executing workflow: {e}")
            
            # Update status
            if workflow_id in self.flows:
                self.flows[workflow_id]["status"] = "failed"
                self.flows[workflow_id]["error"] = str(e)
            
            raise
    
    async def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """
        Get the status of a workflow.
        
        Args:
            workflow_id: The ID of the workflow
            
        Returns:
            The workflow status
        """
        logger.debug(f"Getting status for workflow: {workflow_id}")
        
        if workflow_id not in self.flows:
            raise ValueError(f"Workflow not found: {workflow_id}")
        
        flow_data = self.flows[workflow_id]
        
        return {
            "id": workflow_id,
            "name": flow_data["spec"].get("name", "unnamed"),
            "status": flow_data["status"],
            "created_at": flow_data.get("created_at"),
            "started_at": flow_data.get("started_at"),
            "completed_at": flow_data.get("completed_at"),
            "error": flow_data.get("error")
        }
    
    async def cancel_workflow(self, workflow_id: str) -> bool:
        """
        Cancel a running workflow.
        
        Args:
            workflow_id: The ID of the workflow to cancel
            
        Returns:
            True if the workflow was successfully canceled, False otherwise
        """
        logger.info(f"Canceling workflow: {workflow_id}")
        
        if workflow_id not in self.flows:
            logger.warning(f"Workflow not found: {workflow_id}")
            return False
        
        flow_data = self.flows[workflow_id]
        
        if flow_data["status"] != "running":
            logger.warning(f"Cannot cancel workflow with status: {flow_data['status']}")
            return False
        
        # Update status
        flow_data["status"] = "canceled"
        flow_data["completed_at"] = datetime.datetime.now().isoformat()
        
        logger.info(f"Workflow canceled: {workflow_id}")
        
        return True
    
    async def list_workflows(self, status: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        List workflows, optionally filtered by status.
        
        Args:
            status: The status to filter by (e.g., 'running', 'completed', 'failed')
            limit: The maximum number of workflows to return
            
        Returns:
            A list of workflow information
        """
        logger.debug(f"Listing workflows with status: {status or 'any'}")
        
        # Filter workflows by status if provided
        filtered_flows = [
            {
                "id": wf_id,
                "name": data["spec"].get("name", "unnamed"),
                "status": data["status"],
                "created_at": data.get("created_at"),
                "started_at": data.get("started_at"),
                "completed_at": data.get("completed_at")
            }
            for wf_id, data in self.flows.items()
            if status is None or data["status"] == status
        ]
        
        # Sort by created_at (newest first) and limit
        return sorted(
            filtered_flows,
            key=lambda wf: wf.get("created_at", ""),
            reverse=True
        )[:limit] 