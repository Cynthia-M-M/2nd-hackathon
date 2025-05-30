"""Logging configuration for the Kashela API."""

import logging
import logging.handlers
import os
from datetime import datetime
from typing import Optional

def setup_logging() -> None:
    """Set up logging configuration for the application."""
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)

    # Generate log filename with timestamp
    log_filename = f"logs/kashela_{datetime.now().strftime('%Y%m%d')}.log"

    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            # File handler with rotation
            logging.handlers.RotatingFileHandler(
                log_filename,
                maxBytes=10485760,  # 10MB
                backupCount=5,
                encoding='utf-8'
            ),
            # Console handler
            logging.StreamHandler()
        ]
    )

    # Set logging levels for different components
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("fastapi").setLevel(logging.INFO)

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance for a specific component.
    
    Args:
        name: The name of the component requesting the logger
        
    Returns:
        logging.Logger: A configured logger instance
    """
    return logging.getLogger(f"kashela.{name}")

# Initialize logging on module import
setup_logging() 