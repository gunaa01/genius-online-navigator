"""Advanced Marketing Agent Example for AgentForge OSS
This example demonstrates how to configure and use the marketing-specific agent with
advanced features like multi-channel campaign orchestration, predictive analytics,
competitor analysis, and AI-driven content optimization.
"""

import asyncio
import logging
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

from agents.core import Task
from agents.core.agent_types import (
    AgentType, 
    LLMBackendType, 
    MemoryBackendType,
    WorkflowEngineType,
    ToolType,
    LLMConfig,
    MemoryConfig,
    ToolConfig,
    WorkflowConfig,
    TracerConfig
)
from agents.core.marketing_agent import MarketingAgent
from agents.core.marketing_types import (
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

async def main():
    """Run an advanced marketing agent example"""
    # Configure the SEO component with advanced settings
    seo_config = SEOConfig(
        target_keywords=["digital marketing", "content strategy", "SEO optimization", "marketing automation", "conversion rate optimization"],
        competitor_domains=["competitor1.com", "competitor2.com", "industry-leader.com", "emerging-competitor.com"],
        content_types=["blog", "landing_page", "product_page", "case_study", "whitepaper", "video_transcript"],
        seo_tools=["semrush", "ahrefs", "moz", "screaming_frog", "google_search_console"],
        extra_params={
            "keyword_difficulty_threshold": 60,
            "content_gap_analysis": True,
            "technical_seo_audit": True,
            "backlink_analysis": True,
            "serp_feature_targeting": ["featured_snippet", "people_also_ask", "knowledge_panel"]
        }
    )
    
    # Configure the social media component with advanced settings
    social_media_config = SocialMediaConfig(
        platforms=["instagram", "twitter", "linkedin", "tiktok", "youtube", "pinterest"],
        content_types=["image", "video", "carousel", "story", "reel", "live_stream", "podcast"],
        posting_frequency={
            "instagram": "twice_daily",
            "twitter": "four_times_daily",
            "linkedin": "daily",
            "tiktok": "twice_daily",
            "youtube": "twice_weekly",
            "pinterest": "daily"
        },
        hashtag_strategy="dynamic_trending",
        audience_targeting={
            "demographics": {
                "age_range": [25, 45],
                "locations": ["US", "UK", "Canada", "Australia", "Germany"],
                "interests": ["technology", "business", "marketing", "innovation"]
            },
            "behavioral": {
                "purchase_intent": "high",
                "engagement_level": "active",
                "customer_journey_stage": ["awareness", "consideration", "decision"]
            }
        },
        extra_params={
            "content_pillars": ["educational", "inspirational", "promotional", "user_generated", "behind_the_scenes"],
            "engagement_strategy": "community_building",
            "influencer_collaboration": True,
            "a_b_testing": True,
            "ai_content_optimization": True
        }
    )
    
    # Configure the campaign component with advanced settings
    campaign_config = CampaignConfig(
        campaign_name="Q4 Product Launch & Holiday Campaign",
        campaign_objective="integrated_growth",
        channels=[
            MarketingChannelType.SOCIAL, 
            MarketingChannelType.EMAIL, 
            MarketingChannelType.PAID,
            MarketingChannelType.CONTENT,
            MarketingChannelType.SEARCH,
            MarketingChannelType.INFLUENCER,
            MarketingChannelType.AFFILIATE
        ],
        budget=25000.0,
        start_date=(datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d"),
        end_date=(datetime.now() + timedelta(days=105)).strftime("%Y-%m-%d"),
        target_audience={
            "primary_segments": ["enterprise_decision_makers", "marketing_professionals", "small_business_owners"],
            "secondary_segments": ["tech_enthusiasts", "industry_influencers"],
            "exclusions": ["non_business_users", "competitors"]
        },
        success_metrics=[
            MarketingMetricType.IMPRESSIONS,
            MarketingMetricType.CLICKS,
            MarketingMetricType.CONVERSIONS,
            MarketingMetricType.CTR,
            MarketingMetricType.CPC,
            MarketingMetricType.CPM,
            MarketingMetricType.ROAS,
            MarketingMetricType.ROI,
            MarketingMetricType.ENGAGEMENT,
            MarketingMetricType.REACH
        ],
        extra_params={
            "channel_budget_allocation": {
                "social": 0.25,
                "paid_search": 0.30,
                "email": 0.15,
                "content": 0.15,
                "influencer": 0.10,
                "affiliate": 0.05
            },
            "multi_touch_attribution": "data_driven",
            "predictive_optimization": True,
            "real_time_bidding": True,
            "cross_channel_retargeting": True,
            "sequential_messaging": True
        }
    )
    
    # Configure the content component with advanced settings
    content_config = ContentConfig(
        content_types=["blog_post", "whitepaper", "case_study", "video", "infographic", "podcast", "interactive_tool"],
        topics=["industry_trends", "product_features", "customer_success", "thought_leadership", "how_to_guides", "market_research"],
        tone="authoritative_yet_approachable",
        target_audience={
            "personas": ["marketing_director", "cmo", "digital_specialist", "business_owner"],
            "industry_verticals": ["technology", "finance", "healthcare", "retail", "education"]
        },
        distribution_channels=[
            MarketingChannelType.CONTENT,
            MarketingChannelType.SOCIAL,
            MarketingChannelType.EMAIL,
            MarketingChannelType.SEARCH
        ],
        content_calendar={
            "frequency": {
                "blog_posts": "twice_weekly",
                "videos": "weekly",
                "podcasts": "biweekly",
                "whitepapers": "monthly"
            },
            "themes_by_quarter": {
                "Q1": "industry_predictions",
                "Q2": "best_practices",
                "Q3": "case_studies",
                "Q4": "year_in_review"
            }
        },
        extra_params={
            "content_scoring": True,
            "ai_generated_drafts": True,
            "semantic_seo": True,
            "content_repurposing": True,
            "personalization": "dynamic",
            "localization": ["en-US", "en-UK", "es-ES", "de-DE", "fr-FR"]
        }
    )
    
    # Configure the analytics component with advanced settings
    analytics_config = AnalyticsConfig(
        data_sources=[
            "google_analytics", 
            "google_search_console", 
            "facebook_insights", 
            "linkedin_analytics",
            "twitter_analytics",
            "hubspot",
            "salesforce",
            "shopify",
            "customer_data_platform"
        ],
        metrics=[
            MarketingMetricType.IMPRESSIONS,
            MarketingMetricType.CLICKS,
            MarketingMetricType.CONVERSIONS,
            MarketingMetricType.CTR,
            MarketingMetricType.CPC,
            MarketingMetricType.CPM,
            MarketingMetricType.ROAS,
            MarketingMetricType.ROI,
            MarketingMetricType.ENGAGEMENT,
            MarketingMetricType.REACH
        ],
        reporting_frequency="daily",
        dashboard_config={
            "real_time_metrics": ["website_visitors", "conversion_rate", "campaign_performance"],
            "custom_dashboards": [
                "executive_summary",
                "channel_performance",
                "content_effectiveness",
                "conversion_funnel",
                "customer_journey",
                "competitor_benchmarking"
            ],
            "automated_insights": True,
            "anomaly_detection": True
        },
        alert_thresholds={
            "conversion_rate_drop": 0.15,
            "traffic_spike": 0.30,
            "roi_below_target": 0.20,
            "engagement_drop": 0.25
        },
        extra_params={
            "predictive_analytics": {
                "enabled": True,
                "models": ["churn_prediction", "ltv_prediction", "conversion_prediction", "trend_forecasting"],
                "training_frequency": "weekly"
            },
            "attribution_models": ["first_touch", "last_touch", "linear", "time_decay", "position_based", "data_driven"],
            "cohort_analysis": True,
            "funnel_visualization": True,
            "competitive_intelligence": {
                "enabled": True,
                "competitors": ["competitor1.com", "competitor2.com", "industry-leader.com"],
                "metrics": ["market_share", "share_of_voice", "content_gap", "keyword_overlap"]
            }
        }
    )
    
    # Create the advanced marketing agent configuration
    config = MarketingAgentConfig(
        llm_config=LLMConfig(
            backend=LLMBackendType.VLLM,
            model_path="mistralai/Mixtral-8x7B-Instruct-v0.1",  # Upgraded to more powerful model
            max_tokens=4096,
            temperature=0.7,
            top_p=0.95
        ),
        memory_config=MemoryConfig(
            backend=MemoryBackendType.QDRANT,
            connection_string="./qdrant_data",
            collection_name="marketing_agent_memory",
            embedding_model="sentence-transformers/all-MiniLM-L6-v2"
        ),
        tools_config=ToolConfig(
            allowed_tools=[
                ToolType.SEARCH,
                ToolType.CALCULATOR,
                ToolType.SEO_TOOLS,
                ToolType.GOOGLE_ANALYTICS,
                ToolType.CONTENT_ANALYSIS,
                ToolType.SOCIAL_MEDIA,
                ToolType.GOOGLE_ADS,
                ToolType.FACEBOOK_ADS,
                ToolType.EMAIL_MARKETING,
                ToolType.TWITTER_API,
                ToolType.INSTAGRAM_API,
                ToolType.LINKEDIN_API,
                ToolType.KEYWORD_RESEARCH,
                ToolType.SQL
            ],
            sandbox_mode=False,
            timeout_seconds=60
        ),
        workflow_config=WorkflowConfig(
            backend=WorkflowEngineType.PREFECT,
            connection_string="http://localhost:4200/api",
            workflow_concurrency=5,
            retry_policy={
                "max_retries": 3,
                "retry_delay": 5,
                "exponential_backoff": True
            }
        ),
        tracer_config=TracerConfig(
            enabled=True,
            storage_path="./traces",
            sampling_rate=1.0,
            trace_level="detailed",
            export_format=["json", "dashboard"]
        ),
        name="Enterprise Marketing Strategy Agent",
        description="An advanced agent specialized in multi-channel marketing strategy, predictive analytics, and AI-driven optimization",
        # Add all marketing-specific configurations
        seo_config=seo_config,
        social_media_config=social_media_config,
        campaign_config=campaign_config,
        content_config=content_config,
        analytics_config=analytics_config
    )
    
    # Create the marketing agent
    agent = MarketingAgent(config)
    
    # Example 1: Advanced SEO Task with Competitor Analysis
    seo_task = MarketingTask(
        query="Perform a comprehensive SEO audit including technical issues, content gaps, and competitor analysis. Prioritize recommendations based on potential traffic impact.",
        agent_type=AgentType.SEO,
        target_metrics=[MarketingMetricType.IMPRESSIONS, MarketingMetricType.CLICKS, MarketingMetricType.CTR],
        marketing_parameters={
            "competitor_analysis": True,
            "content_gap_analysis": True,
            "technical_seo_focus": ["core_web_vitals", "mobile_usability", "schema_markup", "site_architecture"],
            "keyword_clusters": ["primary", "secondary", "long_tail"],
            "priority_pages": ["homepage", "product_pages", "category_pages"]
        }
    )
    
    # Example 2: Advanced Social Media Task with AI-Driven Content Strategy
    social_task = MarketingTask(
        query="Develop an AI-optimized content strategy for our social channels that integrates trending topics, competitive analysis, and engagement patterns. Include a content calendar with platform-specific adaptations.",
        agent_type=AgentType.SOCIAL_MEDIA,
        channel=MarketingChannelType.SOCIAL,
        target_metrics=[MarketingMetricType.ENGAGEMENT, MarketingMetricType.REACH, MarketingMetricType.CONVERSIONS],
        marketing_parameters={
            "platforms": ["instagram", "tiktok", "linkedin", "twitter"],
            "content_themes": ["thought_leadership", "product_showcase", "user_generated", "educational", "trending_topics"],
            "content_formats": ["video", "carousel", "story", "live", "interactive"],
            "ai_optimization": True,
            "competitor_benchmarking": ["competitor1", "competitor2", "industry_leader"],
            "audience_segments": ["decision_makers", "industry_professionals", "potential_customers"],
            "posting_schedule": "dynamic_based_on_engagement",
            "hashtag_strategy": "trending_plus_branded"
        }
    )
    
    # Example 3: Advanced Multi-Channel Campaign Task with Predictive Analytics
    campaign_task = MarketingTask(
        query="Design a comprehensive multi-channel campaign strategy for our product launch with predictive budget allocation, cross-channel journey mapping, and real-time optimization triggers. Include performance forecasts and contingency recommendations.",
        agent_type=AgentType.CAMPAIGN,
        campaign_id="q4_product_launch_2023",
        target_metrics=[MarketingMetricType.ROI, MarketingMetricType.CONVERSIONS, MarketingMetricType.ROAS],
        marketing_parameters={
            "campaign_type": "product_launch",
            "channels": ["paid_search", "social_media", "email", "content", "influencer", "affiliate"],
            "budget_allocation": "predictive_optimization",
            "audience_targeting": "dynamic_segmentation",
            "messaging_strategy": "personalized_sequential",
            "testing_framework": "multi_variate",
            "performance_forecasting": True,
            "real_time_optimization": True,
            "cross_channel_attribution": "data_driven",
            "competitive_positioning": "differentiation_focus"
        }
    )
    
    # Example 4: Advanced Content Marketing Task with Semantic SEO
    content_task = MarketingTask(
        query="Create a comprehensive content strategy that leverages semantic SEO, topic clustering, and user intent mapping. Include content briefs for key pieces with AI-assisted optimization recommendations.",
        agent_type=AgentType.CONTENT,
        target_metrics=[MarketingMetricType.ENGAGEMENT, MarketingMetricType.CONVERSIONS],
        marketing_parameters={
            "content_types": ["pillar_pages", "cluster_content", "expert_interviews", "data_studies", "interactive_tools"],
            "semantic_seo": True,
            "user_intent_mapping": ["informational", "navigational", "commercial", "transactional"],
            "content_depth": "comprehensive",
            "content_differentiation": "original_research",
            "content_promotion": "integrated_multi_channel",
            "content_repurposing": True,
            "localization": ["en-US", "en-UK", "es-ES"]
        }
    )
    
    # Example 5: Advanced Analytics Task with Predictive Modeling
    analytics_task = MarketingTask(
        query="Develop a predictive analytics framework that forecasts campaign performance, identifies optimization opportunities, and provides automated insights across channels. Include anomaly detection and competitive benchmarking.",
        agent_type=AgentType.ANALYTICS,
        target_metrics=[MarketingMetricType.ROI, MarketingMetricType.CONVERSIONS, MarketingMetricType.ROAS],
        marketing_parameters={
            "data_sources": ["web_analytics", "crm", "marketing_automation", "social_platforms", "ad_platforms", "search_console"],
            "predictive_models": ["conversion_prediction", "budget_optimization", "content_performance", "audience_segmentation"],
            "visualization_types": ["multi_touch_attribution", "customer_journey", "funnel_analysis", "cohort_analysis"],
            "insight_automation": True,
            "competitive_intelligence": True,
            "anomaly_detection": True,
            "recommendation_engine": True
        }
    )
    
    # Execute the tasks
    print("\n=== Executing Advanced SEO Task ===")
    seo_result = await agent.execute(seo_task)
    print(f"Success: {seo_result.success}")
    print(f"Output: {seo_result.output[:200]}...")
    
    print("\n=== Executing Advanced Social Media Task ===")
    social_result = await agent.execute(social_task)
    print(f"Success: {social_result.success}")
    print(f"Output: {social_result.output[:200]}...")
    
    print("\n=== Executing Advanced Campaign Task ===")
    campaign_result = await agent.execute(campaign_task)
    print(f"Success: {campaign_result.success}")
    print(f"Output: {campaign_result.output[:200]}...")
    
    print("\n=== Executing Advanced Content Task ===")
    content_result = await agent.execute(content_task)
    print(f"Success: {content_result.success}")
    print(f"Output: {content_result.output[:200]}...")
    
    print("\n=== Executing Advanced Analytics Task ===")
    analytics_result = await agent.execute(analytics_task)
    print(f"Success: {analytics_result.success}")
    print(f"Output: {analytics_result.output[:200]}...")

if __name__ == "__main__":
    asyncio.run(main())