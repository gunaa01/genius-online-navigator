from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from backend.supabase_client import supabase
from backend.utils.huggingface import generate_text

router = APIRouter(prefix="/content-generation", tags=["content_generation"])

class ContentGenRequest(BaseModel):
    prompt: str
    model_name: Optional[str] = "gpt2"
    user_id: Optional[str] = None

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
    return {"content": content, "post_id": resp["data"][0]["id"]}
