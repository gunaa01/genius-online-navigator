from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from backend.supabase_client import supabase
from datetime import datetime

router = APIRouter(prefix="/hiring", tags=["hiring"])

# --- Models ---
class RecruiterProfile(BaseModel):
    user_id: str
    company: str
    bio: Optional[str] = None

class Job(BaseModel):
    id: Optional[str]
    recruiter_id: str
    title: str
    description: str
    requirements: List[str] = []
    salary: Optional[str] = None
    status: str = "open"

class ApplicantProfile(BaseModel):
    user_id: str
    skills: List[str] = []
    resume_url: Optional[str] = None
    bio: Optional[str] = None

class Application(BaseModel):
    id: Optional[str]
    job_id: str
    applicant_id: str
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None
    status: str = "applied"
    created_at: Optional[str]

class Message(BaseModel):
    id: Optional[str]
    application_id: str
    sender_id: str
    content: str
    timestamp: Optional[str]

# --- Endpoints ---
@router.post("/recruiter-profile")
def create_recruiter_profile(profile: RecruiterProfile):
    resp = supabase.table("recruiter_profiles").insert(profile.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/recruiter-profile/{user_id}")
def get_recruiter_profile(user_id: str):
    resp = supabase.table("recruiter_profiles").select("*").eq("user_id", user_id).single().execute()
    if resp.get("error"):
        raise HTTPException(status_code=404, detail=resp["error"]["message"])
    return resp["data"]

@router.post("/jobs")
def create_job(job: Job):
    resp = supabase.table("jobs").insert(job.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/jobs")
def list_jobs(skill: Optional[str] = None, status: Optional[str] = None):
    query = supabase.table("jobs").select("*")
    if skill:
        query = query.contains("requirements", [skill])
    if status:
        query = query.eq("status", status)
    resp = query.execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.post("/applicant-profile")
def create_applicant_profile(profile: ApplicantProfile):
    resp = supabase.table("applicant_profiles").insert(profile.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/applicant-profile/{user_id}")
def get_applicant_profile(user_id: str):
    resp = supabase.table("applicant_profiles").select("*").eq("user_id", user_id).single().execute()
    if resp.get("error"):
        raise HTTPException(status_code=404, detail=resp["error"]["message"])
    return resp["data"]

@router.post("/applications")
def create_application(application: Application):
    application.created_at = datetime.utcnow().isoformat()
    resp = supabase.table("applications").insert(application.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/applications/{job_id}")
def list_applications(job_id: str):
    resp = supabase.table("applications").select("*").eq("job_id", job_id).order("created_at").execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.post("/messages")
def send_message(msg: Message):
    msg.timestamp = datetime.utcnow().isoformat()
    resp = supabase.table("messages").insert(msg.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/messages/{application_id}")
def list_messages(application_id: str):
    resp = supabase.table("messages").select("*").eq("application_id", application_id).order("timestamp").execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]
