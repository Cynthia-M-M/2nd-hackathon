import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
from jose import jwt
import os
from dotenv import load_dotenv
from ..main import app

load_dotenv()

client = TestClient(app)

@pytest.fixture
def mock_token():
    """Create a mock JWT token for testing"""
    payload = {
        "sub": "test-user-id",
        "email": "test@example.com",
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(
        payload,
        os.getenv("SUPABASE_JWT_SECRET", "test-secret"),
        algorithm="HS256"
    )
    return token

def test_login_validation(mock_token):
    """Test login endpoint input validation"""
    response = client.post("/auth/login", json={
        "email": "invalid-email",
        "password": "short"
    })
    assert response.status_code == 422  # Validation error

def test_protected_route_no_token():
    """Test protected route without token"""
    response = client.get("/transactions")
    assert response.status_code == 401

def test_protected_route_with_token(mock_token):
    """Test protected route with valid token"""
    response = client.get(
        "/transactions",
        headers={"Authorization": f"Bearer {mock_token}"}
    )
    assert response.status_code == 200

def test_payment_validation(mock_token):
    """Test payment endpoint validation"""
    # Test invalid phone number format
    response = client.post(
        "/pay",
        headers={"Authorization": f"Bearer {mock_token}"},
        json={
            "phone_number": "invalid",
            "amount": 100
        }
    )
    assert response.status_code == 422

    # Test valid payment request
    response = client.post(
        "/pay",
        headers={"Authorization": f"Bearer {mock_token}"},
        json={
            "phone_number": "254700000000",
            "amount": 100,
            "description": "Test payment"
        }
    )
    assert response.status_code == 200
    assert "transaction_id" in response.json()
    assert response.json()["status"] == "success"

def test_file_upload(mock_token):
    """Test file upload endpoints"""
    # Test image upload
    with open("tests/test_files/test_image.jpg", "rb") as f:
        response = client.post(
            "/upload-image",
            headers={"Authorization": f"Bearer {mock_token}"},
            files={"file": ("test_image.jpg", f, "image/jpeg")}
        )
        assert response.status_code == 200
        assert "filename" in response.json()

    # Test audio upload
    with open("tests/test_files/test_audio.mp3", "rb") as f:
        response = client.post(
            "/upload-audio",
            headers={"Authorization": f"Bearer {mock_token}"},
            files={"file": ("test_audio.mp3", f, "audio/mpeg")}
        )
        assert response.status_code == 200
        assert "filename" in response.json() 