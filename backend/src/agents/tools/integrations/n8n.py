"""n8n Workflow Integration tools for AgentForge OSS
This module provides integration with n8n workflow automation platform.
"""

from typing import Dict, List, Any, Optional
import logging
import aiohttp
import json
from datetime import datetime

from ...core.marketing_types import N8nWorkflowConfig

logger = logging.getLogger(__name__)

class N8nWorkflowToolset:
    """n8n Workflow Integration toolset for marketing agents"""
    
    def __init__(self, config: N8nWorkflowConfig):
        """Initialize the n8n Workflow Integration toolset with configuration"""
        self.config = config
        self.tools = self._register_tools()
        self.session = None
        logger.info(f"n8n Workflow Integration toolset initialized with {len(self.tools)} tools")
    
    def _register_tools(self) -> Dict[str, Any]:
        """Register all n8n Workflow Integration tools"""
        return {
            "create_or_update_workflow": self.create_or_update_workflow,
            "activate_workflow": self.activate_workflow,
            "deactivate_workflow": self.deactivate_workflow,
            "execute_workflow": self.execute_workflow,
            "get_workflow_status": self.get_workflow_status,
        }
    
    async def _get_session(self):
        """Get or create an HTTP session"""
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession(headers={
                "X-N8N-API-KEY": self.config.api_key,
                "Content-Type": "application/json"
            })
        return self.session
    
    async def create_or_update_workflow(self, name: str, trigger_type: str, 
                                      actions: List[Dict[str, Any]], 
                                      schedule: Optional[str] = None) -> Dict[str, Any]:
        """Create or update an n8n workflow"""
        logger.info(f"Creating or updating n8n workflow: {name}")
        
        # Check if workflow already exists
        workflow_id = self.config.workflows.get(name)
        
        # Prepare workflow data
        workflow_data = {
            "name": name,
            "nodes": [],
            "connections": {},
            "active": False,
            "settings": {
                "saveExecutionProgress": True,
                "saveManualExecutions": True,
                "callerPolicy": "workflowsFromSameOwner"
            }
        }
        
        # Add trigger node based on type
        if trigger_type == "scheduled":
            trigger_node = {
                "id": "n1",
                "name": "Schedule Trigger",
                "type": "n8n-nodes-base.scheduleTrigger",
                "parameters": {
                    "rule": schedule or "0 0 * * *"  # Default: daily at midnight
                },
                "position": [250, 300]
            }
        elif trigger_type == "webhook":
            trigger_node = {
                "id": "n1",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "parameters": {
                    "path": f"/trigger/{name.lower().replace(' ', '_')}",
                    "responseMode": "onReceived"
                },
                "position": [250, 300]
            }
        else:
            trigger_node = {
                "id": "n1",
                "name": "Manual Trigger",
                "type": "n8n-nodes-base.manualTrigger",
                "parameters": {},
                "position": [250, 300]
            }
        
        workflow_data["nodes"].append(trigger_node)
        
        # Add action nodes
        for i, action in enumerate(actions, start=2):
            action_type = action.get("type", "httpRequest")
            action_params = action.get("parameters", {})
            
            action_node = {
                "id": f"n{i}",
                "name": action.get("name", f"Action {i-1}"),
                "type": f"n8n-nodes-base.{action_type}",
                "parameters": action_params,
                "position": [250 + ((i-1) * 200), 300]
            }
            
            workflow_data["nodes"].append(action_node)
            
            # Connect to previous node
            if i == 2:
                # Connect first action to trigger
                workflow_data["connections"]["n1"] = [{
                    "node": f"n{i}",
                    "type": "main",
                    "index": 0
                }]
            else:
                # Connect to previous action
                workflow_data["connections"][f"n{i-1}"] = [{
                    "node": f"n{i}",
                    "type": "main",
                    "index": 0
                }]
        
        # Make API request to create or update workflow
        session = await self._get_session()
        
        if workflow_id:
            # Update existing workflow
            url = f"{self.config.workflow_url}/workflows/{workflow_id}"
            async with session.put(url, json=workflow_data) as response:
                if response.status == 200:
                    result = await response.json()
                    self.config.workflows[name] = result["id"]
                    return result
                else:
                    error_text = await response.text()
                    logger.error(f"Failed to update workflow: {error_text}")
                    return {"error": f"Failed to update workflow: {response.status}", "details": error_text}
        else:
            # Create new workflow
            url = f"{self.config.workflow_url}/workflows"
            async with session.post(url, json=workflow_data) as response:
                if response.status == 200:
                    result = await response.json()
                    self.config.workflows[name] = result["id"]
                    return result
                else:
                    error_text = await response.text()
                    logger.error(f"Failed to create workflow: {error_text}")
                    return {"error": f"Failed to create workflow: {response.status}", "details": error_text}
    
    async def activate_workflow(self, workflow_id: str) -> Dict[str, Any]:
        """Activate an n8n workflow"""
        logger.info(f"Activating n8n workflow: {workflow_id}")
        
        session = await self._get_session()
        url = f"{self.config.workflow_url}/workflows/{workflow_id}/activate"
        
        async with session.post(url) as response:
            if response.status == 200:
                result = await response.json()
                # Add to active workflows list
                if workflow_id not in self.config.active_workflows:
                    self.config.active_workflows.append(workflow_id)
                return result
            else:
                error_text = await response.text()
                logger.error(f"Failed to activate workflow: {error_text}")
                return {"error": f"Failed to activate workflow: {response.status}", "details": error_text}
    
    async def deactivate_workflow(self, workflow_id: str) -> Dict[str, Any]:
        """Deactivate an n8n workflow"""
        logger.info(f"Deactivating n8n workflow: {workflow_id}")
        
        session = await self._get_session()
        url = f"{self.config.workflow_url}/workflows/{workflow_id}/deactivate"
        
        async with session.post(url) as response:
            if response.status == 200:
                result = await response.json()
                # Remove from active workflows list
                if workflow_id in self.config.active_workflows:
                    self.config.active_workflows.remove(workflow_id)
                return result
            else:
                error_text = await response.text()
                logger.error(f"Failed to deactivate workflow: {error_text}")
                return {"error": f"Failed to deactivate workflow: {response.status}", "details": error_text}
    
    async def execute_workflow(self, workflow_id: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute an n8n workflow with optional data"""
        logger.info(f"Executing n8n workflow: {workflow_id}")
        
        session = await self._get_session()
        url = f"{self.config.workflow_url}/workflows/{workflow_id}/execute"
        
        payload = {}
        if data:
            payload["data"] = data
        
        async with session.post(url, json=payload) as response:
            if response.status == 200:
                return await response.json()
            else:
                error_text = await response.text()
                logger.error(f"Failed to execute workflow: {error_text}")
                return {"error": f"Failed to execute workflow: {response.status}", "details": error_text}
    
    async def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """Get the status of an n8n workflow"""
        logger.info(f"Getting status of n8n workflow: {workflow_id}")
        
        session = await self._get_session()
        url = f"{self.config.workflow_url}/workflows/{workflow_id}"
        
        async with session.get(url) as response:
            if response.status == 200:
                workflow = await response.json()
                
                # Get recent executions
                executions_url = f"{self.config.workflow_url}/executions?workflowId={workflow_id}&limit=5"
                async with session.get(executions_url) as exec_response:
                    if exec_response.status == 200:
                        executions = await exec_response.json()
                        workflow["recent_executions"] = executions
                    else:
                        workflow["recent_executions"] = {"error": "Failed to fetch executions"}
                
                return workflow
            else:
                error_text = await response.text()
                logger.error(f"Failed to get workflow status: {error_text}")
                return {"error": f"Failed to get workflow status: {response.status}", "details": error_text}
    
    async def close(self):
        """Close the HTTP session"""
        if self.session and not self.session.closed:
            await self.session.close()