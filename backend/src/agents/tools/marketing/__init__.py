"""Marketing tools for AgentForge OSS
This module provides marketing-specific tools for the AgentForge framework.
"""

from typing import Dict, List, Any, Optional

from ...core.marketing_types import (
    SEOConfig,
    SocialMediaConfig,
    CampaignConfig,
    ContentConfig,
    AnalyticsConfig
)


def get_seo_tools(config: SEOConfig):
    """Initialize and return SEO tools based on configuration"""
    from .seo import SEOToolset
    
    return SEOToolset(config)


def get_social_media_tools(config: SocialMediaConfig):
    """Initialize and return social media tools based on configuration"""
    from .social_media import SocialMediaToolset
    
    return SocialMediaToolset(config)


def get_campaign_tools(config: CampaignConfig):
    """Initialize and return campaign management tools based on configuration"""
    from .campaign import CampaignToolset
    
    return CampaignToolset(config)


def get_content_tools(config: ContentConfig):
    """Initialize and return content marketing tools based on configuration"""
    from .content import ContentToolset
    
    return ContentToolset(config)


def get_analytics_tools(config: AnalyticsConfig):
    """Initialize and return marketing analytics tools based on configuration"""
    from .analytics import AnalyticsToolset
    
    return AnalyticsToolset(config)