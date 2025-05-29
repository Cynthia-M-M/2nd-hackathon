from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
from datetime import datetime
import uuid
from .auth import get_current_user_from_token, User

router = APIRouter()

class MPESAPayment(BaseModel):
    phone_number: str
    amount: float
    description: Optional[str] = None

@router.post("/pay")
async def initiate_payment(
    payment: MPESAPayment,
    current_user: User = Depends(get_current_user_from_token)
):
    # This is a mock implementation for now
    # In production, this would integrate with the real MPESA API
    
    try:
        # Generate a mock transaction ID
        transaction_id = f"MOCK_{uuid.uuid4().hex[:8].upper()}"
        
        # In production, this would be replaced with actual MPESA API calls
        # using the following environment variables:
        # - os.getenv("MPESA_CONSUMER_KEY")
        # - os.getenv("MPESA_CONSUMER_SECRET")
        # - os.getenv("MPESA_SHORTCODE")
        # - os.getenv("MPESA_PASSKEY")
        
        # Mock successful payment
        payment_record = {
            "transaction_id": transaction_id,
            "user_id": current_user.id,
            "phone_number": payment.phone_number,
            "amount": payment.amount,
            "description": payment.description,
            "status": "success",
            "type": "mock",
            "timestamp": datetime.now().isoformat()
        }
        
        # In production, save this to your database
        
        return {
            "message": "Payment initiated successfully",
            "transaction_id": transaction_id,
            "status": "success",
            "mock_message": "This is a simulated payment for testing purposes"
        }
        
    except Exception as e:
        raise HTTPException(500, f"Failed to process payment: {str(e)}")

@router.get("/payment/{transaction_id}")
async def get_payment_status(
    transaction_id: str,
    current_user: User = Depends(get_current_user_from_token)
):
    # Mock implementation - in production, query your database
    if transaction_id.startswith("MOCK_"):
        return {
            "transaction_id": transaction_id,
            "status": "completed",
            "mock": True
        }
    raise HTTPException(404, "Transaction not found")

@router.get("/")
def get_payments():
    return {"message": "Payments route is working!"}