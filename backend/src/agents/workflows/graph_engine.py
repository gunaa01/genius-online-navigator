"""
LangGraph-inspired Workflow Engine for Genius Navigator

This module implements a graph-based workflow engine for orchestrating
complex agent workflows with multiple steps, conditional paths, and
iterative reasoning.
"""

from typing import Dict, List, Optional, Any, Callable, Set, Union, Tuple
import asyncio
import logging
from uuid import UUID, uuid4
from enum import Enum
from dataclasses import dataclass, field
import json

logger = logging.getLogger(__name__)


class NodeType(str, Enum):
    """Types of nodes in a workflow graph"""
    AGENT = "agent"
    TOOL = "tool"
    CONDITIONAL = "conditional"
    MERGE = "merge"
    MAP = "map"
    REDUCE = "reduce"
    START = "start"
    END = "end"


class EdgeCondition(str, Enum):
    """Condition types for conditional edges"""
    ALWAYS = "always"
    SUCCESS = "success"
    FAILURE = "failure"
    CUSTOM = "custom"


@dataclass
class WorkflowNode:
    """Representation of a node in the workflow graph"""
    id: str
    type: NodeType
    name: str
    config: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowEdge:
    """Representation of an edge in the workflow graph"""
    source_node: str
    target_node: str
    condition: EdgeCondition = EdgeCondition.ALWAYS
    condition_func: Optional[Callable[[Dict[str, Any]], bool]] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowState:
    """State tracking for workflow execution"""
    workflow_id: UUID
    current_nodes: Set[str]
    completed_nodes: Set[str] = field(default_factory=set)
    results: Dict[str, Any] = field(default_factory=dict)
    context: Dict[str, Any] = field(default_factory=dict)
    created_at: float = field(default_factory=lambda: asyncio.get_event_loop().time())
    updated_at: float = field(default_factory=lambda: asyncio.get_event_loop().time())
    metadata: Dict[str, Any] = field(default_factory=dict)


class WorkflowGraph:
    """Graph representation of an agent workflow"""
    
    def __init__(self, name: str, description: str = ""):
        """Initialize a new workflow graph"""
        self.name = name
        self.description = description
        self.nodes: Dict[str, WorkflowNode] = {}
        self.edges: List[WorkflowEdge] = []
        self.start_node: Optional[str] = None
        self.end_nodes: Set[str] = set()
    
    def add_node(self, node: WorkflowNode) -> str:
        """Add a node to the workflow graph"""
        self.nodes[node.id] = node
        
        # Set start and end nodes if applicable
        if node.type == NodeType.START:
            if self.start_node:
                raise ValueError("Workflow can only have one start node")
            self.start_node = node.id
        
        if node.type == NodeType.END:
            self.end_nodes.add(node.id)
        
        return node.id
    
    def add_edge(self, edge: WorkflowEdge) -> None:
        """Add an edge to the workflow graph"""
        # Validate the edge
        if edge.source_node not in self.nodes:
            raise ValueError(f"Source node {edge.source_node} not found in graph")
        
        if edge.target_node not in self.nodes:
            raise ValueError(f"Target node {edge.target_node} not found in graph")
        
        self.edges.append(edge)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the graph to a dictionary representation"""
        return {
            "name": self.name,
            "description": self.description,
            "nodes": {node_id: {
                "id": node.id,
                "type": node.type,
                "name": node.name,
                "config": node.config,
                "metadata": node.metadata
            } for node_id, node in self.nodes.items()},
            "edges": [{
                "source": edge.source_node,
                "target": edge.target_node,
                "condition": edge.condition,
                # We can't serialize the condition function, so we just note if it exists
                "has_condition_func": edge.condition_func is not None,
                "metadata": edge.metadata
            } for edge in self.edges],
            "start_node": self.start_node,
            "end_nodes": list(self.end_nodes)
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'WorkflowGraph':
        """Create a workflow graph from a dictionary representation"""
        graph = cls(data["name"], data.get("description", ""))
        
        # Add nodes
        for node_id, node_data in data["nodes"].items():
            graph.add_node(WorkflowNode(
                id=node_data["id"],
                type=NodeType(node_data["type"]),
                name=node_data["name"],
                config=node_data.get("config", {}),
                metadata=node_data.get("metadata", {})
            ))
        
        # Add edges
        for edge_data in data["edges"]:
            graph.add_edge(WorkflowEdge(
                source_node=edge_data["source"],
                target_node=edge_data["target"],
                condition=EdgeCondition(edge_data["condition"]),
                # We can't deserialize the condition function
                condition_func=None,
                metadata=edge_data.get("metadata", {})
            ))
        
        # Set start and end nodes
        graph.start_node = data.get("start_node")
        graph.end_nodes = set(data.get("end_nodes", []))
        
        return graph
    
    def get_next_nodes(self, node_id: str, result: Optional[Any] = None) -> List[str]:
        """Get the next nodes to execute after the given node"""
        next_nodes = []
        
        for edge in self.edges:
            if edge.source_node != node_id:
                continue
            
            # Check if edge condition is met
            condition_met = False
            
            if edge.condition == EdgeCondition.ALWAYS:
                condition_met = True
            elif edge.condition == EdgeCondition.SUCCESS:
                condition_met = result is not None and getattr(result, "success", False)
            elif edge.condition == EdgeCondition.FAILURE:
                condition_met = result is not None and not getattr(result, "success", True)
            elif edge.condition == EdgeCondition.CUSTOM and edge.condition_func:
                condition_met = edge.condition_func({"result": result})
            
            if condition_met:
                next_nodes.append(edge.target_node)
        
        return next_nodes
    
    def validate(self) -> List[str]:
        """Validate the workflow graph and return a list of errors"""
        errors = []
        
        # Check for start node
        if not self.start_node:
            errors.append("Workflow must have a start node")
        
        # Check for end nodes
        if not self.end_nodes:
            errors.append("Workflow must have at least one end node")
        
        # Check for unreachable nodes
        reachable_nodes = set()
        nodes_to_check = {self.start_node}
        
        while nodes_to_check:
            current_node = nodes_to_check.pop()
            reachable_nodes.add(current_node)
            
            for edge in self.edges:
                if edge.source_node == current_node and edge.target_node not in reachable_nodes:
                    nodes_to_check.add(edge.target_node)
        
        unreachable = set(self.nodes.keys()) - reachable_nodes
        if unreachable:
            errors.append(f"Unreachable nodes: {', '.join(unreachable)}")
        
        # Check for cycles if we have a DAG requirement
        # This is a simple cycle detection that may not catch all cycles
        for node_id in self.nodes:
            visited = set()
            if self._has_cycle(node_id, visited, set()):
                errors.append(f"Cycle detected starting from node {node_id}")
                break
        
        return errors
    
    def _has_cycle(self, node_id: str, visited: Set[str], stack: Set[str]) -> bool:
        """Check if there's a cycle in the graph using DFS"""
        visited.add(node_id)
        stack.add(node_id)
        
        for edge in self.edges:
            if edge.source_node == node_id:
                if edge.target_node not in visited:
                    if self._has_cycle(edge.target_node, visited, stack):
                        return True
                elif edge.target_node in stack:
                    return True
        
        stack.remove(node_id)
        return False 