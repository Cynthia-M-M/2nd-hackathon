from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import os
import logging
from typing import List
from datetime import datetime
from .auth import get_current_user, TokenData
import shutil

# Configure route-specific logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Create upload directories
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(os.path.join(UPLOAD_DIR, "audio"), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_DIR, "images"), exist_ok=True)

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"]
ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg"]

def save_upload_file(upload_file: UploadFile, file_type: str, username: str) -> str:
    try:
        # Create timestamp-based filename with username
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{username}_{timestamp}_{upload_file.filename}"
        
        # Determine directory based on file type
        if file_type == "image":
            save_dir = os.path.join(UPLOAD_DIR, "images")
        else:
            save_dir = os.path.join(UPLOAD_DIR, "audio")
            
        # Ensure directory exists
        os.makedirs(save_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(save_dir, filename)
        with open(file_path, "wb") as buffer:
            content = upload_file.file.read()
            buffer.write(content)
            
        return filename
    except Exception as e:
        logger.error(f"File upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save file")

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: TokenData = Depends(get_current_user)
):
    try:
        logger.info(f"Receiving image upload from user {current_user.sub}: {file.filename}")
        
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            logger.warning(f"Invalid image type attempted by user {current_user.sub}: {file.content_type}")
            raise HTTPException(status_code=400, detail="Invalid image type")
        
        filename = save_upload_file(file, "image", current_user.sub)
        logger.info(f"Image saved successfully for user {current_user.sub}: {filename}")
        
        return {
            "message": "Image uploaded successfully",
            "filename": filename
        }
    except Exception as e:
        logger.error(f"Image upload error for user {current_user.sub}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload image")

@router.post("/audio")
async def upload_audio(
    file: UploadFile = File(...),
    current_user: TokenData = Depends(get_current_user)
):
    try:
        logger.info(f"Receiving audio upload from user {current_user.sub}: {file.filename}")
        
        if file.content_type not in ALLOWED_AUDIO_TYPES:
            logger.warning(f"Invalid audio type attempted by user {current_user.sub}: {file.content_type}")
            raise HTTPException(status_code=400, detail="Invalid audio type")
        
        filename = save_upload_file(file, "audio", current_user.sub)
        logger.info(f"Audio saved successfully for user {current_user.sub}: {filename}")
        
        return {
            "message": "Audio uploaded successfully",
            "filename": filename
        }
    except Exception as e:
        logger.error(f"Audio upload error for user {current_user.sub}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload audio")

@router.get("/files/{file_type}/{filename}")
async def get_file(
    file_type: str,
    filename: str,
    current_user: TokenData = Depends(get_current_user)
):
    try:
        if file_type not in ["audio", "images"]:
            raise HTTPException(400, "Invalid file type")
            
        file_path = os.path.join(UPLOAD_DIR, file_type, filename)
        
        # Security check: ensure the file belongs to the user
        if not filename.startswith(f"{current_user.sub}_"):
            logger.warning(f"Unauthorized file access attempt by user {current_user.sub}: {filename}")
            raise HTTPException(403, "Access denied")
            
        if not os.path.exists(file_path):
            logger.warning(f"File not found for user {current_user.sub}: {filename}")
            raise HTTPException(404, "File not found")
            
        logger.info(f"File accessed by user {current_user.sub}: {filename}")
        return FileResponse(file_path)
    except Exception as e:
        logger.error(f"File access error for user {current_user.sub}: {str(e)}")
        raise HTTPException(500, "Failed to access file") 