from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .auth import get_current_user_from_token, User
from db import get_supabase

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
    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    
    try:
        data = {
            "user_id": current_user.id,
            **transaction.dict(),
            "created_at": datetime.now().isoformat()
        }
        result = supabase.table("transactions").insert(data).execute()
        return result.data[0] if result.data else data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Transaction])
async def get_transactions(
    current_user: User = Depends(get_current_user_from_token)
):
    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    
    try:
        result = supabase.table("transactions")\
            .select("*")\
            .eq("user_id", current_user.id)\
            .execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{transaction_id}")
async def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user_from_token)
):
    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    
    try:
        result = supabase.table("transactions")\
            .select("*")\
            .eq("id", transaction_id)\
            .eq("user_id", current_user.id)\
            .single()\
            .execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user_from_token)
):
    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    
    try:
        # First verify the transaction belongs to the user
        result = supabase.table("transactions")\
            .select("id")\
            .eq("id", transaction_id)\
            .eq("user_id", current_user.id)\
            .single()\
            .execute()
            
        if not result.data:
            raise HTTPException(status_code=404, detail="Transaction not found")
            
        # Then delete it
        supabase.table("transactions")\
            .delete()\
            .eq("id", transaction_id)\
            .execute()
            
        return {"message": f"Transaction {transaction_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))