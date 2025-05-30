"""
Routes package for Kashela API
"""

from . import auth
from . import payments
from . import uploads
import logging

# Configure route-specific logging
logger = logging.getLogger(__name__)

__all__ = ["auth", "payments", "uploads"]
