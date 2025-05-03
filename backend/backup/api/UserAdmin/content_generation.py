from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from backend.supabase_client import supabase
from backend.utils.huggingface import generate_text
from backend.utils.n8n import (
    trigger_instagram_post, trigger_linkedin_post, trigger_facebook_post,
    trigger_twitter_post, trigger_threads_post, trigger_blog_post, trigger_youtube_post
)

router = APIRouter(prefix="/user-admin/content-generation", tags=["user_admin_content_generation"])

class ContentGenRequest(BaseModel):
    prompt: str
    model_name: Optional[str] = "gpt2"
    user_id: Optional[str] = None
    distribute_to: Optional[list] = None  # e.g., ["instagram", "linkedin", ...]

@router.post("/")
def generate_content(req: ContentGenRequest, authorization: str = Header(...)):
    user_id = req.user_id or supabase.auth.get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        result = generate_text(req.model_name, req.prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI content generation failed: {str(e)}")
    # Optionally store generated content as a post
    content = result[0]["generated_text"] if isinstance(result, list) and "generated_text" in result[0] else str(result)
    resp = supabase.table("posts").insert({
        "user_id": user_id,
        "content": content,
        "generated_by_ai": True
    }).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    # Automated distribution via n8n
    distribute_to = req.distribute_to or [
        "instagram", "linkedin", "facebook", "twitter", "threads", "blog", "youtube"
    ]
    distribution_results = {}
    for platform in distribute_to:
        try:
            if platform == "instagram":
                distribution_results[platform] = trigger_instagram_post(content)
            elif platform == "linkedin":
                distribution_results[platform] = trigger_linkedin_post(content)
            elif platform == "facebook":
                distribution_results[platform] = trigger_facebook_post(content)
            elif platform == "twitter":
                distribution_results[platform] = trigger_twitter_post(content)
            elif platform == "threads":
                distribution_results[platform] = trigger_threads_post(content)
            elif platform == "blog":
                distribution_results[platform] = trigger_blog_post(content)
            elif platform == "youtube":
                distribution_results[platform] = trigger_youtube_post(content)
        except Exception as e:
            distribution_results[platform] = {"error": str(e)}
    return {"content": content, "post_id": resp["data"][0]["id"], "distribution": distribution_results}
