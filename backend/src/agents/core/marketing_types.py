"""Marketing-specific type definitions for the AgentForge OSS framework.
This module extends the core data structures with marketing-specific configurations.
Includes support for multi-channel campaigns, predictive analytics, A/B testing,
n8n workflow integration, Apache Superset dashboards, and RAG with Weaviate.
"""

from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from enum import Enum
from uuid import UUID, uuid4

from .agent_types import AgentConfig, AgentType, ToolType, Task, MemoryBackendType

class MarketingChannelType(str, Enum):
    """Supported marketing channels"""
    SEARCH = "search"
    SOCIAL = "social"
    EMAIL = "email"
    CONTENT = "content"
    PAID = "paid"
    AFFILIATE = "affiliate"
    INFLUENCER = "influencer"
    DISPLAY = "display"
    VIDEO = "video"
    AUDIO = "audio"
    SMS = "sms"
    PUSH = "push"
    CHATBOT = "chatbot"
    PROGRAMMATIC = "programmatic"
    NATIVE = "native"

class MarketingMetricType(str, Enum):
    """Supported marketing metrics"""
    IMPRESSIONS = "impressions"
    CLICKS = "clicks"
    CONVERSIONS = "conversions"
    CTR = "ctr"
    CPC = "cpc"
    CPM = "cpm"
    ROAS = "roas"
    ROI = "roi"
    ENGAGEMENT = "engagement"
    REACH = "reach"
    BOUNCE_RATE = "bounce_rate"
    TIME_ON_SITE = "time_on_site"
    PAGES_PER_SESSION = "pages_per_session"
    CUSTOMER_LIFETIME_VALUE = "customer_lifetime_value"
    CUSTOMER_ACQUISITION_COST = "customer_acquisition_cost"
    RETENTION_RATE = "retention_rate"
    CHURN_RATE = "churn_rate"
    AVERAGE_ORDER_VALUE = "average_order_value"
    REVENUE = "revenue"
    SHARE_OF_VOICE = "share_of_voice"
    BRAND_SENTIMENT = "brand_sentiment"
    CUSTOMER_SATISFACTION = "customer_satisfaction"
    NET_PROMOTER_SCORE = "net_promoter_score"

