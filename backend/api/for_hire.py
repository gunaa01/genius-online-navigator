from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from backend.supabase_client import supabase
from datetime import datetime

router = APIRouter(prefix="/for-hire", tags=["for_hire"])

# --- Models ---
class FreelancerProfile(BaseModel):
    user_id: str
    display_name: str
    bio: Optional[str] = None
    skills: List[str] = []
    portfolio_links: List[str] = []
    
class Gig(BaseModel):
    id: Optional[str]
    freelancer_id: str
    title: str
    description: str
    price: float
    images: List[str] = []
    status: str = "active"

class Order(BaseModel):
    id: Optional[str]
    gig_id: str
    client_id: str
    status: str = "pending"
    created_at: Optional[str]

class Review(BaseModel):
    id: Optional[str]
    order_id: str
    rating: int
    comment: Optional[str] = None

class Message(BaseModel):
    id: Optional[str]
    order_id: str
    sender_id: str
    content: str
    timestamp: Optional[str]

# --- Endpoints ---
@router.post("/freelancer-profile")
def create_freelancer_profile(profile: FreelancerProfile):
    resp = supabase.table("freelancer_profiles").insert(profile.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/freelancer-profile/{user_id}")
def get_freelancer_profile(user_id: str):
    resp = supabase.table("freelancer_profiles").select("*").eq("user_id", user_id).single().execute()
    if resp.get("error"):
        raise HTTPException(status_code=404, detail=resp["error"]["message"])
    return resp["data"]

@router.post("/gigs")
def create_gig(gig: Gig):
    resp = supabase.table("gigs").insert(gig.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/gigs")
def list_gigs(skill: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None):
    query = supabase.table("gigs").select("*")
    if skill:
        query = query.contains("skills", [skill])
    if min_price:
        query = query.gte("price", min_price)
    if max_price:
        query = query.lte("price", max_price)
    resp = query.execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.post("/orders")
def create_order(order: Order):
    resp = supabase.table("orders").insert(order.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/orders/{order_id}")
def get_order(order_id: str):
    resp = supabase.table("orders").select("*").eq("id", order_id).single().execute()
    if resp.get("error"):
        raise HTTPException(status_code=404, detail=resp["error"]["message"])
    return resp["data"]

@router.post("/reviews")
def create_review(review: Review):
    resp = supabase.table("reviews").insert(review.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/reviews/{order_id}")
def get_review(order_id: str):
    resp = supabase.table("reviews").select("*").eq("order_id", order_id).single().execute()
    if resp.get("error"):
        raise HTTPException(status_code=404, detail=resp["error"]["message"])
    return resp["data"]

@router.post("/messages")
def send_message(msg: Message):
    msg.timestamp = datetime.utcnow().isoformat()
    resp = supabase.table("messages").insert(msg.dict()).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/messages/{order_id}")
def list_messages(order_id: str):
    resp = supabase.table("messages").select("*").eq("order_id", order_id).order("timestamp").execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]
