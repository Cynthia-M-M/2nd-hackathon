from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .auth import get_current_user_from_token, User

router = APIRouter()

class Transaction(BaseModel):
    amount: float
    description: str
    category: str
    type: str  # "income" or "expense"
    date: Optional[datetime] = None
    image_url: Optional[str] = None

@router.post("/")
async def create_transaction(
    transaction: Transaction,
    current_user: User = Depends(get_current_user_from_token)
):
    # Mock implementation - in production, save to database
    return {
        "id": "mock_transaction_id",
        "user_id": current_user.id,
        **transaction.dict(),
        "created_at": datetime.now().isoformat()
    }

@router.get("/", response_model=List[Transaction])
async def get_transactions(
    current_user: User = Depends(get_current_user_from_token)
):
    # Mock implementation - in production, fetch from database
    return [
        {
            "amount": 1000,
            "description": "Sample transaction",
            "category": "Food",
            "type": "expense",
            "date": datetime.now(),
        }
    ]

@router.get("/{transaction_id}")
async def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user_from_token)
):
    # Mock implementation - in production, fetch from database
    return {
        "id": transaction_id,
        "user_id": current_user.id,
        "amount": 1000,
        "description": "Sample transaction",
        "category": "Food",
        "type": "expense",
        "date": datetime.now().isoformat()
    }

@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user_from_token)
):
    # Mock implementation - in production, delete from database
    return {"message": f"Transaction {transaction_id} deleted successfully"}