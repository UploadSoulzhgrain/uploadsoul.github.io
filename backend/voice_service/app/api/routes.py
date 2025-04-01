# app/api/routes.py
import logging
from fastapi import APIRouter

from app.api.voice_chat import router as voice_chat_router
from app.api.endpoints.status import router as status_router

# Configure logging
logger = logging.getLogger(__name__)

# Create main API router
api_router = APIRouter()

# Include routers from different modules
api_router.include_router(voice_chat_router, prefix="/voice", tags=["voice"])
api_router.include_router(status_router, prefix="/status", tags=["status"])

# Register health check at the root level for easy access
from app.api.endpoints.status import health_check
api_router.add_api_route("/health", health_check, methods=["GET"], tags=["health"])

logger.info("API routes registered")