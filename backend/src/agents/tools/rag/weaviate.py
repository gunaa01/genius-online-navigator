"""Weaviate RAG tools for AgentForge OSS
This module provides Retrieval Augmented Generation capabilities using Weaviate vector database.
"""

from typing import Dict, List, Any, Optional
import logging
import json
import asyncio
from datetime import datetime

try:
    import weaviate
    from weaviate.util import generate_uuid5
    from sentence_transformers import SentenceTransformer
except ImportError:
    logging.warning("Weaviate or sentence-transformers not installed. Install with: pip install weaviate-client sentence-transformers")

from ...core.marketing_types import RAGConfig

logger = logging.getLogger(__name__)

class WeaviateRAGToolset:
    """Weaviate RAG toolset for knowledge retrieval and augmentation"""
    
    def __init__(self, config: RAGConfig):
        """Initialize the Weaviate RAG toolset with configuration"""
        self.config = config
        self.tools = self._register_tools()
        self.client = None
        self.embedding_model = None
        logger.info(f"Weaviate RAG toolset initialized with {len(self.tools)} tools")
    
    def _register_tools(self) -> Dict[str, Any]:
        """Register all Weaviate RAG tools"""
        return {
            "retrieve_relevant_knowledge": self.retrieve_relevant_knowledge,
            "add_knowledge": self.add_knowledge,
            "update_knowledge": self.update_knowledge,
            "delete_knowledge": self.delete_knowledge,
            "search_knowledge": self.search_knowledge,
        }
    
    async def _get_client(self):
        """Get or create a Weaviate client"""
        if self.client is None:
            try:
                auth_config = weaviate.auth.AuthApiKey(api_key=self.config.extra_params.get("api_key", ""))
                self.client = weaviate.Client(
                    url=self.config.connection_string,
                    auth_client_secret=auth_config if self.config.extra_params.get("api_key") else None,
                    additional_headers=self.config.extra_params.get("headers", {})
                )
                
                # Check if collection exists, create if not
                if not self.client.collections.exists(self.config.collection_name):
                    await self._create_collection()
            except Exception as e:
                logger.error(f"Failed to initialize Weaviate client: {str(e)}")
                raise
        
        return self.client
    
    async def _get_embedding_model(self):
        """Get or create a sentence transformer embedding model"""
        if self.embedding_model is None:
            try:
                self.embedding_model = SentenceTransformer(self.config.embedding_model)
            except Exception as e:
                logger.error(f"Failed to initialize embedding model: {str(e)}")
                raise
        
        return self.embedding_model
    
    async def _create_collection(self):
        """Create the Weaviate collection for marketing knowledge"""
        client = await self._get_client()
        
        # Define collection schema
        collection = client.collections.create(
            name=self.config.collection_name,
            properties=[
                {
                    "name": "title",
                    "dataType": ["text"],
                    "description": "The title of the knowledge item",
                    "indexFilterable": True,
                    "indexSearchable": True,
                },
                {
                    "name": "content",
                    "dataType": ["text"],
                    "description": "The content of the knowledge item",
                    "indexFilterable": True,
                    "indexSearchable": True,
                },
                {
                    "name": "source",
                    "dataType": ["text"],
                    "description": "The source of the knowledge item",
                    "indexFilterable": True,
                    "indexSearchable": True,
                },
                {
                    "name": "category",
                    "dataType": ["text"],
                    "description": "The category of the knowledge item",
                    "indexFilterable": True,
                    "indexSearchable": True,
                },
                {
                    "name": "tags",
                    "dataType": ["text[]"],
                    "description": "Tags associated with the knowledge item",
                    "indexFilterable": True,
                    "indexSearchable": True,
                },
                {
                    "name": "created_at",
                    "dataType": ["date"],
                    "description": "When the knowledge item was created",
                    "indexFilterable": True,
                    "indexSearchable": False,
                },
                {
                    "name": "updated_at",
                    "dataType": ["date"],
                    "description": "When the knowledge item was last updated",
                    "indexFilterable": True,
                    "indexSearchable": False,
                },
            ],
            vectorizer_config={
                "model": self.config.embedding_model,
                "type": "text2vec-transformers"
            }
        )
        
        logger.info(f"Created Weaviate collection: {self.config.collection_name}")
        return collection
    
    async def retrieve_relevant_knowledge(self, query: str, limit: int = 5, 
                                        categories: List[str] = None) -> List[Dict[str, Any]]:
        """Retrieve relevant knowledge based on a query"""
        logger.info(f"Retrieving knowledge for query: {query}")
        
        try:
            client = await self._get_client()
            collection = client.collections.get(self.config.collection_name)
            
            # Prepare filters if categories are specified
            where_filter = None
            if categories and len(categories) > 0:
                where_filter = {
                    "path": ["category"],
                    "operator": "ContainsAny",
                    "valueText": categories
                }
            
            # Perform vector search
            results = collection.query.near_text(
                query=query,
                limit=limit,
                filters=where_filter,
                return_metadata={
                    "distance": True
                }
            )
            
            # Process and return results
            knowledge_items = []
            for item in results.objects:
                # Skip if similarity is below threshold
                if hasattr(item, "metadata") and item.metadata.distance > 1 - self.config.query_similarity_threshold:
                    continue
                    
                knowledge_items.append({
                    "id": item.uuid,
                    "title": item.properties.get("title", ""),
                    "content": item.properties.get("content", ""),
                    "source": item.properties.get("source", ""),
                    "category": item.properties.get("category", ""),
                    "tags": item.properties.get("tags", []),
                    "relevance": 1 - (item.metadata.distance if hasattr(item, "metadata") else 0)
                })
            
            return knowledge_items
        except Exception as e:
            logger.error(f"Error retrieving knowledge: {str(e)}")
            return []
    
    async def add_knowledge(self, title: str, content: str, source: str, 
                          category: str, tags: List[str] = None) -> Dict[str, Any]:
        """Add new knowledge to the Weaviate collection"""
        logger.info(f"Adding knowledge: {title}")
        
        try:
            client = await self._get_client()
            collection = client.collections.get(self.config.collection_name)
            
            # Generate a deterministic UUID based on title and source
            uuid = generate_uuid5(f"{title}_{source}")
            
            # Prepare knowledge item
            knowledge_item = {
                "title": title,
                "content": content,
                "source": source,
                "category": category,
                "tags": tags or [],
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            # Add to collection
            result = collection.data.insert(knowledge_item, uuid)
            
            return {
                "id": uuid,
                "title": title,
                "status": "added"
            }
        except Exception as e:
            logger.error(f"Error adding knowledge: {str(e)}")
            return {"error": str(e)}
    
    async def update_knowledge(self, id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update existing knowledge in the Weaviate collection"""
        logger.info(f"Updating knowledge: {id}")
        
        try:
            client = await self._get_client()
            collection = client.collections.get(self.config.collection_name)
            
            # Update the updated_at timestamp
            data["updated_at"] = datetime.now().isoformat()
            
            # Update in collection
            result = collection.data.update(data, id)
            
            return {
                "id": id,
                "status": "updated"
            }
        except Exception as e:
            logger.error(f"Error updating knowledge: {str(e)}")
            return {"error": str(e)}
    
    async def delete_knowledge(self, id: str) -> Dict[str, Any]:
        """Delete knowledge from the Weaviate collection"""
        logger.info(f"Deleting knowledge: {id}")
        
        try:
            client = await self._get_client()
            collection = client.collections.get(self.config.collection_name)
            
            # Delete from collection
            result = collection.data.delete(id)
            
            return {
                "id": id,
                "status": "deleted"
            }
        except Exception as e:
            logger.error(f"Error deleting knowledge: {str(e)}")
            return {"error": str(e)}
    
    async def search_knowledge(self, query: str, filter_by: Dict[str, Any] = None, 
                            limit: int = 10) -> List[Dict[str, Any]]:
        """Search knowledge using keyword search and filters"""
        logger.info(f"Searching knowledge with query: {query}")
        
        try:
            client = await self._get_client()
            collection = client.collections.get(self.config.collection_name)
            
            # Prepare filters
            where_filter = None
            if filter_by:
                where_clauses = []
                for field, value in filter_by.items():
                    if isinstance(value, list):
                        where_clauses.append({
                            "path": [field],
                            "operator": "ContainsAny",
                            "valueText": value
                        })
                    else:
                        where_clauses.append({
                            "path": [field],
                            "operator": "Equal",
                            "valueText": value
                        })
                
                if len(where_clauses) > 1:
                    where_filter = {
                        "operator": "And",
                        "operands": where_clauses
                    }
                elif len(where_clauses) == 1:
                    where_filter = where_clauses[0]
            
            # Perform BM25 search
            results = collection.query.bm25(
                query=query,
                limit=limit,
                filters=where_filter
            )
            
            # Process and return results
            knowledge_items = []
            for item in results.objects:
                knowledge_items.append({
                    "id": item.uuid,
                    "title": item.properties.get("title", ""),
                    "content": item.properties.get("content", ""),
                    "source": item.properties.get("source", ""),
                    "category": item.properties.get("category", ""),
                    "tags": item.properties.get("tags", []),
                })
            
            return knowledge_items
        except Exception as e:
            logger.error(f"Error searching knowledge: {str(e)}")
            return []