"""
Workflow Engine for Genius Navigator

This module provides the execution engine for workflow graphs, handling the
orchestration of agent and tool nodes, managing state, and providing utilities
for workflow creation.
"""

from typing import Dict, List, Optional, Any, Callable, Set, Union, Tuple
import asyncio
import logging
from uuid import UUID, uuid4

from ..core.agent_types import Task, AgentResult, AgentType
from .graph_engine import (
    WorkflowGraph, 
    WorkflowNode, 
    WorkflowEdge, 
    WorkflowState,
    NodeType, 
    EdgeCondition
)

logger = logging.getLogger(__name__)


class GraphWorkflowEngine:
    """Workflow engine for executing agent workflows using a graph model"""
    
    def __init__(self, agent_registry: Dict[str, Any], tool_registry: Dict[str, Any]):
        """Initialize the workflow engine"""
        self.agent_registry = agent_registry
        self.tool_registry = tool_registry
        self.active_workflows: Dict[UUID, WorkflowState] = {}
    
    async def execute_workflow(self, workflow: WorkflowGraph, initial_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute a workflow from start to end"""
        # Validate the workflow
        errors = workflow.validate()
        if errors:
            raise ValueError(f"Invalid workflow: {', '.join(errors)}")
        
        # Initialize workflow state
        workflow_id = uuid4()
        state = WorkflowState(
            workflow_id=workflow_id,
            current_nodes={workflow.start_node},
            context=initial_context or {}
        )
        
        self.active_workflows[workflow_id] = state
        
        try:
            # Execute until completion
            while state.current_nodes and not all(node_id in workflow.end_nodes for node_id in state.current_nodes):
                # Get nodes to process in this iteration
                nodes_to_process = state.current_nodes.copy()
                state.current_nodes = set()
                
                # Process each node
                for node_id in nodes_to_process:
                    node = workflow.nodes[node_id]
                    
                    # Skip if already completed
                    if node_id in state.completed_nodes:
                        continue
                    
                    # Process the node
                    try:
                        result = await self._process_node(node, state)
                        state.results[node_id] = result
                        state.completed_nodes.add(node_id)
                        
                        # Get next nodes
                        next_nodes = workflow.get_next_nodes(node_id, result)
                        state.current_nodes.update(next_nodes)
                    
                    except Exception as e:
                        logger.error(f"Error processing node {node_id}: {e}")
                        # On error, try to find error edges
                        error_next_nodes = [
                            edge.target_node 
                            for edge in workflow.edges 
                            if edge.source_node == node_id and edge.condition == EdgeCondition.FAILURE
                        ]
                        
                        if error_next_nodes:
                            state.current_nodes.update(error_next_nodes)
                        else:
                            # If no error edges, mark as completed and continue
                            state.completed_nodes.add(node_id)
                            state.results[node_id] = {"error": str(e)}
                
                # Update state timestamp
                state.updated_at = asyncio.get_event_loop().time()
            
            # Create final result
            final_result = {
                "workflow_id": workflow_id,
                "completed": True,
                "results": state.results,
                "end_nodes": {node_id: state.results.get(node_id) for node_id in workflow.end_nodes if node_id in state.results}
            }
            
            return final_result
        
        finally:
            # Clean up workflow state
            if workflow_id in self.active_workflows:
                del self.active_workflows[workflow_id]
    
    async def _process_node(self, node: WorkflowNode, state: WorkflowState) -> Any:
        """Process a single workflow node"""
        if node.type == NodeType.START:
            # Start nodes don't do anything
            return {"status": "started"}
        
        elif node.type == NodeType.END:
            # End nodes just return the accumulated results
            return {"status": "completed", "results": state.results}
        
        elif node.type == NodeType.AGENT:
            # Execute an agent task
            agent_name = node.config.get("agent_name")
            if not agent_name or agent_name not in self.agent_registry:
                raise ValueError(f"Agent {agent_name} not found in registry")
            
            agent = self.agent_registry[agent_name]
            
            # Create task from node config
            task = Task(
                query=node.config.get("query", ""),
                agent_type=node.config.get("agent_type", "react"),
                max_steps=node.config.get("max_steps", 10),
                tools_allowed=node.config.get("tools_allowed", []),
                parameters=node.config.get("parameters", {})
            )
            
            # Add context from workflow state
            task_context = state.context.copy()
            for input_mapping in node.config.get("input_mappings", []):
                source_node = input_mapping.get("source_node")
                source_key = input_mapping.get("source_key", "output")
                target_key = input_mapping.get("target_key")
                
                if source_node and source_node in state.results and target_key:
                    source_value = state.results[source_node]
                    
                    # Extract nested value if needed
                    if source_key != "output":
                        source_keys = source_key.split(".")
                        for key in source_keys:
                            if isinstance(source_value, dict) and key in source_value:
                                source_value = source_value[key]
                            else:
                                source_value = None
                                break
                    
                    if source_value is not None:
                        task_context[target_key] = source_value
            
            # Execute agent task
            result = await agent.execute(task)
            
            # Process output mappings
            output = {"output": result}
            for output_mapping in node.config.get("output_mappings", []):
                source_key = output_mapping.get("source_key", "output")
                target_key = output_mapping.get("target_key")
                
                if target_key:
                    source_value = result
                    
                    # Extract nested value if needed
                    if source_key != "output":
                        source_keys = source_key.split(".")
                        for key in source_keys:
                            if isinstance(source_value, dict) and key in source_value:
                                source_value = source_value[key]
                            else:
                                source_value = None
                                break
                    
                    if source_value is not None:
                        output[target_key] = source_value
            
            return output
        
        elif node.type == NodeType.TOOL:
            # Execute a tool
            tool_name = node.config.get("tool_name")
            if not tool_name or tool_name not in self.tool_registry:
                raise ValueError(f"Tool {tool_name} not found in registry")
            
            tool = self.tool_registry[tool_name]
            
            # Prepare tool arguments
            tool_args = node.config.get("arguments", {}).copy()
            
            # Add context from workflow state
            for input_mapping in node.config.get("input_mappings", []):
                source_node = input_mapping.get("source_node")
                source_key = input_mapping.get("source_key", "output")
                target_key = input_mapping.get("target_key")
                
                if source_node and source_node in state.results and target_key:
                    source_value = state.results[source_node]
                    
                    # Extract nested value if needed
                    if source_key != "output":
                        source_keys = source_key.split(".")
                        for key in source_keys:
                            if isinstance(source_value, dict) and key in source_value:
                                source_value = source_value[key]
                            else:
                                source_value = None
                                break
                    
                    if source_value is not None:
                        tool_args[target_key] = source_value
            
            # Execute tool
            result = await tool.run(**tool_args)
            
            return result
        
        elif node.type == NodeType.CONDITIONAL:
            # Evaluate condition and return result
            condition_func = node.config.get("condition")
            if not condition_func or not callable(condition_func):
                raise ValueError(f"Conditional node {node.id} does not have a valid condition function")
            
            # Evaluate condition with workflow state context
            condition_result = condition_func(state.context)
            
            return {"result": condition_result}
        
        elif node.type == NodeType.MAP:
            # Execute a map operation over an input array
            input_key = node.config.get("input_key")
            if not input_key:
                raise ValueError(f"Map node {node.id} does not have an input key")
            
            # Get input array
            input_array = None
            for input_mapping in node.config.get("input_mappings", []):
                source_node = input_mapping.get("source_node")
                source_key = input_mapping.get("source_key", "output")
                target_key = input_mapping.get("target_key")
                
                if target_key == input_key and source_node in state.results:
                    source_value = state.results[source_node]
                    
                    # Extract nested value if needed
                    if source_key != "output":
                        source_keys = source_key.split(".")
                        for key in source_keys:
                            if isinstance(source_value, dict) and key in source_value:
                                source_value = source_value[key]
                            else:
                                source_value = None
                                break
                    
                    input_array = source_value
                    break
            
            if not input_array or not isinstance(input_array, list):
                raise ValueError(f"Map node {node.id} input is not a valid array")
            
            # Execute map operation
            map_func = node.config.get("map_function")
            if not map_func or not callable(map_func):
                raise ValueError(f"Map node {node.id} does not have a valid map function")
            
            results = []
            for item in input_array:
                result = await map_func(item, state.context)
                results.append(result)
            
            return {"results": results}
        
        elif node.type == NodeType.REDUCE:
            # Execute a reduce operation over results
            input_key = node.config.get("input_key")
            if not input_key:
                raise ValueError(f"Reduce node {node.id} does not have an input key")
            
            # Get input array
            input_array = None
            for input_mapping in node.config.get("input_mappings", []):
                source_node = input_mapping.get("source_node")
                source_key = input_mapping.get("source_key", "output")
                target_key = input_mapping.get("target_key")
                
                if target_key == input_key and source_node in state.results:
                    source_value = state.results[source_node]
                    
                    # Extract nested value if needed
                    if source_key != "output":
                        source_keys = source_key.split(".")
                        for key in source_keys:
                            if isinstance(source_value, dict) and key in source_value:
                                source_value = source_value[key]
                            else:
                                source_value = None
                                break
                    
                    input_array = source_value
                    break
            
            if not input_array or not isinstance(input_array, list):
                raise ValueError(f"Reduce node {node.id} input is not a valid array")
            
            # Execute reduce operation
            reduce_func = node.config.get("reduce_function")
            if not reduce_func or not callable(reduce_func):
                raise ValueError(f"Reduce node {node.id} does not have a valid reduce function")
            
            initial_value = node.config.get("initial_value")
            result = await reduce_func(input_array, initial_value, state.context)
            
            return {"result": result}
        
        elif node.type == NodeType.MERGE:
            # Merge results from multiple upstream nodes
            results = {}
            
            for input_mapping in node.config.get("input_mappings", []):
                source_node = input_mapping.get("source_node")
                source_key = input_mapping.get("source_key", "output")
                target_key = input_mapping.get("target_key")
                
                if source_node and source_node in state.results and target_key:
                    source_value = state.results[source_node]
                    
                    # Extract nested value if needed
                    if source_key != "output":
                        source_keys = source_key.split(".")
                        for key in source_keys:
                            if isinstance(source_value, dict) and key in source_value:
                                source_value = source_value[key]
                            else:
                                source_value = None
                                break
                    
                    if source_value is not None:
                        results[target_key] = source_value
            
            return results
        
        else:
            raise ValueError(f"Unsupported node type: {node.type}")


# Helper functions to build workflow graphs

def create_workflow(name: str, description: str = "") -> WorkflowGraph:
    """Create a new workflow graph"""
    graph = WorkflowGraph(name, description)
    
    # Add start and end nodes by default
    start_node = WorkflowNode(id="start", type=NodeType.START, name="Start")
    end_node = WorkflowNode(id="end", type=NodeType.END, name="End")
    
    graph.add_node(start_node)
    graph.add_node(end_node)
    
    return graph


def add_agent_node(graph: WorkflowGraph, id: str, name: str, agent_name: str, 
                   agent_type: str, query: str, **kwargs) -> str:
    """Add an agent node to the workflow graph"""
    node = WorkflowNode(
        id=id,
        type=NodeType.AGENT,
        name=name,
        config={
            "agent_name": agent_name,
            "agent_type": agent_type,
            "query": query,
            **kwargs
        }
    )
    
    return graph.add_node(node)


def add_tool_node(graph: WorkflowGraph, id: str, name: str, tool_name: str, 
                  arguments: Dict[str, Any] = None, **kwargs) -> str:
    """Add a tool node to the workflow graph"""
    node = WorkflowNode(
        id=id,
        type=NodeType.TOOL,
        name=name,
        config={
            "tool_name": tool_name,
            "arguments": arguments or {},
            **kwargs
        }
    )
    
    return graph.add_node(node)


def add_conditional_node(graph: WorkflowGraph, id: str, name: str, 
                        condition: Callable[[Dict[str, Any]], bool], **kwargs) -> str:
    """Add a conditional node to the workflow graph"""
    node = WorkflowNode(
        id=id,
        type=NodeType.CONDITIONAL,
        name=name,
        config={
            "condition": condition,
            **kwargs
        }
    )
    
    return graph.add_node(node)


def add_map_node(graph: WorkflowGraph, id: str, name: str, input_key: str,
                map_function: Callable[[Any, Dict[str, Any]], Any], **kwargs) -> str:
    """Add a map node to the workflow graph"""
    node = WorkflowNode(
        id=id,
        type=NodeType.MAP,
        name=name,
        config={
            "input_key": input_key,
            "map_function": map_function,
            **kwargs
        }
    )
    
    return graph.add_node(node)


def add_reduce_node(graph: WorkflowGraph, id: str, name: str, input_key: str,
                   reduce_function: Callable[[List[Any], Any, Dict[str, Any]], Any],
                   initial_value: Any = None, **kwargs) -> str:
    """Add a reduce node to the workflow graph"""
    node = WorkflowNode(
        id=id,
        type=NodeType.REDUCE,
        name=name,
        config={
            "input_key": input_key,
            "reduce_function": reduce_function,
            "initial_value": initial_value,
            **kwargs
        }
    )
    
    return graph.add_node(node)


def add_merge_node(graph: WorkflowGraph, id: str, name: str, **kwargs) -> str:
    """Add a merge node to the workflow graph"""
    node = WorkflowNode(
        id=id,
        type=NodeType.MERGE,
        name=name,
        config=kwargs
    )
    
    return graph.add_node(node)


def connect_nodes(graph: WorkflowGraph, source_id: str, target_id: str, 
                 condition: EdgeCondition = EdgeCondition.ALWAYS,
                 condition_func: Optional[Callable[[Dict[str, Any]], bool]] = None) -> None:
    """Connect two nodes in the workflow graph"""
    edge = WorkflowEdge(
        source_node=source_id,
        target_node=target_id,
        condition=condition,
        condition_func=condition_func
    )
    
    graph.add_edge(edge)