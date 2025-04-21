import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_create_team():
    token = "Bearer <valid_access_token>"
    org_id = "<org_id>"
    response = client.post(
        "/teams/",
        headers={"Authorization": token},
        json={"name": "Test Team", "org_id": org_id}
    )
    assert response.status_code == 200
    assert "id" in response.json()[0]

def test_list_teams_requires_org_id():
    token = "Bearer <valid_access_token>"
    response = client.get("/teams/", headers={"Authorization": token})
    assert response.status_code == 422  # Missing org_id

# Add more tests for update, delete, admin check, etc.
