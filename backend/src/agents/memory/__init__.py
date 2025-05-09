"""
Memory module for the AgentForge OSS framework.
This module provides unified interfaces for different memory backends.
"""

from typing import Dict, List, Any, Optional
import logging

from ..core.agent_types import MemoryBackendType, MemoryConfig

logger = logging.getLogger(__name__)

def get_memory_adapter(config: MemoryConfig) -> 'BaseMemory':
    """Factory function to get the appropriate memory backend"""
    if config.backend == MemoryBackendType.QDRANT:
        from .qdrant import QdrantMemoryAdapter
        return QdrantMemoryAdapter(config)
    elif config.backend == MemoryBackendType.CHROMA:
        from .chroma import ChromaMemoryAdapter
        return ChromaMemoryAdapter(config)
    else:
        raise ValueError(f"Unsupported memory backend: {config.backend}")

class BaseMemory:
    """Base class for memory backends"""
    
    def __init__(self, config: MemoryConfig):
        """Initialize the memory backend with a configuration"""
        self.config = config
        
    async def store(self, key: str, data: Any) -> None:
        """Store data in memory"""
        raise NotImplementedError("Subclasses must implement this method")
        
    async def retrieve(self, key: str) -> Any:
        """Retrieve data from memory"""
        raise NotImplementedError("Subclasses must implement this method")
        
    async def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant data in memory"""
        raise NotImplementedError("Subclasses must implement this method")
        
    async def delete(self, key: str) -> None:
        """Delete data from memory"""
        raise NotImplementedError("Subclasses must implement this method")
        
    async def clear(self) -> None:
        """Clear all data from memory"""
        raise NotImplementedError("Subclasses must implement this method")
        
    async def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the memory store"""
        raise NotImplementedError("Subclasses must implement this method") 