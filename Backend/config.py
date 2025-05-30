"""Configuration module for the Kashela API."""

from pydantic import BaseModel, Field
from typing import List
import os
from functools import lru_cache
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseModel):
    """Application settings and configuration."""
    
    # API Settings
    API_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server Settings
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://kashela.netlify.app"
    ]
    
    # Directory Settings
    STATIC_DIR: str = "static"
    UPLOAD_DIR: str = "uploads"
    LOGS_DIR: str = "logs"
    
    # M-PESA Settings
    MPESA_CONSUMER_KEY: str = os.getenv("MPESA_CONSUMER_KEY", "")
    MPESA_CONSUMER_SECRET: str = os.getenv("MPESA_CONSUMER_SECRET", "")
    MPESA_SHORTCODE: str = os.getenv("MPESA_SHORTCODE", "")
    MPESA_PASSKEY: str = os.getenv("MPESA_PASSKEY", "")
    
    # File Upload Settings
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/gif"]
    ALLOWED_AUDIO_TYPES: List[str] = ["audio/mpeg", "audio/wav", "audio/ogg"]

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

# Create instance
settings: Settings = get_settings()

# Create required directories
for directory in [
    settings.STATIC_DIR,
    settings.UPLOAD_DIR,
    os.path.join(settings.UPLOAD_DIR, "audio"),
    os.path.join(settings.UPLOAD_DIR, "images"),
    settings.LOGS_DIR
]:
    os.makedirs(directory, exist_ok=True) 