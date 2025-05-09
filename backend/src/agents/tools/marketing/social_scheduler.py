"""Social Scheduler Agent tools for AgentForge OSS
This module provides tools for scheduling and managing social media posts with AI.
"""

from typing import Dict, List, Any, Optional, Union
import logging
import json
import asyncio
from datetime import datetime, timedelta

try:
    import autogen
    from autogen import AssistantAgent, UserProxyAgent, GroupChat
except ImportError:
    logging.warning("AutoGen not installed. Install with: pip install pyautogen")

from ...core.marketing_types import SocialMediaConfig, SocialPlatformType

logger = logging.getLogger(__name__)

class SocialSchedulerToolset:
    """Social Scheduler toolset for automated social media post management"""
    
    def __init__(self, config: SocialMediaConfig):
        """Initialize the Social Scheduler toolset with configuration"""
        self.config = config
        self.tools = self._register_tools()
        self.agents = self._setup_agents()
        self.group_chat = None
        self.n8n_client = None
        logger.info(f"Social Scheduler toolset initialized with {len(self.tools)} tools")
    
    def _register_tools(self) -> Dict[str, Any]:
        """Register all Social Scheduler tools"""
        return {
            "generate_post_variations": self.generate_post_variations,
            "analyze_best_posting_time": self.analyze_best_posting_time,
            "schedule_posts": self.schedule_posts,
            "analyze_post_performance": self.analyze_post_performance,
            "get_scheduled_posts": self.get_scheduled_posts,
        }
    
    def _setup_agents(self) -> Dict[str, Any]:
        """Set up AutoGen agents for social media tasks"""
        try:
            # Configure base LLM
            llm_config = {
                "config_list": [{"model": self.config.model_name}],
                "temperature": 0.7,
            }
            
            # Content creator agent
            content_creator = AssistantAgent(
                name="ContentCreator",
                system_message="""You are a creative social media expert who crafts engaging content.
                Focus on creating attention-grabbing headlines, relevant hashtags, and persuasive calls-to-action.
                Tailor content to the specific platform's style and audience preferences.""",
                llm_config=llm_config,
            )
            
            # Analytics agent
            analytics_expert = AssistantAgent(
                name="AnalyticsExpert",
                system_message="""You analyze social media performance data to identify trends and patterns.
                Recommend optimal posting times, content types, and audience targeting based on historical data.
                Provide data-driven insights for maximizing engagement and conversions.""",
                llm_config=llm_config,
            )
            
            # Audience analyst
            audience_analyst = AssistantAgent(
                name="AudienceAnalyst",
                system_message="""You understand different audience segments and their preferences.
                Analyze target demographics, psychographics, and behavioral patterns to tailor content.
                Ensure all recommendations are aligned with the specific audience's interests and needs.""",
                llm_config=llm_config,
            )
            
            # Human feedback agent
            human_proxy = UserProxyAgent(
                name="HumanFeedback",
                system_message="Human feedback and approval for social media posts.",
                code_execution_config=False,
                human_input_mode="NEVER",
            )
            
            # Create agent dictionary
            agents = {
                "content_creator": content_creator,
                "analytics_expert": analytics_expert,
                "audience_analyst": audience_analyst,
                "human_proxy": human_proxy,
            }
            
            # Create group chat
            self.group_chat = GroupChat(
                agents=[content_creator, analytics_expert, audience_analyst, human_proxy],
                messages=[],
                max_round=8
            )
            
            return agents
        except Exception as e:
            logger.error(f"Failed to initialize AutoGen agents: {str(e)}")
            return {}
    
    async def _get_n8n_client(self):
        """Get or create n8n client for workflow automation"""
        if self.n8n_client is None:
            from ..integrations.n8n import N8nWorkflowToolset
            from ...core.marketing_types import N8nWorkflowConfig
            
            # Create n8n configuration
            n8n_config = N8nWorkflowConfig(
                workflow_url=self.config.n8n_url,
                api_key=self.config.n8n_api_key,
                workflows={},
                active_workflows=[]
            )
            
            self.n8n_client = N8nWorkflowToolset(n8n_config)
        
        return self.n8n_client
    
    async def generate_post_variations(self, 
                                     content_brief: str, 
                                     platforms: List[SocialPlatformType], 
                                     num_variations: int = 3) -> Dict[str, Any]:
        """Generate variations of a social media post for different platforms"""
        logger.info(f"Generating {num_variations} post variations for platforms: {platforms}")
        
        try:
            if not self.agents:
                return {"error": "AutoGen agents are not initialized"}
            
            # Format the prompt for the group chat
            platform_list = ", ".join([p.value for p in platforms])
            task_prompt = f"""Generate {num_variations} variations of social media posts for the following platforms: {platform_list}.
            
            Content Brief: {content_brief}
            
            For each platform, create {num_variations} different post variations that match the platform's format and style.
            Each variation should include:
            1. Post text/caption
            2. Relevant hashtags (where appropriate)
            3. Call to action
            4. Best image/media recommendations
            
            ContentCreator: Create the initial post variations.
            AnalyticsExpert: Suggest improvements based on what typically performs well.
            AudienceAnalyst: Refine for target audience preferences.
            """
            
            # Reset the group chat
            self.group_chat.messages = []
            
            # Initiate the group chat
            chat_manager = autogen.GroupChatManager(
                groupchat=self.group_chat,
                llm_config={"config_list": [{"model": self.config.model_name}]},
            )
            
            # Send the task prompt through the human proxy
            self.agents["human_proxy"].initiate_chat(chat_manager, message=task_prompt)
            
            # Process the results
            results = {}
            chat_history = self.group_chat.messages
            
            # Extract the final recommendations
            final_message = chat_history[-2]["content"] if len(chat_history) >= 2 else ""
            
            # Organize results by platform
            for platform in platforms:
                platform_name = platform.value
                results[platform_name] = []
                
                # Extract platform-specific content from the message
                platform_section_start = final_message.find(f"{platform_name}:")
                if platform_section_start != -1:
                    platform_section = final_message[platform_section_start:]
                    next_platform_start = min(
                        [platform_section.find(f"{p.value}:") for p in platforms if p.value != platform_name and platform_section.find(f"{p.value}:") != -1] + 
                        [len(platform_section)]
                    )
                    platform_content = platform_section[:next_platform_start].strip()
                    
                    # Extract variations
                    variation_blocks = platform_content.split("Variation")[1:]
                    for block in variation_blocks[:num_variations]:
                        variation = {}
                        
                        # Extract text/caption
                        if "Caption:" in block:
                            caption_start = block.find("Caption:")
                            caption_end = min([block.find(label + ":") for label in ["Hashtags", "Call to Action", "Media"] if block.find(label + ":") > caption_start] + [len(block)])
                            variation["caption"] = block[caption_start + 8:caption_end].strip()
                        
                        # Extract hashtags
                        if "Hashtags:" in block:
                            hashtags_start = block.find("Hashtags:")
                            hashtags_end = min([block.find(label + ":") for label in ["Call to Action", "Media"] if block.find(label + ":") > hashtags_start] + [len(block)])
                            hashtags = block[hashtags_start + 9:hashtags_end].strip()
                            variation["hashtags"] = [tag.strip() for tag in hashtags.split() if tag.strip().startswith("#")]
                        
                        # Extract call to action
                        if "Call to Action:" in block:
                            cta_start = block.find("Call to Action:")
                            cta_end = min([block.find(label + ":") for label in ["Media"] if block.find(label + ":") > cta_start] + [len(block)])
                            variation["call_to_action"] = block[cta_start + 15:cta_end].strip()
                        
                        # Extract media recommendations
                        if "Media:" in block:
                            media_start = block.find("Media:")
                            variation["media_recommendation"] = block[media_start + 6:].strip()
                        
                        results[platform_name].append(variation)
            
            return {
                "success": True,
                "variations": results,
                "analysis": {
                    "target_audience": self._extract_audience_insights(chat_history),
                    "performance_predictions": self._extract_performance_predictions(chat_history),
                }
            }
        except Exception as e:
            logger.error(f"Error generating post variations: {str(e)}")
            return {"error": f"Failed to generate post variations: {str(e)}"}
    
    def _extract_audience_insights(self, chat_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract audience insights from the chat history"""
        insights = {}
        
        for message in chat_history:
            if message.get("name") == "AudienceAnalyst":
                content = message.get("content", "")
                
                # Extract audience demographics if mentioned
                if "demographics" in content.lower():
                    insights["demographics"] = self._extract_section(content, "demographics", 200)
                
                # Extract preferences if mentioned
                if "preferences" in content.lower():
                    insights["preferences"] = self._extract_section(content, "preferences", 200)
                
                # Extract best practices if mentioned
                if "best practices" in content.lower():
                    insights["best_practices"] = self._extract_section(content, "best practices", 200)
        
        return insights
    
    def _extract_performance_predictions(self, chat_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract performance predictions from the chat history"""
        predictions = {}
        
        for message in chat_history:
            if message.get("name") == "AnalyticsExpert":
                content = message.get("content", "")
                
                # Extract engagement predictions if mentioned
                if "engagement" in content.lower():
                    predictions["engagement"] = self._extract_section(content, "engagement", 200)
                
                # Extract conversion predictions if mentioned
                if "conversion" in content.lower():
                    predictions["conversion"] = self._extract_section(content, "conversion", 200)
                
                # Extract optimal times if mentioned
                if "optimal time" in content.lower() or "best time" in content.lower():
                    predictions["optimal_times"] = self._extract_section(content, "time", 200)
        
        return predictions
    
    def _extract_section(self, text: str, keyword: str, max_length: int = 200) -> str:
        """Extract a section of text around a keyword"""
        keyword_idx = text.lower().find(keyword.lower())
        if keyword_idx == -1:
            return ""
        
        # Get some context before and after the keyword
        start_idx = max(0, keyword_idx - 50)
        end_idx = min(len(text), keyword_idx + max_length)
        
        # Try to find sentence boundaries
        if start_idx > 0:
            sentence_start = text.rfind(".", 0, keyword_idx)
            if sentence_start != -1:
                start_idx = sentence_start + 1
        
        if end_idx < len(text):
            sentence_end = text.find(".", keyword_idx)
            if sentence_end != -1:
                end_idx = sentence_end + 1
        
        return text[start_idx:end_idx].strip()
    
    async def analyze_best_posting_time(self, 
                                       platform: SocialPlatformType, 
                                       historical_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Analyze the best posting time based on historical data"""
        logger.info(f"Analyzing best posting time for platform: {platform}")
        
        try:
            # If historical data is provided, use it
            if historical_data:
                # Process historical data
                engagement_by_day = {}
                engagement_by_hour = {}
                
                for post in historical_data.get("posts", []):
                    post_time = datetime.fromisoformat(post.get("posted_at"))
                    day_of_week = post_time.strftime("%A")
                    hour = post_time.hour
                    
                    # Calculate engagement rate
                    engagement = post.get("engagement", 0)
                    
                    # Update day stats
                    if day_of_week not in engagement_by_day:
                        engagement_by_day[day_of_week] = {"total": 0, "count": 0}
                    engagement_by_day[day_of_week]["total"] += engagement
                    engagement_by_day[day_of_week]["count"] += 1
                    
                    # Update hour stats
                    if hour not in engagement_by_hour:
                        engagement_by_hour[hour] = {"total": 0, "count": 0}
                    engagement_by_hour[hour]["total"] += engagement
                    engagement_by_hour[hour]["count"] += 1
                
                # Calculate averages
                for day in engagement_by_day:
                    if engagement_by_day[day]["count"] > 0:
                        engagement_by_day[day]["average"] = engagement_by_day[day]["total"] / engagement_by_day[day]["count"]
                
                for hour in engagement_by_hour:
                    if engagement_by_hour[hour]["count"] > 0:
                        engagement_by_hour[hour]["average"] = engagement_by_hour[hour]["total"] / engagement_by_hour[hour]["count"]
                
                # Find best day and time
                best_day = max(engagement_by_day.items(), key=lambda x: x[1].get("average", 0))[0]
                best_hour = max(engagement_by_hour.items(), key=lambda x: x[1].get("average", 0))[0]
                
                return {
                    "success": True,
                    "best_posting_time": {
                        "day_of_week": best_day,
                        "hour": best_hour,
                        "recommendation": f"{best_day} at {best_hour}:00",
                    },
                    "day_analysis": {day: stats.get("average", 0) for day, stats in engagement_by_day.items()},
                    "hour_analysis": {hour: stats.get("average", 0) for hour, stats in engagement_by_hour.items()},
                }
            else:
                # Use industry standard best times if no historical data
                platform_best_times = {
                    SocialPlatformType.INSTAGRAM: {"days": ["Wednesday", "Friday"], "hours": [11, 13]},
                    SocialPlatformType.FACEBOOK: {"days": ["Tuesday", "Thursday"], "hours": [9, 15]},
                    SocialPlatformType.TWITTER: {"days": ["Monday", "Wednesday"], "hours": [8, 14]},
                    SocialPlatformType.LINKEDIN: {"days": ["Tuesday", "Wednesday"], "hours": [10, 12]},
                    SocialPlatformType.PINTEREST: {"days": ["Saturday", "Sunday"], "hours": [20, 21]},
                    SocialPlatformType.TIKTOK: {"days": ["Tuesday", "Thursday"], "hours": [19, 21]},
                }
                
                best_times = platform_best_times.get(platform, {"days": ["Monday", "Wednesday"], "hours": [12, 18]})
                
                return {
                    "success": True,
                    "best_posting_time": {
                        "day_of_week": best_times["days"][0],
                        "hour": best_times["hours"][0],
                        "recommendation": f"{best_times['days'][0]} at {best_times['hours'][0]}:00",
                    },
                    "note": "Using industry standard best times due to lack of historical data",
                }
        except Exception as e:
            logger.error(f"Error analyzing best posting time: {str(e)}")
            return {"error": f"Failed to analyze best posting time: {str(e)}"}
    
    async def schedule_posts(self, 
                           posts: List[Dict[str, Any]], 
                           platforms: List[SocialPlatformType],
                           schedule_times: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Schedule posts for publishing using n8n workflows"""
        logger.info(f"Scheduling posts for platforms: {platforms}")
        
        try:
            # Get n8n client
            n8n_client = await self._get_n8n_client()
            
            # Create a workflow for each platform
            workflow_results = {}
            
            for platform in platforms:
                platform_name = platform.value
                platform_posts = [p for p in posts if p.get("platform") == platform_name]
                
                if not platform_posts:
                    workflow_results[platform_name] = {"status": "skipped", "reason": "No posts for this platform"}
                    continue
                
                # Create workflow for platform
                workflow_name = f"social_scheduler_{platform_name.lower()}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
                
                # Define actions for n8n workflow
                actions = []
                
                # Add platform-specific authentication node
                auth_node = {
                    "name": f"Authenticate {platform_name}",
                    "type": platform_name.lower(),
                    "parameters": {
                        "authentication": "oAuth2",
                        "credentialId": f"{platform_name.lower()}_creds"
                    }
                }
                actions.append(auth_node)
                
                # Add a node for each post
                for i, post in enumerate(platform_posts):
                    post_time = schedule_times[i % len(schedule_times)]
                    
                    # Format date and time
                    schedule_date = datetime.now()
                    if post_time.get("day_offset", 0) > 0:
                        schedule_date += timedelta(days=post_time.get("day_offset", 0))
                    
                    scheduled_time = schedule_date.replace(
                        hour=post_time.get("hour", 12),
                        minute=post_time.get("minute", 0),
                        second=0
                    ).isoformat()
                    
                    # Add post node
                    post_node = {
                        "name": f"Post {i+1}",
                        "type": f"{platform_name.lower()}Post",
                        "parameters": {
                            "text": post.get("text", post.get("caption", "")),
                            "media": post.get("media_url", ""),
                            "scheduleTime": scheduled_time,
                        }
                    }
                    
                    # Add platform-specific parameters
                    if platform == SocialPlatformType.TWITTER:
                        post_node["parameters"]["includeReplyToId"] = False
                    elif platform == SocialPlatformType.INSTAGRAM:
                        post_node["parameters"]["caption"] = post.get("caption", "")
                        post_node["parameters"]["tags"] = post.get("hashtags", [])
                    elif platform == SocialPlatformType.LINKEDIN:
                        post_node["parameters"]["updateType"] = "SHARE"
                    
                    actions.append(post_node)
                
                # Add notification node
                notification_node = {
                    "name": "Send Notification",
                    "type": "slack",
                    "parameters": {
                        "channel": self.config.notification_channel,
                        "text": f"Posts scheduled for {platform_name}",
                        "attachments": [
                            {
                                "text": f"Scheduled {len(platform_posts)} posts for {platform_name}",
                                "color": "#00ff00"
                            }
                        ]
                    }
                }
                actions.append(notification_node)
                
                # Create the workflow
                workflow_result = await n8n_client.create_or_update_workflow(
                    name=workflow_name,
                    trigger_type="scheduled",
                    actions=actions,
                    schedule="0 0 * * *"  # Daily at midnight
                )
                
                # Activate the workflow
                if "id" in workflow_result:
                    activation_result = await n8n_client.activate_workflow(workflow_result["id"])
                    workflow_results[platform_name] = {
                        "status": "activated" if activation_result.get("active", False) else "created",
                        "workflow_id": workflow_result["id"],
                        "scheduled_posts": len(platform_posts)
                    }
                else:
                    workflow_results[platform_name] = {
                        "status": "error",
                        "error": workflow_result.get("error", "Unknown error")
                    }
            
            return {
                "success": True,
                "workflows": workflow_results,
                "total_posts_scheduled": sum([r.get("scheduled_posts", 0) for r in workflow_results.values() if isinstance(r, dict)]),
            }
        except Exception as e:
            logger.error(f"Error scheduling posts: {str(e)}")
            return {"error": f"Failed to schedule posts: {str(e)}"}
    
    async def analyze_post_performance(self, 
                                     post_ids: List[str], 
                                     platform: SocialPlatformType) -> Dict[str, Any]:
        """Analyze the performance of published posts"""
        logger.info(f"Analyzing post performance for platform: {platform}")
        
        # Implement this method based on your social media API integration
        # This is a placeholder
        return {"success": True, "message": "Performance analysis functionality not implemented yet"}
    
    async def get_scheduled_posts(self, 
                                platform: SocialPlatformType, 
                                start_date: Optional[str] = None,
                                end_date: Optional[str] = None) -> Dict[str, Any]:
        """Get scheduled posts for a platform"""
        logger.info(f"Getting scheduled posts for platform: {platform}")
        
        # Implement this method based on your n8n workflow integration
        # This is a placeholder
        return {"success": True, "message": "Get scheduled posts functionality not implemented yet"} 