from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from backend.supabase_client import supabase
from datetime import datetime

router = APIRouter(prefix="/notifications", tags=["notifications"])

class NotificationCreate(BaseModel):
    message: str
    type: str = "info"  # e.g., info, warning, alert
    link: str | None = None

@router.post("/")
def create_notification(notification: NotificationCreate, authorization: str = Header(...)):
    # Only admins can send notifications (optional)
    from backend.api.users import get_user_id, require_role
    user_id = get_user_id(authorization)
    require_role(user_id, "admin")
    resp = supabase.table("notifications").insert({
        "user_id": user_id,
        "message": notification.message,
        "type": notification.type,
        "link": notification.link,
        "created_at": datetime.utcnow().isoformat()
    }).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/")
def get_notifications(authorization: str = Header(...)):
    from backend.api.users import get_user_id
    user_id = get_user_id(authorization)
    resp = supabase.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]
