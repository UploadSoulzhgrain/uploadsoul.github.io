"""
service_manager.py - Manages voice services with failover capabilities
"""
import asyncio
from enum import Enum
from typing import Dict, Any, List, Optional, Union

from app.services.voice_service import VoiceService, ServiceStatus, VoiceServiceResult


class FailoverStrategy(str, Enum):
    """Strategy for handling service failover"""
    SEQUENTIAL = "sequential"      # Try services in order
    AVAILABILITY = "availability"  # Choose based on current availability status


class ServiceManager:
    """
    Service manager with failover capabilities between multiple voice services.
    Implements the service adapter pattern to provide a unified interface.
    """
    
    def __init__(
        self, 
        primary_service: Optional[VoiceService] = None,
        failover_services: Optional[List[VoiceService]] = None,
        strategy: FailoverStrategy = FailoverStrategy.SEQUENTIAL,
        auto_restore_primary: bool = True,
        health_check_interval: int = 300  # 5 minutes
    ):
        self.primary_service = primary_service
        self.failover_services = failover_services or []
        self.strategy = strategy
        self.auto_restore_primary = auto_restore_primary
        self.health_check_interval = health_check_interval
        
        self._services_by_name = {}
        if primary_service:
            self._services_by_name[primary_service.name] = primary_service
            
        for service in self.failover_services:
            self._services_by_name[service.name] = service
            
        self._current_active = primary_service.name if primary_service else None
        self._service_status = {}
        self._last_service_error = {}
        self._initialized = False
        
    async def initialize(self) -> bool:
        """Initialize all services"""
        tasks = []
        
        # Initialize primary service
        if self.primary_service:
            tasks.append(self._initialize_service(self.primary_service))
            
        # Initialize failover services
        for service in self.failover_services:
            tasks.append(self._initialize_service(service))
            
        # Wait for all initialization to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # At least one service should be available
        success = any(result is True for result in results)
        
        # Start background health checks if auto-restore is enabled
        if success and self.auto_restore_primary and self.health_check_interval > 0:
            asyncio.create_task(self._background_health_checker())
            
        self._initialized = success
        return success
            
    async def _initialize_service(self, service: VoiceService) -> bool:
        """Initialize a single service"""
        try:
            success = await service.initialize()
            self._service_status[service.name] = await service.get_status()
            return success
        except Exception as e:
            print(f"Failed to initialize {service.name}: {str(e)}")
            self._service_status[service.name] = ServiceStatus.UNAVAILABLE
            self._last_service_error[service.name] = str(e)
            return False
            
    async def _background_health_checker(self):
        """Periodically check health of services and auto-restore primary if possible"""
        while True:
            await asyncio.sleep(self.health_check_interval)
            
            try:
                # Update status of all services
                for name, service in self._services_by_name.items():
                    self._service_status[name] = await service.get_status()
                    
                # If primary service is available and we're using failover, switch back
                if (self.primary_service and 
                    self._current_active != self.primary_service.name and
                    self._service_status.get(self.primary_service.name) == ServiceStatus.AVAILABLE):
                    self._current_active = self.primary_service.name
                    print(f"Auto-restored primary service: {self.primary_service.name}")
            except Exception as e:
                print(f"Error in health checker: {str(e)}")
                
    async def synthesize_voice(
        self, 
        text: str, 
        output_path: str,
        voice_id: str = None, 
        language: str = None,
        options: Dict[str, Any] = None
    ) -> VoiceServiceResult:
        """Convert text to speech with failover support"""
        if not self._initialized:
            await self.initialize()
            
        return await self._execute_with_failover(
            "synthesize_voice",
            text=text,
            output_path=output_path,
            voice_id=voice_id,
            language=language,
            options=options
        )
    
    async def recognize_speech(
        self,
        audio_path: str,
        language: str = None,
        options: Dict[str, Any] = None
    ) -> VoiceServiceResult:
        """Convert speech to text with failover support"""
        if not self._initialized:
            await self.initialize()
            
        return await self._execute_with_failover(
            "recognize_speech",
            audio_path=audio_path,
            language=language,
            options=options
        )
    
    async def get_status(self) -> Dict[str, ServiceStatus]:
        """Get status of all services"""
        if not self._initialized:
            await self.initialize()
            
        status_dict = {}
        for name, service in self._services_by_name.items():
            try:
                status = await service.get_status()
                self._service_status[name] = status
                status_dict[name] = status
            except Exception as e:
                print(f"Error getting status for {name}: {str(e)}")
                status_dict[name] = ServiceStatus.UNKNOWN
                
        return status_dict
    
    async def _execute_with_failover(self, method_name: str, **kwargs) -> VoiceServiceResult:
        """Execute a method with failover support"""
        # Get the service order based on strategy
        services_to_try = self._get_services_to_try()
        
        # Try each service in order
        last_error = None
        for service in services_to_try:
            try:
                method = getattr(service, method_name)
                result = await method(**kwargs)
                
                if result.success:
                    # Update current active service
                    self._current_active = service.name
                    return result
                
                # Store the error for potential later use
                last_error = result
                print(f"{service.name} {method_name} failed: {result.error_message}")
                
            except Exception as e:
                print(f"Error calling {method_name} on {service.name}: {str(e)}")
                self._last_service_error[service.name] = str(e)
                last_error = VoiceServiceResult(
                    success=False,
                    error_message=f"Service error: {str(e)}",
                    error_code="service_exception"
                )
                
        # All services failed
        if last_error:
            return last_error
            
        # Generic error if no specific error was captured
        return VoiceServiceResult(
            success=False,
            error_message=f"All voice services failed for {method_name}",
            error_code="all_services_failed"
        )
    
    def _get_services_to_try(self) -> List[VoiceService]:
        """Get the ordered list of services to try based on strategy"""
        services = []
        
        if self.strategy == FailoverStrategy.SEQUENTIAL:
            # Start with current active or primary
            if self._current_active and self._current_active in self._services_by_name:
                services.append(self._services_by_name[self._current_active])
                
            # Then add primary if not already added
            if self.primary_service and self.primary_service.name != self._current_active:
                services.append(self.primary_service)
                
            # Then add all failovers not already added
            for service in self.failover_services:
                if service.name not in [s.name for s in services]:
                    services.append(service)
                    
        elif self.strategy == FailoverStrategy.AVAILABILITY:
            # Order by current availability status
            available = []
            degraded = []
            others = []
            
            # First consider current active service
            if self._current_active and self._current_active in self._services_by_name:
                current = self._services_by_name[self._current_active]
                status = self._service_status.get(current.name, ServiceStatus.UNKNOWN)
                
                if status == ServiceStatus.AVAILABLE:
                    available.append(current)
                elif status == ServiceStatus.DEGRADED:
                    degraded.append(current)
                else:
                    others.append(current)
                    
            # Then consider all other services
            all_services = [self.primary_service] + self.failover_services if self.primary_service else self.failover_services
            for service in all_services:
                if not service or service.name == self._current_active:
                    continue
                    
                status = self._service_status.get(service.name, ServiceStatus.UNKNOWN)
                
                if status == ServiceStatus.AVAILABLE:
                    available.append(service)
                elif status == ServiceStatus.DEGRADED:
                    degraded.append(service)
                else:
                    others.append(service)
                    
            # Combine in order of availability
            services = available + degraded + others
            
        return services
    
    def get_active_service_name(self) -> Optional[str]:
        """Get the name of the currently active service"""
        return self._current_active
        
    def get_service_error(self, service_name: str) -> Optional[str]:
        """Get the last error from a specific service"""
        return self._last_service_error.get(service_name)