from fastapi import APIRouter, HTTPException, Header, UploadFile, File, Query
from pydantic import BaseModel
from backend.supabase_client import supabase
from datetime import datetime, timedelta

router = APIRouter(prefix="/teams", tags=["teams"])

class TeamCreate(BaseModel):
    name: str
    org_id: str

class TeamUpdate(BaseModel):
    name: str | None = None
    org_id: str | None = None

def get_user_id(authorization: str):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    access_token = authorization.split(" ", 1)[1]
    user_resp = supabase.auth.get_user(access_token)
    if user_resp.get("error"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_resp["user"]["id"]

def log_action(user_id: str, action: str, details: dict = None):
    supabase.table("logs").insert({
        "user_id": user_id,
        "action": action,
        "details": details or {},
        "timestamp": datetime.utcnow().isoformat()
    }).execute()

@router.post("/")
def create_team(team: TeamCreate, authorization: str = Header(...)):
    owner_id = get_user_id(authorization)
    resp = supabase.table("teams").insert({"name": team.name, "owner_id": owner_id, "org_id": team.org_id}).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    log_action(owner_id, "create_team", {"team": team.name, "org_id": team.org_id})
    return resp["data"]

@router.get("/")
def list_teams(
    authorization: str = Header(...),
    org_id: str = Query(..., description="Organization ID (required)"),
    name: str = Query(None, description="Filter by team name"),
    created_after: str = Query(None, description="Filter teams created after this ISO date (optional)")
):
    owner_id = get_user_id(authorization)
    query = supabase.table("teams").select("*").eq("owner_id", owner_id).eq("org_id", org_id)
    if name:
        query = query.ilike("name", f"%{name}%")
    if created_after:
        query = query.gte("created_at", created_after)
    resp = query.execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    log_action(owner_id, "list_teams", {"org_id": org_id, "name": name, "created_after": created_after})
    return resp["data"]

@router.get("/{team_id}")
def get_team(team_id: str, authorization: str = Header(...), org_id: str = Query(..., description="Organization ID (required)")):
    owner_id = get_user_id(authorization)
    resp = supabase.table("teams").select("*").eq("id", team_id).eq("owner_id", owner_id).eq("org_id", org_id).single().execute()
    if resp.get("error"):
        raise HTTPException(status_code=404, detail=resp["error"]["message"])
    log_action(owner_id, "get_team", {"team_id": team_id, "org_id": org_id})
    return resp["data"]

@router.patch("/{team_id}")
def update_team(team_id: str, team: TeamUpdate, authorization: str = Header(...)):
    owner_id = get_user_id(authorization)
    update_data = team.dict(exclude_unset=True)
    resp = supabase.table("teams").update(update_data).eq("id", team_id).eq("owner_id", owner_id)
    if update_data.get("org_id"):
        resp = resp.eq("org_id", update_data["org_id"])
    resp = resp.execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    log_action(owner_id, "update_team", {"team_id": team_id, "update": update_data})
    return resp["data"]

@router.delete("/{team_id}")
def delete_team(team_id: str, authorization: str = Header(...), org_id: str = Query(..., description="Organization ID (required)")):
    owner_id = get_user_id(authorization)
    from backend.api.users import require_role
    require_role(owner_id, "admin")
    resp = supabase.table("teams").delete().eq("id", team_id).eq("owner_id", owner_id).eq("org_id", org_id).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    log_action(owner_id, "delete_team", {"team_id": team_id, "org_id": org_id})
    return {"success": True}

@router.post("/{team_id}/upload-logo")
def get_upload_url(team_id: str, authorization: str = Header(...)):
    owner_id = get_user_id(authorization)
    from backend.api.users import require_role
    require_role(owner_id, "admin")
    resp = supabase.storage.from_("team-logos").create_signed_url(f"{team_id}/logo.png", 60 * 5)
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    log_action(owner_id, "generate_upload_url", {"team_id": team_id})
    return {"upload_url": resp["signedURL"]}

@router.post("/{team_id}/upload-logo-direct")
async def upload_logo_direct(team_id: str, file: UploadFile = File(...), authorization: str = Header(...)):
    owner_id = get_user_id(authorization)
    from backend.api.users import require_role
    require_role(owner_id, "admin")
    content = await file.read()
    resp = supabase.storage.from_("team-logos").upload(f"{team_id}/logo.png", content)
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    log_action(owner_id, "upload_logo_direct", {"team_id": team_id})
    return {"message": "File uploaded successfully"}
