# app/services/stt_service.py
import os
import logging
import asyncio
import time
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from abc import ABC, abstractmethod

# Configure logging
logger = logging.getLogger(__name__)

@dataclass
class SpeechToTextResult:
    """
    Result of a speech-to-text operation
    
    This standardized result format is used by all STT service implementations.
    """
    success: bool
    text: Optional[str] = None
    confidence: Optional[float] = None
    error_message: Optional[str] = None
    error_type: Optional[str] = None
    provider: Optional[str] = None
    processing_time: Optional[float] = None
    audio_quality: Optional[Dict[str, Any]] = None
    alternatives: List[str] = field(default_factory=list)
    
    @classmethod
    def success(cls, text: str, confidence: float = None, provider: str = None, 
               alternatives: List[str] = None, processing_time: float = None, 
               audio_quality: Dict[str, Any] = None) -> 'SpeechToTextResult':
        """Factory method to create a successful result"""
        return cls(
            success=True,
            text=text,
            confidence=confidence,
            provider=provider,
            alternatives=alternatives or [],
            processing_time=processing_time,
            audio_quality=audio_quality
        )
    
    @classmethod
    def failure(cls, error_message: str, error_type: str = None, provider: str = None) -> 'SpeechToTextResult':
        """Factory method to create a failure result"""
        return cls(
            success=False,
            error_message=error_message,
            error_type=error_type,
            provider=provider
        )

class SpeechToTextService(ABC):
    """
    Abstract base class for speech-to-text services
    
    This class defines the interface that all STT services must implement.
    """
    
    def __init__(self):
        """Initialize the speech-to-text service"""
        self.provider = "base"
        self.is_available = False
    
    @abstractmethod
    async def transcribe(self, audio_path: str, language: str = None) -> SpeechToTextResult:
        """
        Convert speech to text
        
        Args:
            audio_path: Path to the audio file
            language: Language code (e.g., 'en-US', 'zh-CN')
            
        Returns:
            SpeechToTextResult containing transcription or error details
        """
        pass
    
    async def test_connection(self) -> bool:
        """
        Test if the service is available
        
        Returns:
            bool: True if service is available, False otherwise
        """
        # Default implementation assumes available
        return True
    
    async def _analyze_audio_file(self, audio_path: str) -> Dict[str, Any]:
        """
        Analyze audio file for quality and issues
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            Dict containing quality metrics and potential issues
        """
        try:
            # If pydub is available, use it for analysis
            from pydub import AudioSegment
            import numpy as np
            
            # Load audio file
            audio = AudioSegment.from_file(audio_path)
            
            # Get audio stats
            duration_sec = len(audio) / 1000.0
            channels = audio.channels
            sample_width = audio.sample_width
            frame_rate = audio.frame_rate
            
            # Extract samples as numpy array for analysis
            samples = np.array(audio.get_array_of_samples())
            if channels > 1:
                samples = samples.reshape((-1, channels))
                # Convert to mono for analysis
                samples = samples.mean(axis=1)
            
            # Calculate audio metrics
            rms = np.sqrt(np.mean(np.square(samples)))
            max_amplitude = np.max(np.abs(samples))
            min_amplitude = np.min(np.abs(samples[samples != 0]))  # Exclude zeros
            
            # Detect potential issues
            issues = []
            
            # Check for very short audio
            if duration_sec < 0.5:
                issues.append("too_short")
            
            # Check for silence or low volume
            if rms < 100:  # Arbitrary threshold
                issues.append("low_volume")
            
            # Check for clipping
            if max_amplitude > 32700:  # Close to 16-bit max
                issues.append("possible_clipping")
            
            # Check for noise by analyzing amplitude distribution
            if rms > 0:
                samples_normalized = samples / max(1, rms)
                signal_to_noise = max_amplitude / (rms + 1e-10)
                if signal_to_noise < 5:  # Arbitrary threshold
                    issues.append("noise")
            
            # Prepare result
            quality_info = {
                "duration_sec": duration_sec,
                "channels": channels,
                "sample_width": sample_width,
                "frame_rate": frame_rate,
                "rms": float(rms),
                "max_amplitude": float(max_amplitude),
                "min_amplitude": float(min_amplitude),
                "issues": issues
            }
            
            return quality_info
            
        except Exception as e:
            logger.warning(f"Error analyzing audio file: {e}")
            # Return basic file info if analysis fails
            try:
                file_size = os.path.getsize(audio_path)
                file_info = {
                    "file_size": file_size,
                    "issues": ["analysis_failed"]
                }
                return file_info
            except:
                return {"issues": ["analysis_failed"]}