# app/core/config.py
import os
import secrets
from typing import List, Optional

from pydantic import BaseSettings, AnyHttpUrl


class Settings(BaseSettings):
    """Application settings"""
    
    # Project settings
    PROJECT_NAME: str = "UploadSoul Voice Service"
    API_V1_STR: str = "/api/v1"
    
    # CORS settings
    CORS_ORIGINS: List[AnyHttpUrl] = []
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    AUTH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Audio storage
    AUDIO_STORAGE_PATH: str = "/tmp/uploadsoul_audio"
    
    # Voice model settings
    VOICE_MODEL_PATH: str = "/tmp/uploadsoul_voice_models"
    
    # External services
    USE_AWS_POLLY: bool = False
    AWS_REGION: Optional[str] = None
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    
    # STT service
    STT_SERVICE: str = "local"  # local, google, azure
    
    # TTS service
    TTS_SERVICE: str = "local"  # local, aws_polly, azure
    
    class Config:
        case_sensitive = True
        env_file = ".env"


# Create settings instance
settings = Settings()

# Ensure necessary directories exist
os.makedirs(settings.AUDIO_STORAGE_PATH, exist_ok=True)
os.makedirs(settings.VOICE_MODEL_PATH, exist_ok=True)