@dataclass
class SEOConfig:
    """Configuration for SEO agent"""
    target_keywords: List[str]
    competitor_domains: List[str] = field(default_factory=list)
    content_types: List[str] = field(default_factory=lambda: ["blog", "landing_page"])
    seo_tools: List[str] = field(default_factory=lambda: ["semrush", "ahrefs", "moz"])
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class SocialMediaConfig:
    """Configuration for social media agent"""
    platforms: List[str]
    content_types: List[str] = field(default_factory=lambda: ["image", "video", "text"])
    posting_frequency: Dict[str, str] = field(default_factory=dict)  # e.g., {"instagram": "daily"}
    hashtag_strategy: Optional[str] = None
    audience_targeting: Dict[str, Any] = field(default_factory=dict)
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class CampaignConfig:
    """Configuration for marketing campaign agent"""
    campaign_name: str
    campaign_objective: str
    channels: List[MarketingChannelType]
    budget: float
    start_date: str
    end_date: str
    target_audience: Dict[str, Any] = field(default_factory=dict)
    success_metrics: List[MarketingMetricType] = field(default_factory=list)
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ContentConfig:
    """Configuration for content marketing agent"""
    content_types: List[str]
    topics: List[str]
    tone: str = "informative"
    target_audience: Dict[str, Any] = field(default_factory=dict)
    distribution_channels: List[MarketingChannelType] = field(default_factory=list)
    content_calendar: Dict[str, Any] = field(default_factory=dict)
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class AnalyticsConfig:
    """Configuration for marketing analytics agent"""
    data_sources: List[str]
    metrics: List[MarketingMetricType]
    reporting_frequency: str = "weekly"
    dashboard_config: Dict[str, Any] = field(default_factory=dict)
    alert_thresholds: Dict[str, float] = field(default_factory=dict)
    forecasting_enabled: bool = False
    forecasting_horizon_days: int = 30
    anomaly_detection_enabled: bool = False
    attribution_model: str = "last_click"
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ABTestConfig:
    """Configuration for A/B testing"""
    test_name: str
    variants: List[Dict[str, Any]]
    metrics: List[MarketingMetricType]
    audience_split: List[float] = field(default_factory=lambda: [0.5, 0.5])
    min_confidence: float = 0.95
    max_duration_days: int = 30
    auto_implement_winner: bool = False
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class MultiChannelConfig:
    """Configuration for multi-channel campaign orchestration"""
    channels: List[MarketingChannelType]
    channel_budget_allocation: Dict[MarketingChannelType, float] = field(default_factory=dict)
    cross_channel_messaging: Dict[str, Any] = field(default_factory=dict)
    customer_journey_stages: List[str] = field(default_factory=lambda: ["awareness", "consideration", "decision", "retention"])
    touchpoint_mapping: Dict[str, List[Dict[str, Any]]] = field(default_factory=dict)
    attribution_window_days: int = 30
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class PredictiveAnalyticsConfig:
    """Configuration for predictive analytics"""
    metrics_to_forecast: List[MarketingMetricType]
    time_horizon_days: int = 30
    forecast_interval: str = "daily"
    confidence_interval: float = 0.95
    seasonality_mode: str = "additive"
    include_holidays: bool = True
    retraining_frequency: str = "weekly"
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class N8nWorkflowConfig:
    """Configuration for n8n workflow integration"""
    workflow_url: str
    api_key: str
    workflows: Dict[str, str] = field(default_factory=dict)  # name -> workflow_id mapping
    webhook_base_url: Optional[str] = None
    active_workflows: List[str] = field(default_factory=list)
    error_notification_email: Optional[str] = None
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class SupersetDashboardConfig:
    """Configuration for Apache Superset dashboard integration"""
    superset_url: str
    api_key: str
    dashboards: Dict[str, int] = field(default_factory=dict)  # name -> dashboard_id mapping
    refresh_interval: int = 3600  # seconds
    embed_params: Dict[str, Any] = field(default_factory=dict)
    auto_refresh: bool = True
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class RAGConfig:
    """Configuration for RAG with Weaviate"""
    backend: MemoryBackendType = MemoryBackendType.WEAVIATE
    connection_string: str = "http://localhost:8080"
    collection_name: str = "marketing_knowledge"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    document_sources: List[str] = field(default_factory=list)
    refresh_interval: int = 86400  # seconds (daily)
    query_similarity_threshold: float = 0.75
    extra_params: Dict[str, Any] = field(default_factory=dict)

@dataclass
class MarketingAgentConfig(AgentConfig):
    """Extended configuration for marketing-specific agents"""
    seo_config: Optional[SEOConfig] = None
    social_media_config: Optional[SocialMediaConfig] = None
    campaign_config: Optional[CampaignConfig] = None
    content_config: Optional[ContentConfig] = None
    analytics_config: Optional[AnalyticsConfig] = None
    ab_test_config: Optional[ABTestConfig] = None
    multi_channel_config: Optional[MultiChannelConfig] = None
    predictive_analytics_config: Optional[PredictiveAnalyticsConfig] = None
    n8n_workflow_config: Optional[N8nWorkflowConfig] = None
    superset_dashboard_config: Optional[SupersetDashboardConfig] = None
    rag_config: Optional[RAGConfig] = None

@dataclass
class MarketingTask(Task):
    """Extended task definition for marketing-specific tasks"""
    channel: Optional[MarketingChannelType] = None
    target_metrics: List[MarketingMetricType] = field(default_factory=list)
    campaign_id: Optional[str] = None
    content_id: Optional[str] = None
    ab_test_id: Optional[str] = None
    forecast_horizon: Optional[int] = None
    multi_channel: bool = False
    marketing_parameters: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ABTest:
    """A/B Test definition"""
    id: UUID = field(default_factory=uuid4)
    name: str
    variants: List[Dict[str, Any]]
    metrics: List[MarketingMetricType]
    audience_split: List[float]
    start_date: str
    end_date: Optional[str] = None
    status: str = "created"  # created, running, completed, implemented
    results: Dict[str, Any] = field(default_factory=dict)
    winner: Optional[str] = None
    confidence: float = 0.0

@dataclass
class MarketingCampaignPerformance:
    """Performance metrics for a marketing campaign"""
    campaign_id: str
    time_period: str
    overall_metrics: Dict[MarketingMetricType, float]
    channel_metrics: Dict[MarketingChannelType, Dict[MarketingMetricType, float]]
    trend: Dict[str, List[float]]
    recommendations: List[str] = field(default_factory=list)