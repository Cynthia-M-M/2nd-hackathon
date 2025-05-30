from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from db import get_supabase
from datetime import datetime, timedelta
import logging

# Configure route-specific logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

router = APIRouter()

class UserAuth(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str

class TokenData(BaseModel):
    sub: str
    exp: datetime

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "your-secret-key")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        token_data = TokenData(
            sub=payload.get("sub"),
            exp=datetime.fromtimestamp(payload.get("exp"))
        )
        return token_data
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/signup")
async def signup(user: UserAuth):
    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=503, detail="Authentication service unavailable")
    
    try:
        result = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"]["message"])
        return {"message": "Signup successful!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        # Log login attempt
        logger.info(f"Login attempt for user: {form_data.username}")
        
        # Here you would typically validate against your database
        # For demo purposes, we'll use a simple check
        if form_data.username == "demo" and form_data.password == "password":
            token_expires = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            token_data = {
                "sub": form_data.username,
                "exp": token_expires.timestamp()
            }
            token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
            
            logger.info(f"Login successful for user: {form_data.username}")
            return {"access_token": token, "token_type": "bearer"}
        
        logger.warning(f"Failed login attempt for user: {form_data.username}")
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password"
        )
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@router.get("/me")
async def read_users_me(current_user: TokenData = Depends(get_current_user)):
    logger.info(f"Profile accessed for user: {current_user.sub}")
    return {
        "username": current_user.sub,
        "expires": current_user.exp.isoformat()
    }

__all__ = ["router"]