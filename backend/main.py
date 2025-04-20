from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.users import router as users_router
from api.teams import router as teams_router
from db import Base, engine

app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables (for legacy/local use, not for Supabase)
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(users_router)
app.include_router(teams_router)

# (Optional) Keep your old mock endpoint for reference or testing
# accounts = [
#     {"id": 1, "username": "user1", "connected": True},
#     {"id": 2, "username": "user2", "connected": False},
# ]
# class ToggleRequest(BaseModel):
#     connected: bool
# @app.post("/api/social-accounts/{account_id}/toggle")
# def toggle_account(account_id: int, req: ToggleRequest):
#     for acc in accounts:
#         if acc["id"] == account_id:
#             acc["connected"] = req.connected
#             return {"success": True, "account": acc}
#     raise HTTPException(status_code=404, detail="Account not found")
