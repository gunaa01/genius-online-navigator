from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from backend.supabase_client import supabase
from backend.utils.huggingface import summarize_text
import os

router = APIRouter(prefix="/ai-reports", tags=["ai_reports"])

class AIReportRequest(BaseModel):
    title: str
    input_data: dict
    model_name: Optional[str] = "facebook/bart-large-cnn"

@router.post("/")
def create_ai_report(report: AIReportRequest, authorization: str = Header(...)):
    user_id = supabase.auth.get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        summary = summarize_text(report.model_name, report.input_data.get("text", ""))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI summarization failed: {str(e)}")
    resp = supabase.table("ai_reports").insert({
        "user_id": user_id,
        "title": report.title,
        "input_data": report.input_data,
        "ai_summary": summary[0]["summary_text"] if isinstance(summary, list) and "summary_text" in summary[0] else str(summary)
    }).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/")
def list_ai_reports(authorization: str = Header(...)):
    user_id = supabase.auth.get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    resp = supabase.table("ai_reports").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]
