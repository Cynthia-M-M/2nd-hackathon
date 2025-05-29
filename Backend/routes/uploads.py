from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import JSONResponse
import os
from datetime import datetime
from .auth import get_current_user_from_token, User
import shutil

router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-audio")
async def upload_audio(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user_from_token)
):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(400, "File must be an audio file")
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{current_user.id}_{timestamp}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, "audio", filename)
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(500, f"Failed to save audio file: {str(e)}")
    
    return JSONResponse({
        "message": "Audio uploaded successfully",
        "filename": filename
    })

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user_from_token)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{current_user.id}_{timestamp}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, "images", filename)
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(500, f"Failed to save image: {str(e)}")
    
    return JSONResponse({
        "message": "Image uploaded successfully",
        "filename": filename
    }) 