# app/api/dependencies.py
from typing import Annotated
from fastapi import Depends

from app.services.service_factory import ServiceManager, get_service_manager

# Define type annotation for dependency injection
ServiceManagerDep = Annotated[ServiceManager, Depends(get_service_manager)]