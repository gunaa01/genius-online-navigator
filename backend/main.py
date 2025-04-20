from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)

# Mock database
accounts = [
    {"id": 1, "username": "user1", "connected": True},
    {"id": 2, "username": "user2", "connected": False},
]

class ToggleRequest(BaseModel):
    connected: bool

@app.post("/api/social-accounts/{account_id}/toggle")
def toggle_account(account_id: int, req: ToggleRequest):
    for acc in accounts:
        if acc["id"] == account_id:
            acc["connected"] = req.connected
            return {"success": True, "account": acc}
    raise HTTPException(status_code=404, detail="Account not found")
