import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_create_organization():
    token = "Bearer <valid_access_token>"
    response = client.post(
        "/organizations/",
        headers={"Authorization": token},
        json={"name": "Test Org"}
    )
    assert response.status_code == 200
    assert "id" in response.json()[0]

def test_list_organizations():
    token = "Bearer <valid_access_token>"
    response = client.get("/organizations/", headers={"Authorization": token})
    assert response.status_code == 200
    assert isinstance(response.json(), list)
