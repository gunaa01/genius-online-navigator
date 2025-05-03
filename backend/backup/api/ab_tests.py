from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from backend.supabase_client import supabase
from backend.utils.huggingface import generate_text

router = APIRouter(prefix="/ab-tests", tags=["ab_tests"])

class ABTestRequest(BaseModel):
    input_text: str
    model_name: Optional[str] = "gpt2"
    user_id: Optional[str] = None

@router.post("/")
def create_ab_test(req: ABTestRequest, authorization: str = Header(...)):
    user_id = req.user_id or supabase.auth.get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        variant_a = generate_text(req.model_name, req.input_text + " Variant A")
        variant_b = generate_text(req.model_name, req.input_text + " Variant B")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI A/B generation failed: {str(e)}")
    resp = supabase.table("ab_tests").insert({
        "user_id": user_id,
        "input_text": req.input_text,
        "variant_a": variant_a[0]["generated_text"] if isinstance(variant_a, list) and "generated_text" in variant_a[0] else str(variant_a),
        "variant_b": variant_b[0]["generated_text"] if isinstance(variant_b, list) and "generated_text" in variant_b[0] else str(variant_b)
    }).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.post("/winner")
def set_ab_test_winner(test_id: str, winner: str, authorization: str = Header(...)):
    user_id = supabase.auth.get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    resp = supabase.table("ab_tests").update({"winner": winner}).eq("id", test_id).eq("user_id", user_id).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]

@router.get("/")
def list_ab_tests(authorization: str = Header(...)):
    user_id = supabase.auth.get_user_id_from_token(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    resp = supabase.table("ab_tests").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    if resp.get("error"):
        raise HTTPException(status_code=400, detail=resp["error"]["message"])
    return resp["data"]
