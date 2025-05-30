from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
from logging_config import get_logger
from config import settings

# Configure logging
logger = get_logger("main")

# FastAPI App Init
app = FastAPI(
    title="Kashela API",
    description="Financial Management API for Kashela",
    version=settings.API_VERSION,
    debug=settings.DEBUG
)

# Mount static files
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/favicon.ico")
async def favicon():
    """Serve favicon"""
    path = os.path.join(settings.STATIC_DIR, "favicon.ico")
    if not os.path.exists(path):
        logger.warning("Favicon not found at path: %s", path)
        raise HTTPException(status_code=404, detail="Favicon not found")
    return FileResponse(path)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import Routes
from routes import auth, payments, uploads  # noqa: E402

# Mount Routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])
app.include_router(uploads.router, prefix="/uploads", tags=["uploads"])

@app.get("/")
async def read_root():
    """Root endpoint"""
    logger.info("Root endpoint accessed")
    return {
        "message": "Kashela API is running",
        "docs_url": "/docs",
        "version": settings.API_VERSION
    }

@app.on_event("startup")
async def startup_event():
    """Application startup event handler"""
    logger.info("✅ Starting Kashela API...")
    logger.info(f"✅ Version: {settings.API_VERSION}")
    logger.info(f"✅ Debug mode: {settings.DEBUG}")
    logger.info("✅ Static files mounted")
    logger.info("✅ CORS configured")
    logger.info("✅ Routes mounted")
    logger.info("✅ Startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event handler"""
    logger.info("Kashela API is shutting down...") 