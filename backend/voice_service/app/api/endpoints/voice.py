# app/api/endpoints/voice.py
import logging
import tempfile
import os
from typing import Optional
import aiofiles
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse, JSONResponse

from app.schemas.voice import (
    VoiceProcessResponse,
    VoiceModelCreateRequest,
    VoiceModelCreateResponse,
    VoiceSynthesisRequest,
    VoiceSynthesisResponse,
    VoiceModelResponse,
    VoiceModelsResponse,
)
from app.services.stt import STTService
from app.services.tts import TTSService
from app.services.voice_model import VoiceModelService

logger = logging.getLogger("voice_service.endpoints.voice")

router = APIRouter()

@router.post("/process", response_model=VoiceProcessResponse)
async def process_audio(
    background_tasks: BackgroundTasks,
    audio: UploadFile = File(...),
    digital_human_id: Optional[str] = Form(None),
    language: Optional[str] = Form("en-US"),
):
    """
    Process voice audio recording from user:
    1. Transcribe speech to text
    2. Process text to generate a response
    3. Synthesize response as audio
    """
    try:
        logger.info(f"Processing audio for digital human ID: {digital_human_id}")
        
        # Save uploaded audio to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
            temp_path = temp_file.name
            await audio.seek(0)
            content = await audio.read()
            temp_file.write(content)
        
        # Add cleanup to background tasks
        background_tasks.add_task(os.unlink, temp_path)
        
        # Transcribe audio to text
        stt_service = STTService()
        text = await stt_service.transcribe(temp_path, language)
        
        if not text:
            raise HTTPException(status_code=400, detail="Could not transcribe audio.")
        
        # Generate response for the user's text
        # In a real implementation, this would call an LLM or other logic to generate responses
        # based on the digital human's persona and the user's input
        response_text = generate_response(text, digital_human_id)
        
        # Synthesize text to speech
        tts_service = TTSService()
        
        # Check if we have a voice model for this digital human
        voice_model_service = VoiceModelService()
        voice_model = None
        if digital_human_id:
            try:
                voice_model = await voice_model_service.get_model_by_digital_human(digital_human_id)
            except Exception as e:
                logger.warning(f"Error loading voice model for {digital_human_id}: {str(e)}")
        
        # Generate audio file with TTS
        audio_path = await tts_service.synthesize(
            response_text,
            language=language,
            voice_model=voice_model
        )
        
        # Add audio cleanup to background tasks
        background_tasks.add_task(os.unlink, audio_path)
        
        # Stream the audio file
        def iterfile():
            with open(audio_path, "rb") as f:
                yield from f
        
        return StreamingResponse(
            iterfile(),
            media_type="audio/mpeg",
            headers={"Content-Disposition": f"attachment; filename=response.mp3"},
        )
    
    except Exception as e:
        logger.error(f"Error processing voice: {str(e)}", exc_info=True)
        # Return JSON error instead of streaming audio
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "text": "Sorry, I couldn't process your audio."
            }
        )

def generate_response(text: str, digital_human_id: Optional[str]) -> str:
    """Generate a response based on the user's input."""
    # This is a simple implementation, but in production would use an AI model
    # with the digital human's persona
    if not text:
        return "I couldn't understand what you said. Could you repeat that?"
    
    # Simple keyword-based responses for demonstration
    text_lower = text.lower()
    
    if "hello" in text_lower or "hi" in text_lower:
        return "Hello! It's good to talk with you."
    elif "how are you" in text_lower:
        return "I'm doing well, thank you for asking. How about you?"
    elif "your name" in text_lower:
        return "I'm your digital companion. You can call me whatever makes you comfortable."
    elif "weather" in text_lower:
        return "I don't have access to current weather data, but I hope it's nice where you are."
    elif "memory" in text_lower or "remember" in text_lower:
        return "I'm still learning to build memories with you. Each conversation helps me understand you better."
    else:
        return f"I heard you say: {text}. That's interesting. Would you like to tell me more about that?"


@router.post("/models/create", response_model=VoiceModelCreateResponse)
async def create_voice_model(
    name: str = Form(...),
    digital_human_id: str = Form(...),
    samples: list[UploadFile] = File(...),
):
    """Create a new voice model from audio samples"""
    try:
        logger.info(f"Creating voice model for digital human ID: {digital_human_id}")
        
        # Save audio samples to temporary files
        sample_paths = []
        for i, sample in enumerate(samples):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
                temp_path = temp_file.name
                await sample.seek(0)
                content = await sample.read()
                temp_file.write(content)
                sample_paths.append(temp_path)
        
        # Create voice model
        voice_model_service = VoiceModelService()
        model_id = await voice_model_service.create_model(
            name=name,
            digital_human_id=digital_human_id,
            sample_paths=sample_paths
        )
        
        # Clean up temporary files
        for path in sample_paths:
            try:
                os.unlink(path)
            except Exception as e:
                logger.warning(f"Failed to delete temporary file {path}: {str(e)}")
        
        return VoiceModelCreateResponse(
            success=True,
            model_id=model_id,
            message="Voice model created successfully",
        )
    
    except Exception as e:
        logger.error(f"Error creating voice model: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create voice model: {str(e)}"
        )

@router.get("/models", response_model=VoiceModelsResponse)
async def get_voice_models(digital_human_id: Optional[str] = None):
    """Get available voice models, optionally filtered by digital human ID"""
    try:
        voice_model_service = VoiceModelService()
        models = await voice_model_service.list_models(digital_human_id)
        return VoiceModelsResponse(
            models=models
        )
    except Exception as e:
        logger.error(f"Error retrieving voice models: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve voice models: {str(e)}"
        )

@router.post("/synthesize", response_model=VoiceSynthesisResponse)
async def synthesize_speech(request: VoiceSynthesisRequest):
    """Synthesize text to speech using a specific voice model"""
    try:
        voice_model_service = VoiceModelService()
        voice_model = None
        
        if request.voice_model_id:
            try:
                voice_model = await voice_model_service.get_model(request.voice_model_id)
            except Exception as e:
                logger.warning(f"Error loading voice model {request.voice_model_id}: {str(e)}")
        
        tts_service = TTSService()
        audio_path = await tts_service.synthesize(
            request.text,
            language=request.language,
            voice_model=voice_model
        )
        
        # In a real implementation, this would upload to cloud storage and return URL
        # For this demo, we'll assume a local filepath is sufficient
        
        return VoiceSynthesisResponse(
            success=True,
            audio_url=f"/audio/synthesized/{os.path.basename(audio_path)}",
            text=request.text
        )
    except Exception as e:
        logger.error(f"Error synthesizing speech: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to synthesize speech: {str(e)}"
        )