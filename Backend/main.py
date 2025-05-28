
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
from typing import Optional
import os
import jwt
import atexit
import signal
import sys
import logging
import re

# --- Configure logging ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# --- Load environment variables ---
load_dotenv()

# --- FastAPI App Init ---
app = FastAPI()

# --- Static directory for favicon ---
os.makedirs("static", exist_ok=True)

@app.get("/favicon.ico")
async def favicon():
    path = "static/favicon.ico"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Favicon not found")
    return FileResponse(path)

# --- CORS Setup ---
origins = [
    "http://localhost:3000",
    "http://localhost:5173" # Vite local frontend
    "https://kashela.netlify.app", # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Supabase Init ---
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", "")
)

# --- Cleanup on shutdown ---
def cleanup():
    logger.info("Cleaning up resources...")
    try:
        if supabase:
            supabase.auth.sign_out()
            logger.info("Closed Supabase connection")
    except Exception as e:
        logger.error(f"Error during Supabase cleanup: {e}")

    temp_dir = "."
    pattern = r"temp_\\d+\\.(wav|png)"
    for file in os.listdir(temp_dir):
        if re.match(pattern, file):
            try:
                os.remove(os.path.join(temp_dir, file))
                logger.info(f"Removed temporary file: {file}")
            except Exception as e:
                logger.error(f"Error removing temporary file {file}: {e}")

atexit.register(cleanup)

def signal_handler(sig, frame):
    logger.info(f"Received signal {sig}")
    cleanup()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

@app.on_event("startup")
async def startup_event():
    logger.info("Kashela API is starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Kashela API is shutting down...")
    cleanup()

@app.get("/")
def read_root():
    return {"message": "Kashela API is running"}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Kashela Backend",
        "timestamp": datetime.now().isoformat()
    }

# --- Import Routes ---
from routes import auth, transactions, payments

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])

# --- JWT Utils ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
JWT_SECRET = os.getenv("JWT_SECRET", "defaultsecret")
JWT_ALGORITHM = "HS256"

def get_current_user_from_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user_from_token)):
    return {"message": "You are authorized", "user": current_user}
