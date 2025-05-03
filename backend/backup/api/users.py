from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from backend.supabase_client import supabase

router = APIRouter(prefix="/users", tags=["users"])

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register_user(req: RegisterRequest):
    response = supabase.auth.sign_up({"email": req.email, "password": req.password})
    if response.get("error"):
        raise HTTPException(status_code=400, detail=response["error"]["message"])
    return {"user": response["user"]}

@router.post("/login")
def login_user(req: LoginRequest):
    response = supabase.auth.sign_in_with_password({"email": req.email, "password": req.password})
    if response.get("error"):
        raise HTTPException(status_code=400, detail=response["error"]["message"])
    return {"session": response["session"], "user": response["user"]}

@router.get("/profile")
def get_profile(access_token: str):
    response = supabase.auth.get_user(access_token)
    if response.get("error"):
        raise HTTPException(status_code=401, detail=response["error"]["message"])
    return {"user": response["user"]}
