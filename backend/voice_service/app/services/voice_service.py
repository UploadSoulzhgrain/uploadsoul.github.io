# app/services/voice_service.py
from dataclasses import dataclass
from typing import Dict, Any, Optional, List, Union

@dataclass
class VoiceServiceResult:
    """
    Standardized result for voice services operations
    
    This class provides a standardized interface for all voice service operations
    to report their results, including success status, error details, and data.
    """
    success: bool
    data: Optional[Union[str, Dict[str, Any], List[Any]]] = None
    error_message: Optional[str] = None
    error_type: Optional[str] = None
    provider: Optional[str] = None
    processing_time: Optional[float] = None
    additional_info: Dict[str, Any] = None
    
    @classmethod
    def success_result(cls, data: Any = None, provider: str = None, processing_time: float = None, 
                      additional_info: Dict[str, Any] = None) -> 'VoiceServiceResult':
        """Factory method to create a successful result"""
        return cls(
            success=True,
            data=data,
            provider=provider,
            processing_time=processing_time,
            additional_info=additional_info or {}
        )
    
    @classmethod
    def error_result(cls, message: str, error_type: str = None, provider: str = None,
                    additional_info: Dict[str, Any] = None) -> 'VoiceServiceResult':
        """Factory method to create an error result"""
        return cls(
            success=False,
            error_message=message,
            error_type=error_type,
            provider=provider,
            additional_info=additional_info or {}
        )