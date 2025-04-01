# service_factory.py
import logging
import asyncio
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager

from app.config import settings, VoiceServiceProviderType
from app.services.stt_service import SpeechToTextService
from app.services.tts_service import TextToSpeechService
from app.services.google_stt_service import GoogleSTTService
from app.services.service_adapter import ServiceAdapter

# Configure logging
logger = logging.getLogger(__name__)

# Global service instances
_service_manager = None
_service_manager_lock = asyncio.Lock()

class ServiceManager:
    """
    Central service manager that provides access to all voice service components
    
    This class maintains global service instances and implements the service
    discovery and lifecycle management.
    """
    
    def __init__(self):
        """Initialize the service manager"""
        self.stt_adapter = None
        self.tts_adapter = None
        self.started = False
        
    async def start(self):
        """Start all service components"""
        if self.started:
            return
            
        logger.info("Starting service manager")
        
        # Create and initialize STT adapter
        self.stt_adapter = ServiceAdapter(
            primary_provider=settings.STT_PROVIDER,
            failover_providers=settings.get_failover_services(),
            failover_strategy=settings.FAILOVER_STRATEGY,
            auto_restore=settings.AUTO_RESTORE_PRIMARY
        )
        await self.stt_adapter.start()
        
        # TTS adapter would be initialized here similarly
        
        self.started = True
        logger.info("Service manager started")
        
    async def stop(self):
        """Stop all service components"""
        if not self.started:
            return
            
        logger.info("Stopping service manager")
        
        if self.stt_adapter:
            await self.stt_adapter.stop()
            
        # Stop TTS adapter here
        
        self.started = False
        logger.info("Service manager stopped")
        
    def get_status(self) -> Dict[str, Any]:
        """Get status of all service components"""
        result = {
            "overall_status": "healthy",
            "services": {}
        }
        
        # Add STT status
        if self.stt_adapter:
            stt_status = self.stt_adapter.get_provider_status()
            active_provider = self.stt_adapter.get_active_provider()
            
            is_healthy = any(
                info["status"] == "healthy" 
                for provider, info in stt_status.items()
            )
            
            result["services"]["stt"] = {
                "status": "healthy" if is_healthy else "degraded",
                "active_provider": active_provider,
                "providers": stt_status
            }
            
            if not is_healthy:
                result["overall_status"] = "degraded"
        else:
            result["services"]["stt"] = {"status": "unavailable"}
            result["overall_status"] = "degraded"
            
        # TTS status would be added here
        
        return result
    
    def get_active_service_name(self) -> str:
        """Get name of the active STT service"""
        if self.stt_adapter:
            return self.stt_adapter.get_active_provider()
        return "unknown"
        
    async def transcribe(self, audio_path: str, language: str = None) -> Dict[str, Any]:
        """Transcribe audio to text using the active STT service"""
        if not self.stt_adapter:
            return {"success": False, "error": "STT service not initialized"}
            
        result = await self.stt_adapter.transcribe(audio_path, language)
        return result.to_dict() if hasattr(result, "to_dict") else result
        
    async def recognize_speech(self, audio_path: str, language: str = None) -> VoiceServiceResult:
        """Recognize speech from audio file
        
        This is an alias for transcribe that returns a VoiceServiceResult
        """
        try:
            result = await self.transcribe(audio_path, language)
            
            if result.get("success"):
                return VoiceServiceResult.success_result(
                    data=result.get("text", ""),
                    provider=result.get("provider"),
                    additional_info=result
                )
            else:
                error_info = result.get("error", {})
                message = error_info.get("message", "Unknown error")
                error_type = error_info.get("type", "unknown")
                return VoiceServiceResult.error_result(
                    message=message, 
                    error_type=error_type, 
                    provider=result.get("provider")
                )
        except Exception as e:
            logger.exception("Error recognizing speech")
            return VoiceServiceResult.error_result(
                message=str(e),
                error_type="exception"
            )
    
    async def synthesize_voice(self, text: str, output_path: str, language: str = None, voice_id: str = None) -> VoiceServiceResult:
        """Synthesize voice from text
        
        This is a placeholder that would typically call the TTS adapter
        """
        try:
            # This is a temporary implementation until we add proper TTS adapter
            from edge_tts import Communicate
            
            voice = voice_id or settings.TTS_DEFAULT_VOICE
            language = language or settings.TTS_DEFAULT_LANGUAGE
            
            # Use edge-tts directly
            communicate = Communicate(text, voice)
            await communicate.save(output_path)
            
            return VoiceServiceResult.success_result(
                data=output_path,
                provider="edge_tts"
            )
        except Exception as e:
            logger.exception("Error synthesizing voice")
            return VoiceServiceResult.error_result(
                message=str(e),
                error_type="tts_error"
            )


class ServiceFactory:
    """Factory class for creating service instances"""
    
    @staticmethod
    async def create_voice_service() -> ServiceManager:
        """Create or get the global service manager instance"""
        global _service_manager
        
        async with _service_manager_lock:
            if _service_manager is None:
                _service_manager = ServiceManager()
                await _service_manager.start()
                
        return _service_manager
        
    @staticmethod
    async def create_stt_service(provider: str = None) -> SpeechToTextService:
        """Create speech-to-text service instance"""
        provider = provider or settings.STT_PROVIDER
        
        if provider == "google":
            return GoogleSTTService()
        else:
            raise ValueError(f"Unsupported STT provider: {provider}")
            
    @staticmethod
    async def create_tts_service(provider: str = None) -> TextToSpeechService:
        """Create text-to-speech service instance"""
        provider = provider or settings.TTS_PROVIDER
        
        # TTS service creation would be implemented here
        raise NotImplementedError(f"TTS provider not implemented: {provider}")


# Dependency function for FastAPI
async def get_service_manager() -> ServiceManager:
    """Get the global service manager instance"""
    return await ServiceFactory.create_voice_service()