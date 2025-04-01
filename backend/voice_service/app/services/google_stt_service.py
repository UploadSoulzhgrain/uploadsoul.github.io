# app/services/google_stt_service.py
import os
import logging
import asyncio
import time
from typing import Dict, Any, Optional, List
from pathlib import Path
import tempfile
import json

try:
    from google.cloud import speech
    from google.cloud.speech import SpeechClient, RecognitionAudio, RecognitionConfig
    from google.api_core.exceptions import GoogleAPIError, RetryError, InvalidArgument
    GOOGLE_AVAILABLE = True
except ImportError:
    GOOGLE_AVAILABLE = False

from app.config import settings
from app.services.stt_service import SpeechToTextService, SpeechToTextResult

# Configure logging
logger = logging.getLogger(__name__)

class GoogleSTTService(SpeechToTextService):
    """
    Google Cloud Speech-to-Text service implementation with enhanced transcription capabilities
    
    This service provides automatic audio preprocessing, diagnostic information about audio quality,
    adaptive retry strategies, and detailed error reporting.
    """
    
    def __init__(self):
        """Initialize the Google STT service"""
        super().__init__()
        self.provider = "google"
        self.client = None
        self.last_connection_check = 0
        self.connection_check_interval = 300  # 5 minutes
        self.is_available = GOOGLE_AVAILABLE
        
        # Enhanced parameters
        self.enhance_audio = settings.STT_ENHANCE_AUDIO if hasattr(settings, "STT_ENHANCE_AUDIO") else True
        self.max_retries = int(settings.STT_MAX_RETRIES) if hasattr(settings, "STT_MAX_RETRIES") else 2
        self.timeout = int(settings.STT_TIMEOUT) if hasattr(settings, "STT_TIMEOUT") else 15
        
        # Initialize client
        self._init_client()
    
    def _init_client(self):
        """Initialize the Google Speech client"""
        if not GOOGLE_AVAILABLE:
            logger.error("Google Cloud Speech library not available")
            return
            
        try:
            self.client = speech.SpeechClient()
            logger.info("Google Speech client initialized")
        except Exception as e:
            logger.error(f"Error initializing Google Speech client: {e}")
            self.is_available = False
    
    async def test_connection(self) -> bool:
        """
        Test if the Google Speech service is available
        
        Returns:
            bool: True if service is available, False otherwise
        """
        # Check if we've tested recently
        current_time = time.time()
        if current_time - self.last_connection_check < self.connection_check_interval:
            return self.is_available
        
        if not GOOGLE_AVAILABLE or not self.client:
            self.is_available = False
            self.last_connection_check = current_time
            return False
            
        try:
            # Create a minimal request to test
            logger.info("Testing connection to Google Speech API")
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code="en-US",
            )
            
            # Create a very short audio content
            audio = speech.RecognitionAudio(content=b'\x00' * 100)
            
            # Use a short timeout for the test
            self.client.recognize(config=config, audio=audio, timeout=3)
            
            self.is_available = True
            logger.info("Google Speech API connection test successful")
        except Exception as e:
            logger.error(f"Google Speech API connection test failed: {e}")
            self.is_available = False
            
        self.last_connection_check = current_time
        return self.is_available
    
    async def transcribe(self, audio_path: str, language: str = None) -> SpeechToTextResult:
        """
        Convert speech to text using Google Speech-to-Text
        
        Args:
            audio_path: Path to the audio file
            language: Language code (e.g., 'en-US', 'zh-CN')
            
        Returns:
            SpeechToTextResult containing transcription or error details
        """
        if not GOOGLE_AVAILABLE or not self.client:
            return SpeechToTextResult.failure(
                error_message="Google Cloud Speech library not available",
                error_type="dependency_error",
                provider=self.provider
            )
            
        language = language or settings.STT_DEFAULT_LANGUAGE
        start_time = time.time()
            
        try:
            # Analyze audio quality
            audio_quality = await self._analyze_audio_file(audio_path)
            has_issues = len(audio_quality.get("issues", [])) > 0
            
            # Preprocess audio if needed
            if self.enhance_audio and has_issues:
                logger.info(f"Audio has quality issues: {audio_quality.get('issues')}. Preprocessing...")
                processed_path = await self._preprocess_audio(audio_path, audio_quality)
                if processed_path:
                    logger.info(f"Using preprocessed audio: {processed_path}")
                    audio_path = processed_path
            
            # Primary transcription attempt
            result = await self._perform_transcription(audio_path, language)
            
            # If transcription failed or has low confidence, retry with different settings
            if not result.success or (result.confidence and result.confidence < 0.6):
                if not result.success:
                    logger.warning(f"Initial transcription failed: {result.error_message}")
                else:
                    logger.warning(f"Low confidence transcription: {result.confidence}")
                    
                if self.max_retries > 0:
                    result = await self._retry_transcription(audio_path, language, result)
            
            # Calculate processing time
            processing_time = time.time() - start_time
            
            # Add audio quality info to result
            if result.success:
                result.audio_quality = audio_quality
                result.processing_time = processing_time
                
            return result
            
        except Exception as e:
            logger.exception(f"Error in Google STT transcription: {e}")
            return SpeechToTextResult.failure(
                error_message=f"Google transcription error: {str(e)}",
                error_type="exception",
                provider=self.provider
            )
    
    async def _perform_transcription(self, audio_path: str, language: str) -> SpeechToTextResult:
        """
        Perform transcription with Google STT
        
        Args:
            audio_path: Path to audio file
            language: Language code
            
        Returns:
            SpeechToTextResult
        """
        try:
            # Read audio file
            with open(audio_path, "rb") as audio_file:
                content = audio_file.read()
            
            # Configure recognition
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,  # We assume 16kHz for now
                language_code=language,
                model="default",
                enable_automatic_punctuation=True,
                enable_speaker_diarization=False,
                max_alternatives=1,
                profanity_filter=False,
                use_enhanced=True
            )
            
            audio = speech.RecognitionAudio(content=content)
            
            # Make request
            logger.info(f"Sending transcription request to Google for language: {language}")
            response = self.client.recognize(config=config, audio=audio, timeout=self.timeout)
            
            # Process results
            if not response.results or len(response.results) == 0:
                return SpeechToTextResult.failure(
                    error_message="No speech detected",
                    error_type="silence",
                    provider=self.provider
                )
            
            # Get best result
            result = response.results[0]
            if not result.alternatives or len(result.alternatives) == 0:
                return SpeechToTextResult.failure(
                    error_message="No transcription alternatives",
                    error_type="no_alternatives",
                    provider=self.provider
                )
                
            best_alternative = result.alternatives[0]
            text = best_alternative.transcript.strip()
            confidence = best_alternative.confidence
            
            # Get alternatives
            alternatives = []
            if len(result.alternatives) > 1:
                alternatives = [alt.transcript.strip() for alt in result.alternatives[1:]]
            
            # Return success result
            return SpeechToTextResult.success(
                text=text,
                confidence=confidence,
                provider=self.provider,
                alternatives=alternatives
            )
            
        except GoogleAPIError as gae:
            logger.error(f"Google API error: {gae}")
            return SpeechToTextResult.failure(
                error_message=f"Google API error: {str(gae)}",
                error_type="api_error",
                provider=self.provider
            )
        except InvalidArgument as ia:
            logger.error(f"Invalid argument: {ia}")
            return SpeechToTextResult.failure(
                error_message=f"Invalid audio format or configuration: {str(ia)}",
                error_type="format",
                provider=self.provider
            )
        except Exception as e:
            logger.exception(f"Transcription error: {e}")
            return SpeechToTextResult.failure(
                error_message=f"Transcription error: {str(e)}",
                error_type="exception",
                provider=self.provider
            )
    
    async def _retry_transcription(self, audio_path: str, language: str, initial_result: SpeechToTextResult) -> SpeechToTextResult:
        """
        Retry transcription with different settings
        
        Args:
            audio_path: Path to audio file
            language: Language code
            initial_result: Result from first attempt
            
        Returns:
            SpeechToTextResult
        """
        logger.info("Retrying transcription with different settings")
        best_result = initial_result
        
        # Define retry strategies
        strategies = [
            {"model": "phone_call"},  # Try phone call model
            {"sample_rate_hertz": 8000},  # Try different sample rate
            {"use_enhanced": False}  # Try without enhancement
        ]
        
        # Limit retries based on settings
        actual_retries = min(self.max_retries, len(strategies))
        
        for i in range(actual_retries):
            try:
                strategy = strategies[i]
                logger.info(f"Retry {i+1}/{actual_retries} with strategy: {strategy}")
                
                # Read audio file
                with open(audio_path, "rb") as audio_file:
                    content = audio_file.read()
                
                # Configure recognition with strategy modifications
                config_kwargs = {
                    "encoding": speech.RecognitionConfig.AudioEncoding.LINEAR16,
                    "sample_rate_hertz": strategy.get("sample_rate_hertz", 16000),
                    "language_code": language,
                    "model": strategy.get("model", "default"),
                    "enable_automatic_punctuation": True,
                    "max_alternatives": 1,
                    "use_enhanced": strategy.get("use_enhanced", True)
                }
                
                config = speech.RecognitionConfig(**config_kwargs)
                audio = speech.RecognitionAudio(content=content)
                
                # Make request with timeout
                response = self.client.recognize(config=config, audio=audio, timeout=self.timeout)
                
                # Process results
                if response.results and len(response.results) > 0:
                    result = response.results[0]
                    if result.alternatives and len(result.alternatives) > 0:
                        best_alternative = result.alternatives[0]
                        text = best_alternative.transcript.strip()
                        confidence = best_alternative.confidence
                        
                        # If this is better than previous results
                        if not best_result.success or (confidence and (not best_result.confidence or confidence > best_result.confidence)):
                            alternatives = []
                            if len(result.alternatives) > 1:
                                alternatives = [alt.transcript.strip() for alt in result.alternatives[1:]]
                                
                            best_result = SpeechToTextResult.success(
                                text=text,
                                confidence=confidence,
                                provider=f"{self.provider}_retry_{i+1}",
                                alternatives=alternatives
                            )
                            
                            logger.info(f"Better result found with confidence: {confidence}")
                
            except Exception as e:
                logger.error(f"Retry {i+1} failed: {e}")
        
        return best_result
    
    async def _preprocess_audio(self, audio_path: str, quality_info: Dict[str, Any]) -> Optional[str]:
        """
        Preprocess audio file to improve transcription
        
        Args:
            audio_path: Path to audio file
            quality_info: Audio quality information
            
        Returns:
            Path to preprocessed file or None if preprocessing failed
        """
        try:
            from pydub import AudioSegment
            import numpy as np
            
            logger.info(f"Preprocessing audio: {audio_path}")
            
            # Load audio file
            audio = AudioSegment.from_file(audio_path)
            issues = quality_info.get("issues", [])
            
            # Apply appropriate preprocessing based on issues
            if "low_volume" in issues:
                logger.info("Applying volume normalization")
                # Normalize volume
                audio = audio.normalize()
                
            if "possible_clipping" in issues:
                logger.info("Applying compression to fix clipping")
                # Apply compression to reduce clipping
                audio = audio.compress_dynamic_range()
                
            # Filter out noise if needed
            if "noise" in issues:
                logger.info("Applying noise reduction")
                # Basic noise reduction by removing very low frequencies
                audio = audio.high_pass_filter(80)
            
            # Convert to proper format for Google STT (WAV, 16kHz, 16-bit)
            audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
            
            # Save preprocessed audio to temporary file
            fd, tmp_path = tempfile.mkstemp(suffix=".wav")
            os.close(fd)
            
            audio.export(tmp_path, format="wav")
            logger.info(f"Preprocessed audio saved to: {tmp_path}")
            
            return tmp_path
            
        except Exception as e:
            logger.error(f"Error preprocessing audio: {e}")
            return None