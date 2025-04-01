# app/config.py
import os
from enum import Enum
from typing import List, Dict, Optional, Any

from starlette.datastructures import CommaSeparatedStrings
from pydantic_settings import BaseSettings

class VoiceServiceProviderType(str, Enum):
    """Voice service provider types"""
    GOOGLE = "google"
    AZURE = "azure"
    WHISPER = "whisper"
    EDGE_TTS = "edge_tts"
    VOLC_ENGINE = "volc_engine"
    CUSTOM = "custom"

class FailoverStrategyType(str, Enum):
    """Failover strategies"""
    NONE = "none"  # Disable failover
    ORDERED = "ordered"  # Try providers in order of preference
    AVAILABILITY = "availability"  # Try any available provider
    QUALITY = "quality"  # Try providers based on quality metrics

class Settings(BaseSettings):
    """Voice service settings"""
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Voice Service API"
    DEBUG: bool = False
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Storage settings
    STORAGE_DIR: str = "storage"
    
    # Speech-to-Text settings
    STT_PROVIDER: str = "google"
    STT_DEFAULT_LANGUAGE: str = "zh-CN"
    STT_ENHANCE_AUDIO: bool = True
    STT_MAX_RETRIES: int = 2
    STT_TIMEOUT: int = 15
    
    # Text-to-Speech settings
    TTS_PROVIDER: str = "edge_tts"
    TTS_DEFAULT_LANGUAGE: str = "zh-CN"
    TTS_DEFAULT_VOICE: str = "zh-CN-XiaoxiaoNeural"
    
    # Google Speech API settings
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None
    
    # Azure Speech API settings
    AZURE_SPEECH_KEY: Optional[str] = None
    AZURE_SPEECH_REGION: str = "eastasia"
    
    # Edge TTS settings
    EDGE_TTS_VOICE: str = "zh-CN-XiaoxiaoNeural"
    
    # VolcEngine API settings
    VOLC_ENGINE_ACCESS_KEY: Optional[str] = None
    VOLC_ENGINE_SECRET_KEY: Optional[str] = None
    VOLC_ENGINE_APP_ID: Optional[str] = None
    
    # Service Adapter settings
    PRIMARY_VOICE_SERVICE: str = "google"
    FAILOVER_SERVICES: str = ""
    FAILOVER_STRATEGY: FailoverStrategyType = FailoverStrategyType.AVAILABILITY
    AUTO_RESTORE_PRIMARY: bool = True
    HEALTH_CHECK_INTERVAL: int = 300
    
    # Additional settings
    LOG_LEVEL: str = "INFO"
    
    def get_failover_services(self) -> List[str]:
        """Get list of failover services"""
        if not self.FAILOVER_SERVICES:
            return []
        return [s.strip() for s in self.FAILOVER_SERVICES.split(",") if s.strip()]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Set Google credentials environment variable if provided
if settings.GOOGLE_APPLICATION_CREDENTIALS:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS