import os
import requests

N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL")

def trigger_post_publishing(post_id):
    # Call n8n webhook to publish scheduled post
    response = requests.post(f"{N8N_WEBHOOK_URL}/publish-post", json={"post_id": post_id})
    response.raise_for_status()
    return response.json()

def trigger_email_campaign(campaign_id):
    response = requests.post(f"{N8N_WEBHOOK_URL}/start-email-campaign", json={"campaign_id": campaign_id})
    response.raise_for_status()
    return response.json()

def trigger_social_post(platform, content, metadata=None):
    # Call n8n webhook to distribute content to the specified platform
    response = requests.post(f"{N8N_WEBHOOK_URL}/publish-social", json={
        "platform": platform,
        "content": content,
        "metadata": metadata or {}
    })
    response.raise_for_status()
    return response.json()

def trigger_instagram_post(content, metadata=None):
    return trigger_social_post("instagram", content, metadata)

def trigger_linkedin_post(content, metadata=None):
    return trigger_social_post("linkedin", content, metadata)

def trigger_facebook_post(content, metadata=None):
    return trigger_social_post("facebook", content, metadata)

def trigger_twitter_post(content, metadata=None):
    return trigger_social_post("twitter", content, metadata)

def trigger_threads_post(content, metadata=None):
    return trigger_social_post("threads", content, metadata)

def trigger_blog_post(content, metadata=None):
    return trigger_social_post("blog", content, metadata)

def trigger_youtube_post(content, metadata=None):
    return trigger_social_post("youtube", content, metadata)
