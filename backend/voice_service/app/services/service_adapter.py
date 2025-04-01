# app/services/service_adapter.py
import asyncio
import logging
import time
from typing import Dict, List, Any, Optional
from enum import Enum

from app.services.stt_service import SpeechToTextService, SpeechToTextResult
from app.services.voice_service import VoiceServiceResult

# Configure logging
logger = logging.getLogger(__name__)

class ProviderStatus(str, Enum):
    """Status states for voice service providers"""
    UNKNOWN = "unknown"
    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    DEGRADED = "degraded"
    ERROR = "error"

class ServiceAdapter:
    """
    Service adapter that provides fault tolerance and failover for voice services
    
    This class manages multiple voice service providers and automatically switches
    between them based on availability and performance. It handles failures
    gracefully and can automatically restore primary services when they become
    available again.
    """
    
    def __init__(
        self,
        primary_provider: str,
        failover_providers: List[str] = None,
        failover_strategy: str = "availability",
        auto_restore: bool = True,
        health_check_interval: int = 300,
    ):
        """
        Initialize the service adapter
        
        Args:
            primary_provider: Name of the primary service provider
            failover_providers: List of failover providers in order of preference
            failover_strategy: Strategy for failover ("none", "ordered", "availability", "quality")
            auto_restore: Whether to automatically restore to primary provider when available
            health_check_interval: Interval between health checks in seconds
        """
        self.primary_provider = primary_provider
        self.failover_providers = failover_providers or []
        self.failover_strategy = failover_strategy
        self.auto_restore = auto_restore
        self.health_check_interval = health_check_interval
        
        # Service provider instances
        self.providers: Dict[str, Any] = {}
        
        # Provider status tracking
        self.provider_status: Dict[str, ProviderStatus] = {}
        
        # Active provider being used
        self.active_provider = primary_provider
        
        # Last health check timestamp
        self.last_health_check = 0
        
        # Running flag
        self.running = False
        
        # Health check task
        self.health_check_task = None
        
        logger.info(f"Service adapter initialized with primary provider: {primary_provider}")
        logger.info(f"Failover providers: {failover_providers}")
        logger.info(f"Failover strategy: {failover_strategy}")
    
    async def start(self):
        """Start the service adapter and begin health checks"""
        if self.running:
            logger.warning("Service adapter already running")
            return
            
        logger.info("Starting service adapter")
        self.running = True
        
        # Initialize provider status
        all_providers = [self.primary_provider] + self.failover_providers
        for provider in all_providers:
            self.provider_status[provider] = ProviderStatus.UNKNOWN
        
        # Start health check task
        if self.health_check_interval > 0:
            self.health_check_task = asyncio.create_task(self._health_check_loop())
        
        # Initial health check to determine active provider
        await self._check_provider_health()
    
    async def stop(self):
        """Stop the service adapter and cancel health checks"""
        if not self.running:
            return
            
        logger.info("Stopping service adapter")
        self.running = False
        
        # Cancel health check task
        if self.health_check_task:
            logger.debug("Cancelling health check task")
            self.health_check_task.cancel()
            try:
                await self.health_check_task
            except asyncio.CancelledError:
                pass
            self.health_check_task = None
    
    async def _health_check_loop(self):
        """Background task for periodic health checks"""
        logger.info("Starting health check loop")
        try:
            while self.running:
                await self._check_provider_health()
                await asyncio.sleep(self.health_check_interval)
        except asyncio.CancelledError:
            logger.info("Health check loop cancelled")
            raise
        except Exception as e:
            logger.exception(f"Error in health check loop: {e}")
    
    async def _check_provider_health(self):
        """Check health of all providers and update status"""
        logger.debug("Checking provider health")
        self.last_health_check = time.time()
        
        # Check primary provider first
        primary_available = await self._check_single_provider_health(self.primary_provider)
        
        # Auto-restore to primary if enabled and available
        if self.auto_restore and primary_available and self.active_provider != self.primary_provider:
            logger.info(f"Auto-restoring to primary provider: {self.primary_provider}")
            self.active_provider = self.primary_provider
        
        # Check failover providers
        for provider in self.failover_providers:
            await self._check_single_provider_health(provider)
        
        # If active provider is unavailable, find a new one
        if self.provider_status.get(self.active_provider) != ProviderStatus.AVAILABLE:
            await self._select_available_provider()
    
    async def _check_single_provider_health(self, provider_name: str) -> bool:
        """
        Check health of a single provider
        
        Args:
            provider_name: Name of the provider to check
            
        Returns:
            bool: True if provider is available
        """
        logger.debug(f"Checking health for provider: {provider_name}")
        
        provider = self.providers.get(provider_name)
        if not provider:
            logger.warning(f"Provider {provider_name} not registered")
            self.provider_status[provider_name] = ProviderStatus.UNAVAILABLE
            return False
        
        try:
            # Check if the provider has a test_connection method
            if hasattr(provider, 'test_connection'):
                is_available = await provider.test_connection()
                
                if is_available:
                    self.provider_status[provider_name] = ProviderStatus.AVAILABLE
                    logger.debug(f"Provider {provider_name} is available")
                    return True
                else:
                    self.provider_status[provider_name] = ProviderStatus.UNAVAILABLE
                    logger.warning(f"Provider {provider_name} is unavailable")
                    return False
            else:
                # Assume available if no test_connection method
                logger.debug(f"No test_connection method for {provider_name}, assuming available")
                self.provider_status[provider_name] = ProviderStatus.AVAILABLE
                return True
                
        except Exception as e:
            logger.exception(f"Error checking health for provider {provider_name}: {e}")
            self.provider_status[provider_name] = ProviderStatus.ERROR
            return False
    
    async def _select_available_provider(self):
        """Select an available provider based on strategy"""
        logger.info(f"Selecting new active provider using strategy: {self.failover_strategy}")
        
        if self.failover_strategy == "none":
            # No failover - stick with primary even if unavailable
            logger.info("Failover disabled, sticking with primary provider")
            self.active_provider = self.primary_provider
            return
        
        # Check primary provider first
        if self.provider_status.get(self.primary_provider) == ProviderStatus.AVAILABLE:
            logger.info(f"Primary provider {self.primary_provider} is available")
            self.active_provider = self.primary_provider
            return
        
        if self.failover_strategy == "ordered":
            # Try providers in order of preference
            for provider in self.failover_providers:
                if self.provider_status.get(provider) == ProviderStatus.AVAILABLE:
                    logger.info(f"Selected failover provider: {provider}")
                    self.active_provider = provider
                    return
        else:  # "availability" or "quality" (quality not fully implemented yet)
            # Choose any available provider
            available_providers = [p for p in self.failover_providers 
                                   if self.provider_status.get(p) == ProviderStatus.AVAILABLE]
            
            if available_providers:
                selected = available_providers[0]  # For now just take first available
                logger.info(f"Selected available failover provider: {selected}")
                self.active_provider = selected
                return
        
        # If we get here, no providers are available
        logger.warning("No available providers found, keeping current active provider")
    
    def register_provider(self, name: str, provider: Any):
        """
        Register a service provider
        
        Args:
            name: Provider name
            provider: Provider instance
        """
        logger.info(f"Registering provider: {name}")
        self.providers[name] = provider
        
        # Set initial status to unknown
        self.provider_status[name] = ProviderStatus.UNKNOWN
    
    def unregister_provider(self, name: str):
        """
        Unregister a service provider
        
        Args:
            name: Provider name
        """
        if name in self.providers:
            logger.info(f"Unregistering provider: {name}")
            self.providers.pop(name)
            self.provider_status.pop(name, None)
            
            # If this was the active provider, select a new one
            if self.active_provider == name:
                self.active_provider = self.primary_provider
    
    def get_active_provider(self) -> str:
        """
        Get the name of the currently active provider
        
        Returns:
            str: Name of active provider
        """
        return self.active_provider
    
    def get_active_provider_instance(self) -> Any:
        """
        Get the instance of the active provider
        
        Returns:
            Any: Provider instance or None if not found
        """
        return self.providers.get(self.active_provider)
    
    def get_provider_status(self) -> Dict[str, str]:
        """
        Get status of all registered providers
        
        Returns:
            Dict[str, str]: Provider status dictionary
        """
        return {name: status.value for name, status in self.provider_status.items()}
    
    def get_health_info(self) -> Dict[str, Any]:
        """
        Get health information about the service adapter
        
        Returns:
            Dict[str, Any]: Health information
        """
        now = time.time()
        return {
            "active_provider": self.active_provider,
            "primary_provider": self.primary_provider,
            "failover_providers": self.failover_providers,
            "provider_status": self.get_provider_status(),
            "last_health_check": int(self.last_health_check),
            "time_since_last_check": int(now - self.last_health_check),
            "health_check_interval": self.health_check_interval,
            "auto_restore": self.auto_restore,
            "running": self.running
        }
    
    async def transcribe(self, audio_path: str, language: str = None) -> Dict[str, Any]:
        """
        Transcribe audio using the active provider with failover
        
        Args:
            audio_path: Path to audio file
            language: Language code
            
        Returns:
            Dict[str, Any]: Transcription result
        """
        # Get active provider instance
        provider = self.get_active_provider_instance()
        if not provider:
            logger.error(f"No provider available for transcription")
            return {
                "success": False,
                "error": {
                    "message": "No provider available for transcription",
                    "type": "provider_unavailable"
                }
            }
        
        # Check if it's a SpeechToTextService
        if not isinstance(provider, SpeechToTextService):
            logger.error(f"Active provider {self.active_provider} does not support transcription")
            return {
                "success": False,
                "error": {
                    "message": f"Provider {self.active_provider} does not support transcription",
                    "type": "unsupported_operation" 
                }
            }
        
        try:
            # Transcribe with active provider
            logger.info(f"Transcribing with provider: {self.active_provider}")
            result: SpeechToTextResult = await provider.transcribe(audio_path, language)
            
            # If successful, return the result
            if result.success:
                return {
                    "success": True,
                    "text": result.text,
                    "confidence": result.confidence,
                    "provider": result.provider,
                    "alternatives": result.alternatives,
                    "audioQuality": result.audio_quality,
                    "processingTime": result.processing_time
                }
            
            # If primary provider failed, try failover if enabled
            if self.active_provider == self.primary_provider and self.failover_strategy != "none":
                for failover_name in self.failover_providers:
                    failover = self.providers.get(failover_name)
                    if not failover or not isinstance(failover, SpeechToTextService):
                        continue
                        
                    # Check if failover is available
                    status = self.provider_status.get(failover_name, ProviderStatus.UNKNOWN)
                    if status != ProviderStatus.AVAILABLE:
                        continue
                    
                    logger.info(f"Primary provider failed, trying failover with {failover_name}")
                    failover_result = await failover.transcribe(audio_path, language)
                    if failover_result.success:
                        return {
                            "success": True,
                            "text": failover_result.text,
                            "confidence": failover_result.confidence,
                            "provider": failover_result.provider,
                            "alternatives": failover_result.alternatives,
                            "audioQuality": failover_result.audio_quality,
                            "processingTime": failover_result.processing_time,
                            "failover": True,
                            "primaryError": {
                                "message": result.error_message,
                                "type": result.error_type
                            }
                        }
            
            # All providers failed
            return {
                "success": False,
                "error": {
                    "message": result.error_message,
                    "type": result.error_type
                },
                "provider": result.provider
            }
            
        except Exception as e:
            logger.exception(f"Error in transcribe adapter: {e}")
            return {
                "success": False,
                "error": {
                    "message": str(e),
                    "type": "exception"
                },
                "provider": self.active_provider
            }