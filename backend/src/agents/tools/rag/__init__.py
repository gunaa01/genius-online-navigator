"""RAG (Retrieval Augmented Generation) tools for AgentForge OSS
This module provides RAG capabilities for knowledge retrieval and augmentation.
"""

from typing import Dict, Any

from ...core.marketing_types import RAGConfig


def get_weaviate_tools(config: RAGConfig):
    """Initialize and return Weaviate RAG tools"""
    from .weaviate import WeaviateRAGToolset
    
    return WeaviateRAGToolset(config)