from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import HTTPException as FastAPIHTTPException

from api.teams import router as teams_router
from api.organizations import router as organizations_router
from api.auth import router as auth_router
from api.notifications import router as notifications_router
from api.for_hire import router as for_hire_router
from api.hiring import router as hiring_router
from api.ai_reports import router as ai_reports_router
from api.content_generation import router as content_generation_router
from api.ab_tests import router as ab_tests_router
from api.email_campaigns import router as email_campaigns_router
from api.seo import router as seo_router
from api.local_discovery import router as local_discovery_router

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

app.include_router(teams_router)
app.include_router(organizations_router)
app.include_router(auth_router)
app.include_router(notifications_router)
app.include_router(for_hire_router)
app.include_router(hiring_router)
app.include_router(ai_reports_router)
app.include_router(content_generation_router)
app.include_router(ab_tests_router)
app.include_router(email_campaigns_router)
app.include_router(seo_router)
app.include_router(local_discovery_router)

try:
    from api.webhooks import router as webhooks_router
    app.include_router(webhooks_router)
except ImportError:
    pass

@app.post("/api/social-accounts/{account_id}/toggle")
def toggle_account(account_id: int, req: ToggleRequest):
    for acc in accounts:
        if acc["id"] == account_id:
            acc["connected"] = req.connected
            return {"success": True, "account": acc}
    raise HTTPException(status_code=404, detail="Account not found")

@app.exception_handler(FastAPIHTTPException)
async def http_exception_handler(request: Request, exc: FastAPIHTTPException):
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"error": exc.errors()})

# Optionally, handle generic server errors
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": "Internal server error"})
