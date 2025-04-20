from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.supabase_client import supabase

router = APIRouter(prefix="/teams", tags=["teams"])

class TeamCreate(BaseModel):
    name: str

class TeamUpdate(BaseModel):
    name: str | None = None

@router.post("/")
def create_team(team: TeamCreate, access_token: str):
    user_resp = supabase.auth.get_user(access_token)
    if user_resp.get("error"):
        raise HTTPException(status_code=401, detail="Invalid token")
    owner_id = user_resp["user"]["id"]
    resp = supabase.table("teams").insert({"name": team.name, "owner_id": owner_id}).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/")
def list_teams(access_token: str):
    user_resp = supabase.auth.get_user(access_token)
    if user_resp.get("error"):
        raise HTTPException(status_code=401, detail="Invalid token")
    owner_id = user_resp["user"]["id"]
    resp = supabase.table("teams").select("*").eq("owner_id", owner_id).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/{team_id}")
def get_team(team_id: str, access_token: str):
    user_resp = supabase.auth.get_user(access_token)
    if user_resp.get("error"):
        raise HTTPException(status_code=401, detail="Invalid token")
    owner_id = user_resp["user"]["id"]
    resp = supabase.table("teams").select("*").eq("id", team_id).eq("owner_id", owner_id).single().execute()
    if resp.get("error"):
        raise HTTPException(status_code=404, detail=resp["error"]["message"])
    return resp["data"]

@router.patch("/{team_id}")
def update_team(team_id: str, team: TeamUpdate, access_token: str):
    user_resp = supabase.auth.get_user(access_token)
    if user_resp.get("error"):
        raise HTTPException(status_code=401, detail="Invalid token")
    owner_id = user_resp["user"]["id"]
    update_data = team.dict(exclude_unset=True)
    resp = supabase.table("teams").update(update_data).eq("id", team_id).eq("owner_id", owner_id).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.delete("/{team_id}")
def delete_team(team_id: str, access_token: str):
    user_resp = supabase.auth.get_user(access_token)
    if user_resp.get("error"):
        raise HTTPException(status_code=401, detail="Invalid token")
    owner_id = user_resp["user"]["id"]
    resp = supabase.table("teams").delete().eq("id", team_id).eq("owner_id", owner_id).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return {"success": True}
