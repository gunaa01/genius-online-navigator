"""Integration tools for AgentForge OSS
This module provides integration with external platforms and services.
"""

from typing import Dict, Any

from ...core.marketing_types import N8nWorkflowConfig, SupersetDashboardConfig


def get_n8n_tools(config: N8nWorkflowConfig):
    """Initialize and return n8n workflow integration tools"""
    from .n8n import N8nWorkflowToolset
    
    return N8nWorkflowToolset(config)


def get_superset_tools(config: SupersetDashboardConfig):
    """Initialize and return Apache Superset dashboard integration tools"""
    from .superset import SupersetDashboardToolset
    
    return SupersetDashboardToolset(config)