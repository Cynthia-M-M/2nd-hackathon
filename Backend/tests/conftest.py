import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from main import app

load_dotenv()

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_user():
    return {
        "id": "test-user-id",
        "email": "test@example.com"
    }

@pytest.fixture
def mock_token(test_user):
    """Create a mock JWT token for testing"""
    payload = {
        "sub": test_user["id"],
        "email": test_user["email"],
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET", "test-secret"),
        algorithm="HS256"
    )
    return token

@pytest.fixture
def auth_headers(mock_token):
    """Return headers with authorization token"""
    return {"Authorization": f"Bearer {mock_token}"} 