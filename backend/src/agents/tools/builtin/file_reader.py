"""
File reader tool for AgentForge OSS.
Provides the ability to read file contents.
"""

import os
import logging
from typing import Dict, Any, Union, Optional
import pathlib

logger = logging.getLogger(__name__)

def read_file(file_path: Union[str, Dict[str, Any]]) -> Dict[str, Any]:
    """
    Read the contents of a file.
    
    Args:
        file_path: The path to the file to read, or a dict with 'path' key
        
    Returns:
        A dictionary containing the file contents
    """
    # Extract file path from input
    if isinstance(file_path, dict):
        path = file_path.get('path', '')
    else:
        path = file_path
    
    logger.info(f"Reading file: {path}")
    
    try:
        # Validate and sanitize the file path
        path = str(path).strip()
        
        # Check if the path is absolute or relative
        file_path_obj = pathlib.Path(path)
        
        # For security, resolve the path to catch directory traversal attempts
        resolved_path = file_path_obj.resolve()
        
        # Read the file content
        with open(resolved_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Get file metadata
        stats = resolved_path.stat()
        
        return {
            "path": str(resolved_path),
            "content": content,
            "size": stats.st_size,
            "last_modified": stats.st_mtime,
            "success": True
        }
    except FileNotFoundError:
        logger.error(f"File not found: {path}")
        return {
            "path": path,
            "error": f"File not found: {path}",
            "success": False
        }
    except PermissionError:
        logger.error(f"Permission denied: {path}")
        return {
            "path": path,
            "error": f"Permission denied: {path}",
            "success": False
        }
    except Exception as e:
        logger.error(f"Error reading file: {e}")
        return {
            "path": path,
            "error": str(e),
            "success": False
        }