"""
Workflow Registry for Genius Navigator

This module provides a registry for managing and storing workflow definitions,
making them discoverable and reusable across the application.
"""

from typing import Dict, List, Optional, Any, Callable, Set, Union
import json
import os
import logging
from datetime import datetime
from uuid import UUID, uuid4

from .graph_engine import WorkflowGraph

logger = logging.getLogger(__name__)


class WorkflowRegistry:
    """Registry for managing and storing workflow definitions"""
    
    def __init__(self, storage_path: str = None):
        """Initialize the workflow registry"""
        self.workflows: Dict[str, WorkflowGraph] = {}
        self.metadata: Dict[str, Dict[str, Any]] = {}
        self.storage_path = storage_path
        
        # Create storage directory if it doesn't exist
        if self.storage_path and not os.path.exists(self.storage_path):
            os.makedirs(self.storage_path, exist_ok=True)
        
        # Load workflows from storage if available
        if self.storage_path:
            self._load_workflows()
    
    def register_workflow(self, workflow: WorkflowGraph, tags: List[str] = None,
                        description: str = None, version: str = "1.0.0",
                        is_template: bool = False) -> str:
        """Register a workflow with the registry"""
        # Generate a unique ID for the workflow if it doesn't have one
        workflow_id = workflow.name.lower().replace(" ", "_")
        
        # Check if workflow already exists
        if workflow_id in self.workflows:
            # If it exists, we're updating it
            logger.info(f"Updating existing workflow: {workflow_id}")
            
            # Update existing metadata
            self.metadata[workflow_id].update({
                "last_updated": datetime.now().isoformat(),
                "version": version,
            })
            
            if tags:
                self.metadata[workflow_id]["tags"] = tags
            
            if description:
                self.metadata[workflow_id]["description"] = description
            
            if is_template is not None:
                self.metadata[workflow_id]["is_template"] = is_template
        else:
            # Create new metadata for the workflow
            self.metadata[workflow_id] = {
                "id": workflow_id,
                "name": workflow.name,
                "description": description or workflow.description,
                "tags": tags or [],
                "created_at": datetime.now().isoformat(),
                "last_updated": datetime.now().isoformat(),
                "version": version,
                "is_template": is_template,
                "usage_count": 0
            }
            
            logger.info(f"Registered new workflow: {workflow_id}")
        
        # Store the workflow
        self.workflows[workflow_id] = workflow
        
        # Save to persistent storage
        if self.storage_path:
            self._save_workflow(workflow_id)
        
        return workflow_id
    
    def get_workflow(self, workflow_id: str) -> Optional[WorkflowGraph]:
        """Get a workflow by ID"""
        workflow = self.workflows.get(workflow_id)
        
        if workflow and self.metadata.get(workflow_id):
            # Update usage count
            self.metadata[workflow_id]["usage_count"] += 1
            
            if self.storage_path:
                # Save updated metadata
                self._save_workflow_metadata(workflow_id)
        
        return workflow
    
    def list_workflows(self, tags: List[str] = None,
                      is_template: bool = None) -> List[Dict[str, Any]]:
        """List workflows with optional filtering"""
        results = []
        
        for workflow_id, metadata in self.metadata.items():
            # Apply filters
            if tags and not any(tag in metadata.get("tags", []) for tag in tags):
                continue
            
            if is_template is not None and metadata.get("is_template") != is_template:
                continue
            
            # Add to results
            results.append(metadata)
        
        return results
    
    def delete_workflow(self, workflow_id: str) -> bool:
        """Delete a workflow by ID"""
        if workflow_id not in self.workflows:
            return False
        
        # Remove from memory
        del self.workflows[workflow_id]
        del self.metadata[workflow_id]
        
        # Remove from storage
        if self.storage_path:
            workflow_path = os.path.join(self.storage_path, f"{workflow_id}.json")
            if os.path.exists(workflow_path):
                os.remove(workflow_path)
                logger.info(f"Deleted workflow file: {workflow_path}")
        
        logger.info(f"Deleted workflow: {workflow_id}")
        return True
    
    def create_workflow_instance(self, template_id: str, instance_name: str,
                               instance_description: str = None) -> Optional[str]:
        """Create a new workflow instance from a template"""
        template = self.get_workflow(template_id)
        
        if not template:
            logger.error(f"Template not found: {template_id}")
            return None
        
        # Check if it's actually a template
        if not self.metadata.get(template_id, {}).get("is_template", False):
            logger.warning(f"Workflow {template_id} is not marked as a template")
        
        # Create a copy of the template
        template_dict = template.to_dict()
        instance_graph = WorkflowGraph.from_dict(template_dict)
        
        # Update name and description
        instance_graph.name = instance_name
        instance_graph.description = instance_description or template.description
        
        # Register the instance
        instance_id = self.register_workflow(
            workflow=instance_graph,
            description=instance_description,
            tags=self.metadata.get(template_id, {}).get("tags", []),
            is_template=False
        )
        
        # Track template relationship
        self.metadata[instance_id]["template_id"] = template_id
        
        if self.storage_path:
            self._save_workflow_metadata(instance_id)
        
        return instance_id
    
    def _save_workflow(self, workflow_id: str) -> None:
        """Save a workflow to persistent storage"""
        if not self.storage_path:
            return
        
        workflow = self.workflows.get(workflow_id)
        metadata = self.metadata.get(workflow_id)
        
        if not workflow or not metadata:
            return
        
        # Create the storage data
        storage_data = {
            "metadata": metadata,
            "workflow": workflow.to_dict()
        }
        
        # Save to file
        workflow_path = os.path.join(self.storage_path, f"{workflow_id}.json")
        with open(workflow_path, "w") as f:
            json.dump(storage_data, f, indent=2)
        
        logger.info(f"Saved workflow to: {workflow_path}")
    
    def _save_workflow_metadata(self, workflow_id: str) -> None:
        """Save only the metadata for a workflow"""
        if not self.storage_path:
            return
        
        metadata = self.metadata.get(workflow_id)
        
        if not metadata:
            return
        
        # Load existing data
        workflow_path = os.path.join(self.storage_path, f"{workflow_id}.json")
        if not os.path.exists(workflow_path):
            return
        
        try:
            with open(workflow_path, "r") as f:
                storage_data = json.load(f)
            
            # Update metadata
            storage_data["metadata"] = metadata
            
            # Save back to file
            with open(workflow_path, "w") as f:
                json.dump(storage_data, f, indent=2)
            
            logger.debug(f"Updated workflow metadata: {workflow_path}")
        
        except Exception as e:
            logger.error(f"Error updating workflow metadata: {e}")
    
    def _load_workflows(self) -> None:
        """Load all workflows from persistent storage"""
        if not self.storage_path or not os.path.exists(self.storage_path):
            return
        
        # Get all JSON files in the storage directory
        workflow_files = [
            f for f in os.listdir(self.storage_path)
            if f.endswith(".json") and os.path.isfile(os.path.join(self.storage_path, f))
        ]
        
        for workflow_file in workflow_files:
            try:
                # Load the workflow data
                with open(os.path.join(self.storage_path, workflow_file), "r") as f:
                    storage_data = json.load(f)
                
                # Extract metadata and workflow
                metadata = storage_data.get("metadata", {})
                workflow_dict = storage_data.get("workflow", {})
                
                # Create the workflow graph
                workflow_id = metadata.get("id")
                
                if not workflow_id:
                    logger.warning(f"Skipping workflow with missing ID: {workflow_file}")
                    continue
                
                # Create the workflow graph
                workflow = WorkflowGraph.from_dict(workflow_dict)
                
                # Add to registry
                self.workflows[workflow_id] = workflow
                self.metadata[workflow_id] = metadata
                
                logger.info(f"Loaded workflow: {workflow_id}")
            
            except Exception as e:
                logger.error(f"Error loading workflow from {workflow_file}: {e}")


# Global workflow registry instance
workflow_registry = None


def get_workflow_registry(storage_path: str = None) -> WorkflowRegistry:
    """Get the global workflow registry instance"""
    global workflow_registry
    
    if workflow_registry is None:
        workflow_registry = WorkflowRegistry(storage_path)
    
    return workflow_registry 