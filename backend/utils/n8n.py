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
