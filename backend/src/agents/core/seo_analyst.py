"""SEO Analyst Agent implementation for AgentForge OSS
This module provides a specialized SEO analysis agent that leverages
Weaviate RAG, n8n workflows, and SEO toolsets.
"""

from typing import Dict, List, Optional, Any, Union
import logging
import asyncio
from datetime import datetime

from .base_agent import AgentCore
from .marketing_agent import MarketingAgent
from .agent_types import AgentResult, Task, AgentType, ToolType
from .marketing_types import (
    MarketingAgentConfig,
    MarketingTask,
    MarketingChannelType,
    MarketingMetricType,
    SEOConfig,
    N8nWorkflowConfig,
    RAGConfig
)

logger = logging.getLogger(__name__)

class SEOAnalystAgent(MarketingAgent):
    """SEO Analyst agent implementation for AgentForge OSS
    
    This specialized agent focuses on SEO analysis, keyword research,
    content optimization, and competitive analysis using RAG and workflow automation.
    """
    
    def __init__(self, config: MarketingAgentConfig):
        """Initialize the SEO Analyst agent with extended configuration"""
        super().__init__(config)
        
        # Validate required configurations
        if not config.seo_config:
            raise ValueError("SEO configuration is required for SEOAnalystAgent")
        
        # Initialize required components
        self.seo_config = config.seo_config
        
        # Initialize optional advanced components
        self.n8n_config = config.n8n_workflow_config
        self.rag_config = config.rag_config
        
        # Initialize toolsets
        self.seo_tools = self._init_seo_tools()
        self.n8n_tools = self._init_n8n_tools() if self.n8n_config else None
        self.rag_tools = self._init_rag_tools() if self.rag_config else None
        
        logger.info(f"SEO Analyst agent initialized with capabilities: {self._get_capabilities()}")
    
    def _init_seo_tools(self):
        """Initialize SEO tools"""
        from ..tools.marketing import get_seo_tools
        
        return get_seo_tools(self.seo_config)
    
    def _init_n8n_tools(self):
        """Initialize n8n workflow integration tools"""
        from ..tools.integrations.n8n import N8nWorkflowToolset
        
        return N8nWorkflowToolset(self.n8n_config)
    
    def _init_rag_tools(self):
        """Initialize RAG with Weaviate tools"""
        from ..tools.rag.weaviate import WeaviateRAGToolset
        
        return WeaviateRAGToolset(self.rag_config)
    
    def _get_capabilities(self) -> List[str]:
        """Get list of active capabilities"""
        capabilities = ["SEO Analysis", "Keyword Research", "Content Optimization"]
        if self.n8n_tools:
            capabilities.append("Workflow Automation")
        if self.rag_tools:
            capabilities.append("Knowledge Retrieval")
        return capabilities
    
    async def execute(self, task: Union[Task, MarketingTask]) -> AgentResult:
        """Execute an SEO analysis task using specialized components"""
        # Convert standard Task to MarketingTask if needed
        if not isinstance(task, MarketingTask):
            logger.info("Converting standard Task to MarketingTask for SEO analysis")
            marketing_task = MarketingTask(
                id=task.id,
                query=task.query,
                agent_type=AgentType.MARKETING,
                context_key=task.context_key,
                result_key=task.result_key,
                max_steps=task.max_steps,
                tools_allowed=task.tools_allowed,
                channel_type=MarketingChannelType.SEO,
                metrics=[MarketingMetricType.ORGANIC_TRAFFIC, MarketingMetricType.KEYWORD_RANKINGS]
            )
            task = marketing_task
        
        # Start tracing for this task
        self.tracer.start_trace(task)
        
        try:
            # Retrieve relevant SEO knowledge from RAG if available
            seo_context = {}
            if self.rag_tools:
                logger.info("Retrieving relevant SEO knowledge from RAG")
                knowledge_results = await self.rag_tools.retrieve_relevant_knowledge(
                    query=task.query,
                    limit=5
                )
                seo_context["knowledge"] = knowledge_results
            
            # Generate SEO analysis plan
            plan = await self.llm_backend.generate_plan(task, seo_context)
            self.tracer.log_plan(plan)
            
            # Execute SEO analysis steps
            result = await self._execute_seo_analysis(task, plan, seo_context)
            
            # Store results in memory
            await self.memory.store(task.result_key, result)
            
            # Create or update n8n workflow if configured
            if self.n8n_tools and "create_workflow" in task.query.lower():
                await self._create_seo_workflow(task, result)
            
            return result
        
        except Exception as e:
            logger.error(f"Error executing SEO analysis task: {str(e)}")
            return AgentResult(
                task_id=task.id,
                status="error",
                result={"error": str(e)},
                steps=[],
                metrics={"success": False}
            )
    
    async def _execute_seo_analysis(self, task: MarketingTask, plan: Dict[str, Any], 
                                  context: Dict[str, Any]) -> AgentResult:
        """Execute SEO analysis steps based on the plan"""
        steps = []
        metrics = {}
        
        # Extract keywords from task query
        keywords = self._extract_keywords(task.query)
        
        # Perform keyword research
        keyword_results = await self.seo_tools.keyword_research(query=keywords[0] if keywords else task.query)
        steps.append({
            "name": "keyword_research",
            "result": keyword_results
        })
        
        # Analyze competitors if mentioned in query
        if "competitor" in task.query.lower() or "competition" in task.query.lower():
            # Extract competitor domains or use default ones
            domains = self._extract_domains(task.query) or ["competitor1.com", "competitor2.com"]
            competitor_results = await self.seo_tools.competitor_analysis(domains=domains)
            steps.append({
                "name": "competitor_analysis",
                "result": competitor_results
            })
            metrics["competitors_analyzed"] = len(domains)
        
        # Optimize content if mentioned in query
        if "content" in task.query.lower() or "optimize" in task.query.lower():
            # Extract content from context or use placeholder
            content = context.get("content", "Sample content for optimization")
            optimization_results = await self.seo_tools.content_optimization(
                content=content,
                target_keywords=keywords or [keyword_results["results"][0]["keyword"]]
            )
            steps.append({
                "name": "content_optimization",
                "result": optimization_results
            })
            metrics["content_score"] = 75  # Mock score
        
        # Track rankings if mentioned in query
        if "rank" in task.query.lower() or "tracking" in task.query.lower():
            ranking_results = await self.seo_tools.rank_tracking(
                keywords=keywords or [k["keyword"] for k in keyword_results["results"][:3]]
            )
            steps.append({
                "name": "rank_tracking",
                "result": ranking_results
            })
            metrics["average_ranking"] = 15.3  # Mock average ranking
        
        # Generate final analysis using LLM
        analysis_prompt = f"Generate an SEO analysis based on the following data: {steps}"
        analysis = await self.llm_backend.generate_text(analysis_prompt)
        
        return AgentResult(
            task_id=task.id,
            status="success",
            result={
                "analysis": analysis,
                "keyword_data": keyword_results,
                "steps": steps
            },
            steps=steps,
            metrics=metrics
        )
    
    async def _create_seo_workflow(self, task: MarketingTask, result: AgentResult):
        """Create or update an n8n workflow for SEO monitoring"""
        if not self.n8n_tools:
            return
        
        try:
            # Extract keywords from results
            keywords = [k["keyword"] for k in result.result.get("keyword_data", {}).get("results", [])]
            
            # Create a scheduled workflow for rank tracking
            workflow_result = await self.n8n_tools.create_or_update_workflow(
                name=f"SEO Rank Tracking - {task.id[:8]}",
                trigger_type="scheduled",
                schedule="0 9 * * 1",  # Every Monday at 9 AM
                actions=[
                    {
                        "name": "Track Keyword Rankings",
                        "type": "httpRequest",
                        "parameters": {
                            "url": "https://api.seotracking.example/v1/rankings",
                            "method": "POST",
                            "authentication": "genericCredentialType",
                            "genericAuthType": "httpHeaderAuth",
                            "bodyParameters": {
                                "keywords": keywords,
                                "domain": self.seo_config.domain
                            }
                        }
                    },
                    {
                        "name": "Send Report Email",
                        "type": "emailSend",
                        "parameters": {
                            "to": self.seo_config.notification_email,
                            "subject": "Weekly SEO Ranking Report",
                            "text": "Your weekly SEO ranking report is attached."
                        }
                    }
                ]
            )
            
            logger.info(f"Created SEO workflow: {workflow_result}")
            
            # Activate the workflow
            if "id" in workflow_result:
                await self.n8n_tools.activate_workflow(workflow_result["id"])
        
        except Exception as e:
            logger.error(f"Error creating SEO workflow: {str(e)}")
    
    def _extract_keywords(self, query: str) -> List[str]:
        """Extract potential keywords from the query"""
        # In a real implementation, this would use NLP to extract keywords
        # For demonstration, use simple splitting and filtering
        words = query.lower().split()
        stopwords = ["the", "and", "or", "for", "in", "on", "at", "to", "a", "an"]
        keywords = [w for w in words if w not in stopwords and len(w) > 3]
        return keywords[:5]  # Return top 5 potential keywords
    
    def _extract_domains(self, query: str) -> List[str]:
        """Extract potential domain names from the query"""
        # In a real implementation, this would use NLP to extract domains
        # For demonstration, return None to use defaults
        return None