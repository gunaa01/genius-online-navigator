"""
Qdrant memory adapter for AgentForge OSS.
Provides vector storage and retrieval capabilities.
"""

import logging
import json
import asyncio
from typing import Dict, List, Any, Optional, Union, Tuple
import uuid

from ...core.agent_types import MemoryConfig

logger = logging.getLogger(__name__)

class QdrantMemoryAdapter:
    """Qdrant memory adapter for vector storage and retrieval"""
    
    def __init__(self, config: MemoryConfig):
        """Initialize the Qdrant memory adapter"""
        self.config = config
        self.client = None
        self.embedding_model = None
        self._initialize_client()
        self._initialize_embedding_model()
    
    def _initialize_client(self):
        """Initialize the Qdrant client"""
        try:
            from qdrant_client import QdrantClient
            from qdrant_client.http import models as rest
            from qdrant_client.http.exceptions import UnexpectedResponse
            
            # Connection parameters
            connection_string = self.config.connection_string
            
            # Determine if using HTTP or gRPC
            if ":" in connection_string and not connection_string.startswith("http"):
                # Assume host:port format
                host, port = connection_string.split(":")
                self.client = QdrantClient(host=host, port=port)
            else:
                # Assume URL or other format
                self.client = QdrantClient(url=connection_string)
            
            # Ensure collection exists
            collection_name = self.config.collection_name
            try:
                self.client.get_collection(collection_name=collection_name)
                logger.info(f"Using existing collection: {collection_name}")
            except UnexpectedResponse:
                # Collection doesn't exist, create it
                self.client.create_collection(
                    collection_name=collection_name,
                    vectors_config=rest.VectorParams(
                        size=384,  # Default size for 'all-MiniLM-L6-v2'
                        distance=rest.Distance.COSINE
                    )
                )
                logger.info(f"Created new collection: {collection_name}")
                
        except ImportError:
            logger.error("Qdrant client not found. Please install with: pip install qdrant-client")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize Qdrant client: {e}")
            raise
    
    def _initialize_embedding_model(self):
        """Initialize the embedding model"""
        try:
            from sentence_transformers import SentenceTransformer
            
            model_name = self.config.embedding_model
            self.embedding_model = SentenceTransformer(model_name)
            logger.info(f"Initialized embedding model: {model_name}")
            
        except ImportError:
            logger.error("Sentence Transformers not found. Please install with: pip install sentence-transformers")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize embedding model: {e}")
            raise
    
    async def store(self, key: str, data: Any) -> None:
        """
        Store data in memory with the given key.
        
        Args:
            key: The key to store the data under
            data: The data to store
        """
        try:
            # Convert data to string if it's not already
            if isinstance(data, (dict, list)):
                data_str = json.dumps(data)
            else:
                data_str = str(data)
            
            # Generate embedding in a thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            embedding = await loop.run_in_executor(None, lambda: self.embedding_model.encode(data_str))
            
            # Create a unique ID for the point
            point_id = str(uuid.uuid4())
            
            # Create metadata
            metadata = {
                "key": key,
                "content": data_str,
                "timestamp": self._get_timestamp(),
                "type": type(data).__name__
            }
            
            # Insert the point
            await loop.run_in_executor(
                None,
                lambda: self.client.upsert(
                    collection_name=self.config.collection_name,
                    points=[
                        {
                            "id": point_id,
                            "vector": embedding.tolist(),
                            "payload": metadata
                        }
                    ]
                )
            )
            
            logger.debug(f"Stored data with key: {key}")
            
        except Exception as e:
            logger.error(f"Error storing data: {e}")
            raise
    
    async def retrieve(self, key: str) -> Any:
        """
        Retrieve data from memory using the given key.
        
        Args:
            key: The key to retrieve
            
        Returns:
            The retrieved data, or None if not found
        """
        try:
            # Create filter for exact key match
            from qdrant_client.http.models import Filter, FieldCondition, MatchValue
            
            filter_condition = Filter(
                must=[
                    FieldCondition(
                        key="key",
                        match=MatchValue(value=key)
                    )
                ]
            )
            
            # Execute search in a thread pool
            loop = asyncio.get_event_loop()
            search_result = await loop.run_in_executor(
                None,
                lambda: self.client.search(
                    collection_name=self.config.collection_name,
                    query_filter=filter_condition,
                    limit=1
                )
            )
            
            if not search_result:
                logger.debug(f"No data found for key: {key}")
                return {}
                
            # Get the payload from the search result
            point = search_result[0]
            payload = point.payload
            
            # Parse the content based on its type
            content = payload.get("content")
            content_type = payload.get("type")
            
            if content_type == "dict" or content_type == "list":
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    logger.warning(f"Failed to parse JSON content for key: {key}")
                    return content
            else:
                return content
                
        except Exception as e:
            logger.error(f"Error retrieving data: {e}")
            return {}
    
    async def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for relevant data in memory.
        
        Args:
            query: The search query
            limit: The maximum number of results
            
        Returns:
            List of relevant data items with scores
        """
        try:
            # Generate embedding for the query
            loop = asyncio.get_event_loop()
            embedding = await loop.run_in_executor(None, lambda: self.embedding_model.encode(query))
            
            # Execute search in a thread pool
            search_result = await loop.run_in_executor(
                None,
                lambda: self.client.search(
                    collection_name=self.config.collection_name,
                    query_vector=embedding.tolist(),
                    limit=limit
                )
            )
            
            # Process search results
            results = []
            for point in search_result:
                payload = point.payload
                content = payload.get("content")
                content_type = payload.get("type")
                
                # Parse the content based on its type
                if content_type == "dict" or content_type == "list":
                    try:
                        parsed_content = json.loads(content)
                    except json.JSONDecodeError:
                        parsed_content = content
                else:
                    parsed_content = content
                
                results.append({
                    "key": payload.get("key"),
                    "content": parsed_content,
                    "score": point.score,
                    "timestamp": payload.get("timestamp")
                })
            
            return results
            
        except Exception as e:
            logger.error(f"Error searching data: {e}")
            return []
    
    async def delete(self, key: str) -> bool:
        """
        Delete data from memory.
        
        Args:
            key: The key to delete
            
        Returns:
            True if deletion was successful, False otherwise
        """
        try:
            # Create filter for exact key match
            from qdrant_client.http.models import Filter, FieldCondition, MatchValue
            
            filter_condition = Filter(
                must=[
                    FieldCondition(
                        key="key",
                        match=MatchValue(value=key)
                    )
                ]
            )
            
            # Execute deletion in a thread pool
            loop = asyncio.get_event_loop()
            delete_result = await loop.run_in_executor(
                None,
                lambda: self.client.delete(
                    collection_name=self.config.collection_name,
                    points_selector=filter_condition
                )
            )
            
            logger.debug(f"Deleted data with key: {key}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting data: {e}")
            return False
    
    async def clear(self) -> bool:
        """
        Clear all data from memory.
        
        Returns:
            True if clearing was successful, False otherwise
        """
        try:
            # Execute clearing in a thread pool
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.client.delete_collection(collection_name=self.config.collection_name)
            )
            
            # Re-create the collection
            from qdrant_client.http import models as rest
            
            await loop.run_in_executor(
                None,
                lambda: self.client.create_collection(
                    collection_name=self.config.collection_name,
                    vectors_config=rest.VectorParams(
                        size=384,  # Default size for 'all-MiniLM-L6-v2'
                        distance=rest.Distance.COSINE
                    )
                )
            )
            
            logger.info(f"Cleared all data from collection: {self.config.collection_name}")
            return True
            
        except Exception as e:
            logger.error(f"Error clearing data: {e}")
            return False
    
    async def get_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the memory store.
        
        Returns:
            Dictionary of statistics
        """
        try:
            # Execute stats retrieval in a thread pool
            loop = asyncio.get_event_loop()
            collection_info = await loop.run_in_executor(
                None,
                lambda: self.client.get_collection(collection_name=self.config.collection_name)
            )
            
            # Extract relevant statistics
            stats = {
                "collection_name": self.config.collection_name,
                "vector_count": collection_info.vectors_count,
                "vector_size": collection_info.config.params.vectors.size,
                "distance_metric": str(collection_info.config.params.vectors.distance),
                "embedding_model": self.config.embedding_model
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return {
                "collection_name": self.config.collection_name,
                "error": str(e)
            }
    
    def _get_timestamp(self) -> int:
        """Get current timestamp in seconds"""
        import time
        return int(time.time()) 