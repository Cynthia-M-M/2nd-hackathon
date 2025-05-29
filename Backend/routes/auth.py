from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
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

class User(BaseModel):
    id: str
    email: str

security = HTTPBearer()

async def get_current_user_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        token = credentials.credentials
        # Decode the Supabase JWT token without verification first to get the key id
        unverified_header = jwt.get_unverified_header(token)
        
        # In production, you should fetch and cache Supabase's public keys
        # For now, we'll just verify the signature using our secret
        # Replace this with proper key verification in production
        payload = jwt.decode(
            token,
            os.getenv("SUPABASE_JWT_SECRET"),
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
            
        return User(id=user_id, email=email)
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}"
        )

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