from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from backend.supabase_client import supabase
from backend.utils.huggingface import generate_text
from backend.utils.n8n import trigger_email_campaign

router = APIRouter(prefix="/email-campaigns", tags=["email_campaigns"])

class EmailCampaignRequest(BaseModel):
    subject_prompt: str
    body_prompt: str
    model_name: Optional[str] = "gpt2"
    user_id: Optional[str] = None

@router.post("/")
def create_email_campaign(req: EmailCampaignRequest, authorization: str = Header(...)):
    user_id = req.user_id or supabase.auth.get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        subject_result = generate_text(req.model_name, req.subject_prompt)
        body_result = generate_text(req.model_name, req.body_prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI campaign generation failed: {str(e)}")
    subject = subject_result[0]["generated_text"] if isinstance(subject_result, list) and "generated_text" in subject_result[0] else str(subject_result)
    body = body_result[0]["generated_text"] if isinstance(body_result, list) and "generated_text" in body_result[0] else str(body_result)
    resp = supabase.table("email_campaigns").insert({
        "user_id": user_id,
        "subject": subject,
        "body": body
    }).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    campaign_id = resp["data"][0]["id"]
    try:
        trigger_email_campaign(campaign_id)
    except Exception as e:
        # Not fatal, but log or notify
        pass
    return {"campaign_id": campaign_id, "subject": subject, "body": body}

@router.get("/")
def list_email_campaigns(authorization: str = Header(...)):
    user_id = supabase.auth.get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    resp = supabase.table("email_campaigns").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]
