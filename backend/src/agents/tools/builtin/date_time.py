"""
Date and time tool for AgentForge OSS.
Provides the ability to get current date and time information.
"""

import logging
import datetime
from typing import Dict, Any, Optional, Union
import pytz

logger = logging.getLogger(__name__)

def get_date_time(params: Optional[Union[str, Dict[str, Any]]] = None) -> Dict[str, Any]:
    """
    Get the current date and time information.
    
    Args:
        params: Optional parameters like timezone or format
        
    Returns:
        A dictionary containing date and time information
    """
    # Extract parameters
    if isinstance(params, dict):
        timezone_str = params.get('timezone', 'UTC')
        format_str = params.get('format', None)
    elif isinstance(params, str) and params:
        # Assume it's a timezone if provided as string
        timezone_str = params
        format_str = None
    else:
        timezone_str = 'UTC'
        format_str = None
    
    logger.info(f"Getting date/time for timezone: {timezone_str}")
    
    try:
        # Get the timezone
        try:
            timezone = pytz.timezone(timezone_str)
        except pytz.exceptions.UnknownTimeZoneError:
            logger.warning(f"Unknown timezone: {timezone_str}, falling back to UTC")
            timezone = pytz.timezone('UTC')
            timezone_str = 'UTC'
        
        # Get current time in the specified timezone
        now = datetime.datetime.now(timezone)
        
        # Format the time if a format string is provided
        if format_str:
            formatted_time = now.strftime(format_str)
        else:
            formatted_time = now.isoformat()
        
        # Create the result
        result = {
            "timestamp": now.timestamp(),
            "iso_format": now.isoformat(),
            "formatted": formatted_time,
            "timezone": timezone_str,
            "year": now.year,
            "month": now.month,
            "day": now.day,
            "hour": now.hour,
            "minute": now.minute,
            "second": now.second,
            "weekday": now.strftime("%A"),
            "success": True
        }
        
        return result
    except Exception as e:
        logger.error(f"Error getting date/time: {e}")
        
        # Return error information
        return {
            "error": str(e),
            "timezone": timezone_str,
            "success": False
        }