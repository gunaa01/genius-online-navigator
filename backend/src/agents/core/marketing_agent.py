\"""
Marketing Agent implementation for AgentForge OSS
This module extends the core agent implementation with marketing-specific capabilities.
"""

from typing import Dict, List, Optional, Any, Union
import logging
import asyncio

from .base_agent import AgentCore
from .agent_types import AgentResult, Task, AgentType, ToolType
from .marketing_types import (
    MarketingAgentConfig, 
    MarketingTask,
    MarketingChannelType,
    MarketingMetricType,
    SEOConfig,
    SocialMediaConfig,
    CampaignConfig,
    ContentConfig,
    AnalyticsConfig
)

logger = logging.getLogger(__name__)

class MarketingAgent(AgentCore):
    """Marketing-specific agent implementation for AgentForge OSS"""
    
    def __init__(self, config: MarketingAgentConfig):
        """Initialize the marketing agent with extended configuration"""
        super().__init__(config)
        self.marketing_config = config
        
        # Initialize marketing-specific components based on configuration
        self.seo_tools = self._init_seo_tools() if config.seo_config else None
        self.social_media_tools = self._init_social_media_tools() if config.social_media_config else None
        self.campaign_tools = self._init_campaign_tools() if config.campaign_config else None
        self.content_tools = self._init_content_tools() if config.content_config else None
        self.analytics_tools = self._init_analytics_tools() if config.analytics_config else None
        
        logger.info(f"Marketing agent initialized with specializations: {self._get_specializations()}")
    
    def _init_seo_tools(self):
        """Initialize SEO-specific tools"""
        from ..tools.marketing import get_seo_tools
        
        return get_seo_tools(self.marketing_config.seo_config)
    
    def _init_social_media_tools(self):
        """Initialize social media tools"""
        from ..tools.marketing import get_social_media_tools
        
        return get_social_media_tools(self.marketing_config.social_media_config)
    
    def _init_campaign_tools(self):
        """Initialize campaign management tools"""
        from ..tools.marketing import get_campaign_tools
        
        return get_campaign_tools(self.marketing_config.campaign_config)
    
    def _init_content_tools(self):
        """Initialize content marketing tools"""
        from ..tools.marketing import get_content_tools
        
        return get_content_tools(self.marketing_config.content_config)
    
    def _init_analytics_tools(self):
        """Initialize marketing analytics tools"""
        from ..tools.marketing import get_analytics_tools
        
        return get_analytics_tools(self.marketing_config.analytics_config)
    
    def _get_specializations(self) -> List[str]:
        """Get list of active marketing specializations"""
        specializations = []
        if self.marketing_config.seo_config:
            specializations.append("SEO")
        if self.marketing_config.social_media_config:
            specializations.append("Social Media")
        if self.marketing_config.campaign_config:
            specializations.append("Campaign Management")
        if self.marketing_config.content_config:
            specializations.append("Content Marketing")
        if self.marketing_config.analytics_config:
            specializations.append("Marketing Analytics")
        return specializations
    
    async def execute(self, task: Union[Task, MarketingTask]) -> AgentResult:
        """Execute a marketing task using specialized components"""
        # Convert standard Task to MarketingTask if needed
        if not isinstance(task, MarketingTask):
            logger.info("Converting standard Task to MarketingTask")
            marketing_task = MarketingTask(
                id=task.id,
                query=task.query,
                agent_type=task.agent_type,
                context_key=task.context_key,
                result_key=task.result_key,
                max_steps=task.max_steps,
                tools_allowed=task.tools_allowed,
                parameters=task.parameters
            )
        else:
            marketing_task = task
        
        # Route to specialized execution method based on agent type
        if marketing_task.agent_type == AgentType.SEO:
            return await self._execute_seo_task(marketing_task)
        elif marketing_task.agent_type == AgentType.SOCIAL_MEDIA:
            return await self._execute_social_media_task(marketing_task)
        elif marketing_task.agent_type == AgentType.CAMPAIGN:
            return await self._execute_campaign_task(marketing_task)
        elif marketing_task.agent_type == AgentType.CONTENT:
            return await self._execute_content_task(marketing_task)
        elif marketing_task.agent_type == AgentType.ANALYTICS:
            return await self._execute_analytics_task(marketing_task)
        else:
            # Fall back to standard execution for non-marketing agent types
            return await super().execute(marketing_task)
    
    async def _execute_seo_task(self, task: MarketingTask) -> AgentResult:
        """Execute an SEO-specific task"""
        logger.info(f"Executing SEO task: {task.query}")
        
        # Ensure SEO tools are initialized
        if not self.seo_tools:
            raise ValueError("SEO tools not initialized. Please provide SEO configuration.")
        
        # Add SEO-specific tools to allowed tools
        if not task.tools_allowed:
            task.tools_allowed = []
        task.tools_allowed.extend([ToolType.SEO_TOOLS, ToolType.SEARCH, ToolType.CONTENT_ANALYSIS])
        
        # Execute using standard flow but with SEO specialization
        return await super().execute(task)
    
    async def _execute_social_media_task(self, task: MarketingTask) -> AgentResult:
        """Execute a social media task"""
        logger.info(f"Executing social media task: {task.query}")
        
        # Ensure social media tools are initialized
        if not self.social_media_tools:
            raise ValueError("Social media tools not initialized. Please provide social media configuration.")
        
        # Add social media API tools to allowed tools
        if not task.tools_allowed:
            task.tools_allowed = []
        task.tools_allowed.extend([
            ToolType.TWITTER_API, 
            ToolType.INSTAGRAM_API, 
            ToolType.LINKEDIN_API, 
            ToolType.CONTENT_ANALYSIS
        ])
        
        # Execute using standard flow but with social media specialization
        return await super().execute(task)
    
    async def _execute_campaign_task(self, task: MarketingTask) -> AgentResult:
        """Execute a marketing campaign task"""
        logger.info(f"Executing campaign task: {task.query}")
        
        # Ensure campaign tools are initialized
        if not self.campaign_tools:
            raise ValueError("Campaign tools not initialized. Please provide campaign configuration.")
        
        # Add campaign-related tools to allowed tools
        if not task.tools_allowed:
            task.tools_allowed = []
        task.tools_allowed.extend([
            ToolType.GOOGLE_ADS, 
            ToolType.FACEBOOK_ADS, 
            ToolType.EMAIL_MARKETING
        ])
        
        # Execute using standard flow but with campaign specialization
        return await super().execute(task)
    
    async def _execute_content_task(self, task: MarketingTask) -> AgentResult:
        """Execute a content marketing task"""
        logger.info(f"Executing content task: {task.query}")
        
        # Ensure content tools are initialized
        if not self.content_tools:
            raise ValueError("Content tools not initialized. Please provide content configuration.")
        
        # Add content-related tools to allowed tools
        if not task.tools_allowed:
            task.tools_allowed = []
        task.tools_allowed.extend([
            ToolType.CONTENT_ANALYSIS, 
            ToolType.KEYWORD_RESEARCH, 
            ToolType.SEO_TOOLS
        ])
        
        # Execute using standard flow but with content specialization
        return await super().execute(task)
    
    async def _execute_analytics_task(self, task: MarketingTask) -> AgentResult:
        """Execute a marketing analytics task"""
        logger.info(f"Executing analytics task: {task.query}")
        
        # Ensure analytics tools are initialized
        if not self.analytics_tools:
            raise ValueError("Analytics tools not initialized. Please provide analytics configuration.")
        
        # Add analytics-related tools to allowed tools
        if not task.tools_allowed:
            task.tools_allowed = []
        task.tools_allowed.extend([
            ToolType.GOOGLE_ANALYTICS, 
            ToolType.SQL, 
            ToolType.CALCULATOR
        ])
        
        # Execute using standard flow but with analytics specialization
        return await super().execute(task)