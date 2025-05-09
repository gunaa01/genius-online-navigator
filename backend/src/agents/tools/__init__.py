"""
Tool Registry for AgentForge

This module provides a registry for managing and accessing tools
that can be used by agents in the system.
"""

from typing import Dict, List, Any, Optional, Union, Callable
import asyncio
import logging

logger = logging.getLogger(__name__)


class ToolRegistry:
    """Registry for agent tools"""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize the tool registry"""
        self.config = config
        self.tools: Dict[str, Any] = {}
        self.allowed_tools = config.get("allowed_tools", [])
        self.sandbox_mode = config.get("sandbox_mode", True)
        self.timeout_seconds = config.get("timeout_seconds", 30)
        
        # Initialize default tools
        self._init_default_tools()
    
    def _init_default_tools(self) -> None:
        """Initialize default tools"""
        # This is a placeholder - actual implementation would load tools
        pass
    
    def register_tool(self, name: str, tool: Any, description: str = None) -> None:
        """Register a tool with the registry"""
        # Check if tool is allowed
        if self.allowed_tools and name not in self.allowed_tools:
            logger.warning(f"Tool {name} is not in the allowed tools list")
            if self.sandbox_mode:
                logger.error(f"Tool {name} registration blocked due to sandbox mode")
                return
        
        self.tools[name] = tool
        
        # Set description if provided and tool doesn't already have one
        if description and not hasattr(tool, "description"):
            setattr(tool, "description", description)
        
        logger.info(f"Registered tool: {name}")
    
    def get_tool(self, name: str) -> Optional[Any]:
        """Get a tool by name"""
        return self.tools.get(name)
    
    def list_tools(self) -> List[str]:
        """List available tools"""
        return list(self.tools.keys())
    
    def get_tools_by_category(self, category: str) -> Dict[str, Any]:
        """Get tools by category"""
        return {
            name: tool for name, tool in self.tools.items()
            if getattr(tool, "category", None) == category
        }
    
    def unregister_tool(self, name: str) -> bool:
        """Unregister a tool from the registry"""
        if name in self.tools:
            del self.tools[name]
            logger.info(f"Unregistered tool: {name}")
            return True
        return False
    
    def get_tool_description(self, name: str) -> Optional[str]:
        """Get the description of a tool"""
        tool = self.get_tool(name)
        if tool and hasattr(tool, "description"):
            return tool.description
        return None
    
    def get_all_tool_descriptions(self) -> Dict[str, str]:
        """Get descriptions of all registered tools"""
        return {name: self.get_tool_description(name) or "" for name in self.list_tools()}
    
    def is_tool_allowed(self, name: str) -> bool:
        """Check if a tool is allowed according to the configuration"""
        if not self.allowed_tools:
            # If allowed_tools is empty, all registered tools are allowed
            return name in self.tools
        
        return name in self.allowed_tools and name in self.tools
    
    async def execute_tool(self, name: str, tool_input: Any) -> Any:
        """Execute a tool with the provided input"""
        if name not in self.tools:
            error_msg = f"Tool '{name}' not found"
            logger.error(error_msg)
            return {"error": error_msg}
        
        if not self.is_tool_allowed(name):
            error_msg = f"Tool '{name}' is not allowed"
            logger.error(error_msg)
            return {"error": error_msg}
        
        tool = self.get_tool(name)
        
        try:
            # Create a task for the tool execution
            if asyncio.iscoroutinefunction(tool):
                # Handle async functions
                task = asyncio.create_task(tool(tool_input))
            else:
                # Handle sync functions by running them in an executor
                loop = asyncio.get_event_loop()
                task = asyncio.create_task(loop.run_in_executor(None, lambda: tool(tool_input)))
            
            # Wait for the task to complete with a timeout
            result = await asyncio.wait_for(task, timeout=self.timeout_seconds)
            return result
        
        except asyncio.TimeoutError:
            error_msg = f"Tool '{name}' execution timed out after {self.timeout_seconds} seconds"
            logger.error(error_msg)
            return {"error": error_msg}
        
        except Exception as e:
            error_msg = f"Error executing tool '{name}': {str(e)}"
            logger.error(error_msg)
            return {"error": error_msg}