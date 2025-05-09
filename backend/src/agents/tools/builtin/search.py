"""
Web search tool for AgentForge OSS.
Provides the ability to search the web for information.
"""

import logging
import json
import httpx
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

async def search_web(query: str, max_results: int = 5) -> Dict[str, Any]:
    """
    Search the web for information using DuckDuckGo.
    
    Args:
        query: The search query
        max_results: Maximum number of results to return
        
    Returns:
        A dictionary containing search results
    """
    logger.info(f"Searching the web for: {query}")
    
    try:
        # Use DuckDuckGo API
        url = "https://api.duckduckgo.com/"
        params = {
            "q": query,
            "format": "json",
            "no_html": "1",
            "skip_disambig": "1"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # Format results
            results = []
            
            # Abstract
            if data.get("AbstractText"):
                results.append({
                    "title": data.get("Heading", "Abstract"),
                    "content": data.get("AbstractText"),
                    "source": data.get("AbstractURL", "")
                })
            
            # Related topics
            for topic in data.get("RelatedTopics", [])[:max_results]:
                if "Text" in topic and "FirstURL" in topic:
                    results.append({
                        "title": topic.get("Text", "").split(" - ")[0] if " - " in topic.get("Text", "") else "Related",
                        "content": topic.get("Text", ""),
                        "source": topic.get("FirstURL", "")
                    })
            
            return {
                "query": query,
                "results": results[:max_results],
                "success": True
            }
    
    except Exception as e:
        logger.error(f"Error searching the web: {e}")
        
        # Fallback to simulated response if in development
        return {
            "query": query,
            "results": [{
                "title": "Search Error",
                "content": f"Failed to search: {str(e)}. This is a simulated response.",
                "source": ""
            }],
            "success": False,
            "error": str(e)
        } 