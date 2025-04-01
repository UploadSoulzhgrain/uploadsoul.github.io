# app/services/tts.py
import logging
import os
import tempfile
import uuid
from typing import Optional

import httpx
from gtts import gTTS

from app.core.config import settings

logger = logging.getLogger("voice_service.services.tts")

class TTSService:
    """
    Text-to-Speech Service
    Supports multiple TTS providers with fallback mechanisms
    """
    
    async def synthesize(
        self,
        text: str,
        language: str = "en-US",
        voice_model = None,  # VoiceModelResponse object
        speed: float = 1.0,
        pitch: float = 1.0,
    ) -> str:
        """
        Synthesize text to speech
        
        Args:
            text: Text to synthesize
            language: Language code
            voice_model: Optional voice model to use
            speed: Speech rate (0.5-2.0)
            pitch: Voice pitch (0.5-2.0)
            
        Returns:
            Path to generated audio file
        """
        try:
            method = settings.TTS_SERVICE
            
            if voice_model and method == "aws_polly":
                # If we have a voice model and AWS Polly is configured, use it
                return await self._synthesize_aws_polly(
                    text, language, voice_model, speed, pitch
                )
            elif method == "azure":
                # Use Azure TTS if configured
                return await self._synthesize_azure(text, language, speed, pitch)
            else:
                # Default fallback to gTTS
                return await self._synthesize_gtts(text, language)
        except Exception as e:
            logger.error(f"TTS synthesis failed: {str(e)}", exc_info=True)
            # Fallback to gTTS if other methods fail
            return await self._synthesize_gtts(text, language)
    
    async def _synthesize_gtts(self, text: str, language: str) -> str:
        """Synthesize using Google Text-to-Speech"""
        try:
            # Map language code to gTTS format if needed
            lang = language.split("-")[0]  # e.g., "en-US" -> "en"
            
            # Generate unique filename
            filename = f"{uuid.uuid4()}.mp3"
            output_path = os.path.join(settings.AUDIO_STORAGE_PATH, filename)
            
            # Use gTTS to create MP3 file
            tts = gTTS(text=text, lang=lang, slow=False)
            tts.save(output_path)
            
            return output_path
        except Exception as e:
            logger.error(f"gTTS synthesis failed: {str(e)}", exc_info=True)
            # Create empty audio file as a last resort
            temp_file = os.path.join(settings.AUDIO_STORAGE_PATH, f"{uuid.uuid4()}.mp3")
            with open(temp_file, "wb") as f:
                f.write(b"")
            return temp_file
    
    async def _synthesize_aws_polly(
        self, 
        text: str, 
        language: str, 
        voice_model, 
        speed: float, 
        pitch: float
    ) -> str:
        """Synthesize using AWS Polly with voice model"""
        try:
            if not settings.USE_AWS_POLLY or not settings.AWS_ACCESS_KEY_ID:
                raise ValueError("AWS Polly not configured")
            
            import boto3
            
            # Initialize Polly client
            polly_client = boto3.client(
                'polly',
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
            )
            
            # Map language to voice
            voice_id = self._get_polly_voice_for_language(language)
            
            # Generate SSML with voice options
            ssml = self._generate_ssml(text, speed, pitch)
            
            # Request speech synthesis
            response = polly_client.synthesize_speech(
                Text=ssml,
                TextType='ssml',
                OutputFormat='mp3',
                VoiceId=voice_id
            )
            
            # Save to file
            filename = f"{uuid.uuid4()}.mp3"
            output_path = os.path.join(settings.AUDIO_STORAGE_PATH, filename)
            
            with open(output_path, 'wb') as f:
                f.write(response['AudioStream'].read())
            
            return output_path
        
        except Exception as e:
            logger.error(f"AWS Polly synthesis failed: {str(e)}", exc_info=True)
            # Fallback to gTTS
            return await self._synthesize_gtts(text, language)
    
    async def _synthesize_azure(
        self, 
        text: str, 
        language: str, 
        speed: float, 
        pitch: float
    ) -> str:
        """Synthesize using Azure TTS"""
        # This would be implemented with Azure Speech SDK in production
        # For this demo, we'll fallback to gTTS
        return await self._synthesize_gtts(text, language)
    
    def _get_polly_voice_for_language(self, language: str) -> str:
        """Map language codes to AWS Polly voices"""
        language_voice_map = {
            "en-US": "Matthew",
            "en-GB": "Amy",
            "zh-CN": "Zhiyu",
            "zh-TW": "Zhiyu",  # Use Zhiyu for Traditional Chinese too
            "ja-JP": "Takumi",
            "ko-KR": "Seoyeon",
        }
        
        return language_voice_map.get(language, "Matthew")  # Default to Matthew
    
    def _generate_ssml(self, text: str, speed: float, pitch: float) -> str:
        """Generate SSML for more control over speech synthesis"""
        rate = "medium"
        if speed < 0.8:
            rate = "slow"
        elif speed > 1.2:
            rate = "fast"
        
        pitch_value = "+0%"
        if pitch < 0.9:
            pitch_value = "-10%"
        elif pitch > 1.1:
            pitch_value = "+10%"
        
        ssml = f"""
        <speak>
            <prosody rate="{rate}" pitch="{pitch_value}">
                {text}
            </prosody>
        </speak>
        """
        
        return ssml