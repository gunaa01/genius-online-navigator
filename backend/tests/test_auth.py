import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_password_reset():
    resp = client.post("/auth/password-reset", json={"email": "test@example.com"})
    # This will depend on Supabase test config; expect 200 or specific error for unknown email
    assert resp.status_code in [200, 400]
