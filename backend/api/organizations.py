from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from backend.supabase_client import supabase
from datetime import datetime

router = APIRouter(prefix="/organizations", tags=["organizations"])

class OrganizationCreate(BaseModel):
    name: str

@router.post("/")
def create_organization(org: OrganizationCreate, authorization: str = Header(...)):
    from backend.api.users import get_user_id
    owner_id = get_user_id(authorization)
    resp = supabase.table("organizations").insert({
        "name": org.name,
        "created_at": datetime.utcnow().isoformat()
    }).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/")
def list_organizations(authorization: str = Header(...)):
    resp = supabase.table("organizations").select("*").order("created_at", desc=True).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]
