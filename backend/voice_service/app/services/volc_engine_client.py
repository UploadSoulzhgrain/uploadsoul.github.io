"""
volc_engine_client.py - VolcEngine voice service client
"""
import os
import json
import time
import asyncio
import httpx
from typing import Dict, Any, Optional

from app.config import settings
from app.services.voice_service import VoiceService, ServiceStatus, VoiceServiceResult


class VolcEngineConfig:
    """Configuration for VolcEngine client"""
    
    def __init__(
        self,
        api_key: str = None,
        base_url: str = None,
        tts_url: str = None,
        stt_url: str = None,
        timeout: int = 15,
        retry_attempts: int = 3
    ):
        self.api_key = api_key or os.getenv("VOLC_ENGINE_API_KEY", "")
        self.base_url = base_url or "https://open.volcengineapi.com"
        self.tts_url = tts_url or f"{self.base_url}/api/speech/tts"
        self.stt_url = stt_url or f"{self.base_url}/api/speech/recognize"
        self.timeout = timeout
        self.retry_attempts = retry_attempts


class VolcEngineClient(VoiceService):
    """VolcEngine implementation of VoiceService"""
    
    def __init__(self, config: Optional[VolcEngineConfig] = None):
        """Initialize with configuration"""
        self._config = config or VolcEngineConfig()
        self._client = None
        self._status = ServiceStatus.UNKNOWN
        self._last_status_check = 0
        self._status_cache_ttl = 60  # Cache status for 60 seconds
        
    @property
    def name(self) -> str:
        return "VolcEngine"
    
    async def initialize(self) -> bool:
        """Initialize HTTP client and validate configuration"""
        if not self._config.api_key:
            print("VolcEngine API key not configured")
            self._status = ServiceStatus.UNAVAILABLE
            return False
            
        try:
            # Create HTTP client with reasonable timeouts
            self._client = httpx.AsyncClient(
                timeout=self._config.timeout,
                headers={
                    "Authorization": f"Bearer {self._config.api_key}",
                    "Content-Type": "application/json"
                }
            )
            
            # Test connection
            status = await self.get_status()
            return status == ServiceStatus.AVAILABLE
        except Exception as e:
            print(f"VolcEngine client initialization error: {e}")
            self._status = ServiceStatus.UNAVAILABLE
            return False
            
    async def synthesize_voice(
        self, 
        text: str, 
        output_path: str,
        voice_id: str = None, 
        language: str = None,
        options: Dict[str, Any] = None
    ) -> VoiceServiceResult:
        """Convert text to speech using VolcEngine TTS"""
        if not self._client:
            await self.initialize()
            
        if not text:
            return VoiceServiceResult(
                success=False,
                error_message="Text cannot be empty",
                error_code="empty_text"
            )
            
        options = options or {}
        voice_id = voice_id or "zh_male_1"  # Default voice
        language = language or "zh-CN"
            
        # Prepare request payload
        payload = {
            "text": text,
            "voice_type": voice_id,
            "language": language,
            "sample_rate": options.get("sample_rate", 16000),
            "volume": options.get("volume", 100),  # 0-100
            "speed": options.get("speed", 1.0),    # 0.5-2.0
            "format": "wav"
        }
        
        for attempt in range(self._config.retry_attempts):
            try:
                # Make API request with retries
                response = await self._client.post(
                    self._config.tts_url,
                    json=payload
                )
                
                if response.status_code != 200:
                    print(f"VolcEngine TTS error: {response.status_code} {response.text}")
                    continue  # Try next attempt
                    
                # Parse response
                result = response.json()
                if not result.get("success", False):
                    return VoiceServiceResult(
                        success=False,
                        error_message=result.get("message", "TTS generation failed"),
                        error_code="api_error"
                    )
                    
                # Get audio data and save to file
                audio_data = result.get("audio_data", "")
                if not audio_data:
                    return VoiceServiceResult(
                        success=False,
                        error_message="No audio data received",
                        error_code="no_audio_data"
                    )
                    
                # For this example, we'll handle base64-encoded data (adapt if API provides different format)
                import base64
                audio_bytes = base64.b64decode(audio_data)
                
                # Ensure output directory exists
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                
                # Write audio to file
                with open(output_path, "wb") as f:
                    f.write(audio_bytes)
                    
                return VoiceServiceResult(success=True, data=output_path)
                
            except Exception as e:
                print(f"VolcEngine TTS attempt {attempt+1} failed: {e}")
                await asyncio.sleep(0.5)  # Small delay between retries
                
        # All attempts failed
        return VoiceServiceResult(
            success=False,
            error_message="Failed to generate speech after multiple attempts",
            error_code="max_retries_exceeded"
        )
            
    async def recognize_speech(
        self,
        audio_path: str,
        language: str = None,
        options: Dict[str, Any] = None
    ) -> VoiceServiceResult:
        """Convert speech to text using VolcEngine STT"""
        if not self._client:
            await self.initialize()
            
        if not os.path.exists(audio_path):
            return VoiceServiceResult(
                success=False,
                error_message=f"Audio file not found: {audio_path}",
                error_code="file_not_found"
            )
            
        options = options or {}
        language = language or "zh-CN"
            
        # Read audio file
        try:
            with open(audio_path, "rb") as f:
                audio_content = f.read()
        except Exception as e:
            return VoiceServiceResult(
                success=False,
                error_message=f"Failed to read audio file: {e}",
                error_code="file_read_error"
            )
        
        # Prepare multipart form data
        import base64
        audio_base64 = base64.b64encode(audio_content).decode("utf-8")
        
        # Prepare request payload
        payload = {
            "audio_data": audio_base64,
            "format": "wav",
            "language": language,
            "mode": options.get("mode", "general"),  # general, conversation, etc.
            "sample_rate": options.get("sample_rate", 16000)
        }
        
        for attempt in range(self._config.retry_attempts):
            try:
                # Make API request with retries
                response = await self._client.post(
                    self._config.stt_url,
                    json=payload
                )
                
                if response.status_code != 200:
                    print(f"VolcEngine STT error: {response.status_code} {response.text}")
                    continue  # Try next attempt
                    
                # Parse response
                result = response.json()
                if not result.get("success", False):
                    return VoiceServiceResult(
                        success=False,
                        error_message=result.get("message", "Speech recognition failed"),
                        error_code="api_error"
                    )
                    
                # Get transcription text
                text = result.get("text", "")
                if not text.strip():
                    return VoiceServiceResult(
                        success=False,
                        error_message="No transcription text received or empty result",
                        error_code="empty_transcription"
                    )
                    
                return VoiceServiceResult(success=True, data=text)
                
            except Exception as e:
                print(f"VolcEngine STT attempt {attempt+1} failed: {e}")
                await asyncio.sleep(0.5)  # Small delay between retries
                
        # All attempts failed
        return VoiceServiceResult(
            success=False,
            error_message="Failed to recognize speech after multiple attempts",
            error_code="max_retries_exceeded"
        )
    
    async def get_status(self) -> ServiceStatus:
        """Check VolcEngine service availability"""
        # Use cached status if recent
        if (time.time() - self._last_status_check) < self._status_cache_ttl:
            return self._status
            
        if not self._client:
            try:
                await self.initialize()
            except Exception:
                self._status = ServiceStatus.UNAVAILABLE
                self._last_status_check = time.time()
                return self._status
                
        # Since VolcEngine doesn't have a dedicated health endpoint,
        # we'll check if we can make a minimal request
        try:
            # Test with a minimal TTS request
            response = await self._client.get(
                f"{self._config.base_url}/api/status",
                timeout=5  # Short timeout for status check
            )
            
            if response.status_code == 200:
                self._status = ServiceStatus.AVAILABLE
            else:
                self._status = ServiceStatus.DEGRADED
                
        except httpx.TimeoutException:
            print("VolcEngine service timeout")
            self._status = ServiceStatus.DEGRADED
        except Exception as e:
            print(f"VolcEngine status check error: {e}")
            self._status = ServiceStatus.UNAVAILABLE
            
        self._last_status_check = time.time()
        return self._status