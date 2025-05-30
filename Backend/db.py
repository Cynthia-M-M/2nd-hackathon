from supabase import create_client, Client
import os
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)

@lru_cache()
def get_supabase() -> Client:
    """Get cached Supabase client instance"""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        logger.warning("Supabase credentials not found!")
        return None
    return create_client(url, key) 