# app/api/endpoints/status.py
import logging
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import ServiceManagerDep
from app.services.service_adapter import ServiceStatus, ServiceAdapter

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


@router.get("/")
async def get_service_status(service_manager: ServiceManagerDep) -> Dict[str, Any]:
    """
    Get overall service status
    
    This endpoint provides health check information for all services,
    including overall system health and individual component status.
    
    Returns:
        Status information with health indicators and active providers
    """
    try:
        status_info = service_manager.get_status()
        
        # Add uptime information
        # Note: This would require adding an uptime tracker to the service manager
        
        return {
            "status": "ok",
            "message": "Service status retrieved successfully",
            "data": status_info
        }
    except Exception as e:
        logger.exception("Error retrieving service status")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve service status: {str(e)}"
        )


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Simplified health check endpoint
    
    This is a lightweight endpoint that can be used by load balancers
    and monitoring tools to check if the service is running.
    
    Returns:
        Basic health status indicating the service is operational
    """
    return {
        "status": "ok",
        "service": "voice_service"
    }


@router.get("/providers")
async def list_providers(service_manager: ServiceManagerDep) -> Dict[str, Any]:
    """
    List available service providers
    
    This endpoint provides information about available STT and TTS providers,
    including which ones are currently active and their health status.
    
    Returns:
        List of providers with their status information
    """
    try:
        status_info = service_manager.get_status()
        
        # Extract just the provider information
        providers = {}
        for service_type, service_info in status_info.get("services", {}).items():
            providers[service_type] = {
                "active": service_info.get("active_provider"),
                "available": [
                    provider for provider, info in service_info.get("providers", {}).items()
                    if info.get("status") == "healthy"
                ]
            }
        
        return {
            "status": "ok",
            "message": "Providers retrieved successfully",
            "data": providers
        }
    except Exception as e:
        logger.exception("Error retrieving provider information")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve provider information: {str(e)}"
        )


@router.post("/switch/{service_type}/{provider}")
async def switch_provider(
    service_type: str, 
    provider: str,
    service_manager: ServiceManagerDep
) -> Dict[str, Any]:
    """
    Switch active service provider
    
    This endpoint allows manually switching the active provider for a service,
    which is useful for testing or working around issues with specific providers.
    
    Args:
        service_type: Type of service ("stt" or "tts") 
        provider: Provider name to switch to
        
    Returns:
        Result of the provider switch operation
    """
    # This functionality would require additional code in the service manager
    # Here's a placeholder implementation:
    
    return {
        "status": "error",
        "message": "Manual provider switching not implemented yet"
    }


@router.get("/diagnostics")
async def get_diagnostics(service_manager: ServiceManagerDep) -> Dict[str, Any]:
    """
    Get detailed diagnostic information
    
    This endpoint provides detailed diagnostic information about the system,
    including service health, recent errors, and performance metrics.
    
    Returns:
        Comprehensive diagnostic information for system monitoring
    """
    # This would require implementing a diagnostics collector
    # Here's a placeholder implementation:
    
    try:
        # Basic diagnostics from service status
        status_info = service_manager.get_status()
        
        # Get active STT provider name
        active_stt = service_manager.get_active_service_name()
        
        # Basic system info
        import platform
        import psutil
        
        diagnostics = {
            "system": {
                "platform": platform.platform(),
                "python_version": platform.python_version(),
                "cpu_usage": psutil.cpu_percent(),
                "memory_usage": psutil.virtual_memory().percent
            },
            "services": status_info.get("services", {}),
            "active_providers": {
                "stt": active_stt
            }
        }
        
        return {
            "status": "ok",
            "message": "Diagnostics retrieved successfully",
            "data": diagnostics
        }
    except Exception as e:
        logger.exception("Error retrieving diagnostics")
        return {
            "status": "partial",
            "message": f"Error retrieving some diagnostic information: {str(e)}",
            "data": {
                "error": str(e)
            }
        }