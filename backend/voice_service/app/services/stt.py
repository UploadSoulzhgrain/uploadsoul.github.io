# app/services/stt.py
import logging
import os
import tempfile
from typing import Optional

import speech_recognition as sr
from pydub import AudioSegment

from app.core.config import settings

logger = logging.getLogger("voice_service.services.stt")

class STTService:
    """
    Speech-to-Text Service
    Supports multiple STT providers with fallback mechanisms
    """
    
    async def transcribe(self, audio_path: str, language: str = "en-US") -> str:
        """
        Transcribe audio to text
        
        Args:
            audio_path: Path to audio file
            language: Language code
            
        Returns:
            Transcribed text
        """
        try:
            method = settings.STT_SERVICE
            
            if method == "google":
                return await self._transcribe_google(audio_path, language)
            elif method == "azure":
                return await self._transcribe_azure(audio_path, language)
            else:
                return await self._transcribe_local(audio_path, language)
        except Exception as e:
            logger.error(f"STT transcription failed: {str(e)}", exc_info=True)
            # Fallback to local transcription if other methods fail
            try:
                return await self._transcribe_local(audio_path, language)
            except Exception:
                return ""
    
    async def _transcribe_local(self, audio_path: str, language: str) -> str:
        """Transcribe using local speech recognition"""
        try:
            # Convert from any format to WAV for compatibility
            audio = AudioSegment.from_file(audio_path)
            
            # Save as temporary WAV file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_wav:
                wav_path = temp_wav.name
                audio.export(wav_path, format="wav")
            
            recognizer = sr.Recognizer()
            with sr.AudioFile(wav_path) as source:
                audio_data = recognizer.record(source)
                
                text = recognizer.recognize_google(
                    audio_data,
                    language=language
                )
            
            # Clean up temp file
            os.unlink(wav_path)
            
            return text
        except sr.UnknownValueError:
            logger.warning("Speech recognition could not understand audio")
            return ""
        except sr.RequestError as e:
            logger.error(f"Google STT service error: {str(e)}")
            return ""
        except Exception as e:
            logger.error(f"Error in local transcription: {str(e)}", exc_info=True)
            return ""
    
    async def _transcribe_google(self, audio_path: str, language: str) -> str:
        """Transcribe using Google Cloud Speech-to-Text API"""
        # This would be implemented with Google Cloud Speech-to-Text API in production
        # For this demo, we'll use the free recognize_google method
        return await self._transcribe_local(audio_path, language)
    
    async def _transcribe_azure(self, audio_path: str, language: str) -> str:
        """Transcribe using Azure Speech Services"""
        # This would be implemented with Azure Speech SDK in production
        # For this demo, we'll fallback to local transcription
        return await self._transcribe_local(audio_path, language)