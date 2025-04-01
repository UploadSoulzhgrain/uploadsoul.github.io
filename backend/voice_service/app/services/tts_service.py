import os
import logging
import asyncio
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

# Configure logging
logger = logging.getLogger(__name__)

class TextToSpeechService(ABC):
    """
    Abstract base class for text-to-speech services
    
    All TTS service implementations should extend this class
    and implement the synthesize method.
    """
    def __init__(self):
        """Initialize the TTS service"""
        self.provider = "base"
        self.default_language = "zh-CN"
        self.default_voice = "default"
        
    @abstractmethod
    async def synthesize(
        self, 
        text: str, 
        output_path: str, 
        language: str = None, 
        voice_id: str = None,
        options: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Convert text to speech
        
        Args:
            text: Text to convert to speech
            output_path: Path to save audio file
            language: Language code (e.g., 'en-US', 'zh-CN')
            voice_id: ID of voice to use
            options: Additional provider-specific options
            
        Returns:
            Dictionary with synthesis results or error details
        """
        pass
    
    async def test_connection(self) -> bool:
        """
        Test if the service is available
        
        This method should be overridden by subclasses that need to 
        check connectivity to external services.
        
        Returns:
            bool: True if service is available, False otherwise
        """
        return True
    
    def _ensure_output_directory(self, output_path: str) -> bool:
        """
        Ensure that the output directory exists
        
        Args:
            output_path: Path to save audio file
            
        Returns:
            bool: True if directory exists or was created, False otherwise
        """
        try:
            output_dir = os.path.dirname(output_path)
            os.makedirs(output_dir, exist_ok=True)
            return True
        except Exception as e:
            logger.error(f"Error creating output directory: {e}")
            return False
    
    async def _preprocess_text(self, text: str) -> str:
        """
        Preprocess text before synthesis
        
        This handles common text preprocessing tasks like:
        - Removing excess whitespace
        - Basic text normalization
        - Handling special characters
        
        Args:
            text: Text to preprocess
            
        Returns:
            Preprocessed text
        """
        # Basic preprocessing
        text = text.strip()
        
        # Handle common issues
        if not text:
            return "..."  # Return something that can be synthesized
            
        # Convert numbers, dates, etc. if needed (can be extended)
        
        return text