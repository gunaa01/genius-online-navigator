from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from backend.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

class PasswordResetRequest(BaseModel):
    email: EmailStr

@router.post("/password-reset")
def password_reset(req: PasswordResetRequest):
    resp = supabase.auth.reset_password_for_email(req.email)
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return {"message": "Password reset email sent if the address exists."}
