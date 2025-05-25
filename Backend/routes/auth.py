from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY")
)

router = APIRouter()

class UserAuth(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(user: UserAuth):
    result = supabase.auth.sign_up({"email": user.email, "password": user.password})
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Signup successful!"}

@router.post("/login")
def login(user: UserAuth):
    result = supabase.auth.sign_in_with_password({"email": user.email, "password": user.password})
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Login successful", "session": result["session"]}
__all__ = ["router"]