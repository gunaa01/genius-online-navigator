"""Apache Superset Dashboard Integration tools for AgentForge OSS
This module provides integration with Apache Superset for marketing analytics dashboards.
"""

from typing import Dict, List, Any, Optional
import logging
import aiohttp
import json
from datetime import datetime

from ...core.marketing_types import SupersetDashboardConfig

logger = logging.getLogger(__name__)

class SupersetDashboardToolset:
    """Apache Superset Dashboard Integration toolset for marketing agents"""
    
    def __init__(self, config: SupersetDashboardConfig):
        """Initialize the Apache Superset Dashboard Integration toolset with configuration"""
        self.config = config
        self.tools = self._register_tools()
        self.session = None
        logger.info(f"Apache Superset Dashboard Integration toolset initialized with {len(self.tools)} tools")
    
    def _register_tools(self) -> Dict[str, Any]:
        """Register all Apache Superset Dashboard Integration tools"""
        return {
            "create_dashboard": self.create_dashboard,
            "update_dashboard": self.update_dashboard,
            "get_dashboard": self.get_dashboard,
            "create_chart": self.create_chart,
            "refresh_dashboard": self.refresh_dashboard,
            "get_embed_url": self.get_embed_url,
        }
    
    async def _get_session(self):
        """Get or create an HTTP session"""
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession(headers={
                "Authorization": f"Bearer {self.config.api_key}",
                "Content-Type": "application/json"
            })
        return self.session
    
    async def create_dashboard(self, name: str, description: str = "", 
                             charts: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create a new Superset dashboard"""
        logger.info(f"Creating Superset dashboard: {name}")
        
        # Prepare dashboard data
        dashboard_data = {
            "dashboard_title": name,
            "published": True,
            "css": "",
            "json_metadata": json.dumps({
                "timed_refresh_immune_slices": [],
                "expanded_slices": {},
                "refresh_frequency": self.config.refresh_interval,
                "default_filters": "{}",
                "color_scheme": "supersetColors",
                "label_colors": {},
                "shared_label_colors": {},
                "color_scheme_domain": [],
                "filter_scopes": {},
                "chart_configuration": {}
            }),
            "position_json": json.dumps({
                "DASHBOARD_VERSION_KEY": "v2",
                "ROOT_ID": {"type": "ROOT", "id": "ROOT_ID", "children": []}
            }),
            "metadata": json.dumps({"description": description})
        }
        
        # Make API request to create dashboard
        session = await self._get_session()
        url = f"{self.config.superset_url}/api/v1/dashboard/"
        
        async with session.post(url, json=dashboard_data) as response:
            if response.status in (200, 201):
                result = await response.json()
                dashboard_id = result.get("id")
                self.config.dashboards[name] = dashboard_id
                
                # Add charts if provided
                if charts and dashboard_id:
                    for chart in charts:
                        chart_result = await self.create_chart(chart["name"], chart["viz_type"], 
                                                            chart["datasource_id"], chart["params"])
                        if "error" not in chart_result:
                            await self._add_chart_to_dashboard(dashboard_id, chart_result["id"])
                
                return result
            else:
                error_text = await response.text()
                logger.error(f"Failed to create dashboard: {error_text}")
                return {"error": f"Failed to create dashboard: {response.status}", "details": error_text}
    
    async def update_dashboard(self, dashboard_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing Superset dashboard"""
        logger.info(f"Updating Superset dashboard: {dashboard_id}")
        
        session = await self._get_session()
        url = f"{self.config.superset_url}/api/v1/dashboard/{dashboard_id}"
        
        async with session.put(url, json=data) as response:
            if response.status == 200:
                return await response.json()
            else:
                error_text = await response.text()
                logger.error(f"Failed to update dashboard: {error_text}")
                return {"error": f"Failed to update dashboard: {response.status}", "details": error_text}
    
    async def get_dashboard(self, dashboard_id: int) -> Dict[str, Any]:
        """Get a Superset dashboard by ID"""
        logger.info(f"Getting Superset dashboard: {dashboard_id}")
        
        session = await self._get_session()
        url = f"{self.config.superset_url}/api/v1/dashboard/{dashboard_id}"
        
        async with session.get(url) as response:
            if response.status == 200:
                return await response.json()
            else:
                error_text = await response.text()
                logger.error(f"Failed to get dashboard: {error_text}")
                return {"error": f"Failed to get dashboard: {response.status}", "details": error_text}
    
    async def create_chart(self, name: str, viz_type: str, datasource_id: int, 
                         params: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new Superset chart"""
        logger.info(f"Creating Superset chart: {name}")
        
        # Prepare chart data
        chart_data = {
            "datasource_id": datasource_id,
            "datasource_type": "table",
            "slice_name": name,
            "viz_type": viz_type,
            "params": json.dumps(params),
            "description": "",
            "cache_timeout": None,
            "perm": None,
            "schema_perm": None
        }
        
        # Make API request to create chart
        session = await self._get_session()
        url = f"{self.config.superset_url}/api/v1/chart/"
        
        async with session.post(url, json=chart_data) as response:
            if response.status in (200, 201):
                return await response.json()
            else:
                error_text = await response.text()
                logger.error(f"Failed to create chart: {error_text}")
                return {"error": f"Failed to create chart: {response.status}", "details": error_text}
    
    async def _add_chart_to_dashboard(self, dashboard_id: int, chart_id: int) -> Dict[str, Any]:
        """Add a chart to a dashboard"""
        logger.info(f"Adding chart {chart_id} to dashboard {dashboard_id}")
        
        # First get current dashboard layout
        dashboard = await self.get_dashboard(dashboard_id)
        if "error" in dashboard:
            return dashboard
        
        # Parse position_json
        position_json = json.loads(dashboard.get("position_json", "{}"))
        
        # Add chart to layout
        chart_component = {
            "type": "CHART",
            "id": f"CHART-{chart_id}",
            "chartId": chart_id,
            "meta": {
                "width": 6,
                "height": 50,
                "chartId": chart_id
            }
        }
        
        # Add to root children or create a new row
        if "ROOT_ID" in position_json and "children" in position_json["ROOT_ID"]:
            # Check if there's a row to add to
            has_row = False
            for child in position_json["ROOT_ID"]["children"]:
                if child.get("type") == "ROW":
                    child["children"].append(chart_component["id"])
                    position_json[chart_component["id"]] = chart_component
                    has_row = True
                    break
            
            # Create new row if needed
            if not has_row:
                row_id = f"ROW-{hash(str(datetime.now())) % 10000}"
                row_component = {
                    "type": "ROW",
                    "id": row_id,
                    "children": [chart_component["id"]]
                }
                position_json["ROOT_ID"]["children"].append(row_id)
                position_json[row_id] = row_component
                position_json[chart_component["id"]] = chart_component
        
        # Update dashboard with new layout
        update_data = {
            "position_json": json.dumps(position_json)
        }
        
        return await self.update_dashboard(dashboard_id, update_data)
    
    async def refresh_dashboard(self, dashboard_id: int) -> Dict[str, Any]:
        """Refresh a Superset dashboard"""
        logger.info(f"Refreshing Superset dashboard: {dashboard_id}")
        
        session = await self._get_session()
        url = f"{self.config.superset_url}/api/v1/dashboard/{dashboard_id}/refresh"
        
        async with session.post(url) as response:
            if response.status == 200:
                return await response.json()
            else:
                error_text = await response.text()
                logger.error(f"Failed to refresh dashboard: {error_text}")
                return {"error": f"Failed to refresh dashboard: {response.status}", "details": error_text}
    
    async def get_embed_url(self, dashboard_id: int, expires_in: int = 3600) -> Dict[str, Any]:
        """Get an embeddable URL for a dashboard"""
        logger.info(f"Getting embed URL for dashboard: {dashboard_id}")
        
        # Prepare embed request data
        embed_data = {
            "resource": {
                "type": "dashboard",
                "id": dashboard_id
            },
            "rls": [],
            "expires_in": expires_in,
            "allowed_domains": ["*"]
        }
        
        # Add embed parameters if configured
        if self.config.embed_params:
            embed_data["filters"] = self.config.embed_params
        
        # Make API request to get embed URL
        session = await self._get_session()
        url = f"{self.config.superset_url}/api/v1/security/guest_token/"
        
        async with session.post(url, json=embed_data) as response:
            if response.status == 200:
                result = await response.json()
                token = result.get("token")
                embed_url = f"{self.config.superset_url}/embed/dashboard/{dashboard_id}/?standalone=true&guest_token={token}"
                return {"embed_url": embed_url, "token": token, "expires_in": expires_in}
            else:
                error_text = await response.text()
                logger.error(f"Failed to get embed URL: {error_text}")
                return {"error": f"Failed to get embed URL: {response.status}", "details": error_text}
    
    async def close(self):
        """Close the HTTP session"""
        if self.session and not self.session.closed:
            await self.session.close()