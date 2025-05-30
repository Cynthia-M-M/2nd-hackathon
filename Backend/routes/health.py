from fastapi import APIRouter, HTTPException
from datetime import datetime
from db import get_supabase

router = APIRouter()

async def check_supabase():
    try:
        supabase = get_supabase()
        if not supabase:
            return False
        # Simple query to test connection
        supabase.table("users").select("*").limit(1).execute()
        return True
    except Exception as e:
        return False

@router.get("/health")
async def health_check():
    supabase_status = await check_supabase()
    
    return {
        "status": "ok" if supabase_status else "degraded",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "supabase": "healthy" if supabase_status else "unhealthy",
            "mpesa": "mocked"  # Since we're using mock implementation
        },
        "version": "1.0.0"
    } 