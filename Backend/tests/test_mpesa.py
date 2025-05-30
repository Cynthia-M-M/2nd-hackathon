import pytest
from fastapi.testclient import TestClient
from main import app
from datetime import datetime

client = TestClient(app)

def test_mpesa_payment_initiation(auth_headers):
    """Test M-PESA payment initiation"""
    payload = {
        "phone_number": "254712345678",
        "amount": 100.0,
        "description": "Test payment"
    }
    
    response = client.post("/payments/pay", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "transaction_id" in data
    assert data["status"] == "success"
    
def test_mpesa_payment_status(auth_headers):
    """Test M-PESA payment status check"""
    # First initiate a payment
    payload = {
        "phone_number": "254712345678",
        "amount": 100.0
    }
    
    init_response = client.post("/payments/pay", json=payload, headers=auth_headers)
    transaction_id = init_response.json()["transaction_id"]
    
    # Then check its status
    response = client.get(f"/payments/payment/{transaction_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed" 