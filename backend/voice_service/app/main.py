# app/main.py
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.config import settings
from app.api.routes import api_router
from app.services.service_factory import ServiceFactory

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager to handle startup and shutdown events
    
    This handles initialization and cleanup of service components
    when the application starts and stops.
    """
    try:
        # Initialize the service manager at startup
        logger.info("Initializing service manager")
        service_manager = await ServiceFactory.create_voice_service()
        logger.info(f"Service manager initialized with active provider: {service_manager.get_active_service_name()}")
        
        yield
        
        # Clean up resources at shutdown
        logger.info("Shutting down service manager")
        await service_manager.stop()
        logger.info("Service manager stopped")
    except Exception as e:
        logger.exception(f"Error in application lifecycle: {e}")
        
        # Continue with yield even if startup has issues, so shutdown will still occur
        yield

# Create app with appropriate lifetime management
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for voice processing, transcription, and synthesis",
    version="1.0.0",
    lifespan=lifespan,
)

# Set up CORS
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=[str(method) for method in settings.CORS_ALLOW_METHODS],
        allow_headers=[str(header) for header in settings.CORS_ALLOW_HEADERS],
    )
    logger.info(f"CORS configured with origins: {settings.CORS_ORIGINS}")

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)
logger.info(f"API router registered with prefix: {settings.API_V1_STR}")

# Root endpoint for basic info about the service
@app.get("/", tags=["root"])
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs_url": "/docs",
    }

# Generic exception handler
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "details": str(exc) if settings.DEBUG else None,
        },
    )

# Log app startup
logger.info(f"Application {settings.PROJECT_NAME} initialized")