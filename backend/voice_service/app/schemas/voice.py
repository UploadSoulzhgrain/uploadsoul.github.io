# app/schemas/voice.py
from typing import List, Optional
from pydantic import BaseModel, Field


class VoiceProcessResponse(BaseModel):
    success: bool = True
    text: str
    error: Optional[str] = None


class VoiceModelBase(BaseModel):
    name: str
    digital_human_id: str
    gender: Optional[str] = None


class VoiceModelResponse(VoiceModelBase):
    id: str
    created_at: Optional[str] = None
    status: str = "active"
    quality_score: Optional[float] = None


class VoiceModelsResponse(BaseModel):
    models: List[VoiceModelResponse]


class VoiceModelCreateRequest(VoiceModelBase):
    pass


class VoiceModelCreateResponse(BaseModel):
    success: bool
    model_id: str
    message: str


class VoiceSynthesisRequest(BaseModel):
    text: str
    voice_model_id: Optional[str] = None
    language: str = "en-US"
    speed: Optional[float] = Field(1.0, ge=0.5, le=2.0)
    pitch: Optional[float] = Field(1.0, ge=0.5, le=2.0)


class VoiceSynthesisResponse(BaseModel):
    success: bool
    audio_url: str
    text: str


class VoiceMemory(BaseModel):
    id: str
    content: str
    created_at: str