import os
import time
import uuid
import logging
from typing import Optional, Dict, Any
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Depends
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel

from app.config import settings
from app.services.stt_service import SpeechToTextService, SpeechToTextResult
from app.services.google_stt_service import GoogleSTTService
from app.services.tts_service import TextToSpeechService
from app.services.service_adapter import ServiceAdapter
from app.services.service_factory import ServiceFactory, ServiceManager
from app.services.voice_service import VoiceServiceResult

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Dependency to get service manager
async def get_service_manager() -> ServiceManager:
    """Dependency to provide service manager"""
    return await ServiceFactory.create_voice_service()

# Note: Voice service now uses enhanced GoogleSTTService with improved transcription
# capabilities, including audio preprocessing, detailed diagnostics, and adaptive retry strategies.

# For backwards compatibility - initialize traditional services
stt_service = SpeechToTextService()
tts_service = TextToSpeechService()

# Ensure storage directory exists
storage_dir = Path(settings.STORAGE_DIR)
storage_dir.mkdir(parents=True, exist_ok=True)


class TextRequest(BaseModel):
    text: str
    language: Optional[str] = None
    voice_id: Optional[str] = None


@router.get("/health", response_model=dict)
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "timestamp": time.time()}


@router.post("/chat")
async def process_voice_chat(
    audio: UploadFile = File(...),
    language: str = Form(settings.STT_DEFAULT_LANGUAGE),
    voice_id: Optional[str] = Form(None),
    conversation_id: Optional[str] = Form(None),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """Process voice chat: speech to text, get AI response, text to speech"""
    if not audio.filename.endswith(('.wav', '.mp3', '.ogg', '.webm')):
        raise HTTPException(status_code=400, detail="Unsupported audio format")
    
    # Generate conversation ID if not provided
    if not conversation_id:
        conversation_id = str(uuid.uuid4())
        
    # Create conversation directory
    conversation_dir = storage_dir / conversation_id
    conversation_dir.mkdir(exist_ok=True)
    
    # Save audio file
    timestamp = int(time.time())
    audio_path = conversation_dir / f"input_{timestamp}.wav"
    
    with open(audio_path, "wb") as f:
        content = await audio.read()
        f.write(content)
    
    try:
        # Log which service we're using
        active_service = service_manager.get_active_service_name()
        logger.info(f"Processing voice chat using {active_service} service")
        
        # Convert speech to text using service manager
        result = await service_manager.recognize_speech(
            audio_path=str(audio_path),
            language=language
        )
        
        if not result.success:
            logger.error(f"Speech recognition failed: {result.error_message}")
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": result.error_message or "Could not transcribe audio"}
            )
        
        transcription = result.data
        
        # Log the transcription result
        logger.info(f"Transcription result: {transcription}")
        
        # Generate AI response - For now, using predefined responses based on input
        # In a real implementation, this would call an LLM or dialogue manager
        if "记忆" in transcription or "回忆" in transcription:
            response_text = "我记得小时候在老家的日子，我们经常在院子里乘凉，看着满天的星星，谈论着未来的梦想。那段时光对我来说非常宝贵。"
        elif "家庭" in transcription or "家人" in transcription:
            response_text = "家人对我来说是最重要的。每次大家一起吃饭聊天的时候，总是能感受到浓浓的爱意。你还记得我们上次一起去爬山的情景吗？"
        elif "喜欢" in transcription or "爱好" in transcription:
            response_text = "我一直很喜欢下象棋和读历史书。这些爱好伴随了我大半辈子，给我带来了很多乐趣和思考。"
        else:
            response_text = f"谢谢你和我聊天，我听到你说：{transcription}。能和家人交流对我来说非常珍贵。"
        
        # Convert response to speech using service manager
        output_path = conversation_dir / f"output_{timestamp}.wav"
        
        # Handle translation keys before synthesis
        actual_text = response_text
        if response_text.startswith("digitalHuman.voiceChat.responses."):
            logger.info(f"Converting translation key: {response_text} to direct text")
            # Map known translation keys to their actual text values
            if response_text == "digitalHuman.voiceChat.responses.missYou":
                actual_text = "我也很想念你，每次和你交流都让我感到很开心。"
            elif response_text == "digitalHuman.voiceChat.responses.goodMemories":
                actual_text = "谢谢你的消息，我很高兴能和你聊天。作为家庭的一员，能继续和你分享记忆让我感到非常温暖。"
            elif response_text == "digitalHuman.voiceChat.responses.loveTalking":
                actual_text = "我很喜欢和你交谈，这让我感到温暖和亲近。"
            else:
                actual_text = "我理解你的意思了。有什么我能帮助你的吗？"
            logger.info(f"Converted to: {actual_text}")
        
        # Synthesize speech with the properly translated text
        tts_result = await service_manager.synthesize_voice(
            text=actual_text,
            output_path=str(output_path),
            language=language,
            voice_id=voice_id
        )
        
        if not tts_result.success:
            logger.error(f"Speech synthesis failed: {tts_result.error_message}")
            return JSONResponse(
                status_code=500,
                content={"success": False, "error": tts_result.error_message or "Failed to synthesize speech"}
            )
        
        # Return results with audio URL
        audio_url = f"/audio/{conversation_id}/output_{timestamp}.wav"
        
        return {
            "success": True,
            "transcription": transcription,
            "responseText": actual_text,  # Pure text without translation keys
            "audioUrl": audio_url,
            "conversationId": conversation_id,
            "serviceProvider": service_manager.get_active_service_name()  # Include which service was used
        }
        
    except Exception as e:
        logger.exception(f"Error processing voice chat: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@router.post("/tts")
async def text_to_speech(
    text: str = Form(...),
    language: str = Form(settings.TTS_DEFAULT_LANGUAGE),
    voice_id: Optional[str] = Form(None),
    conversation_id: Optional[str] = Form(None),
    service_manager: ServiceManager = Depends(get_service_manager)
):
    """Convert text to speech"""
    try:
        # Create unique ID for this request
        request_id = str(uuid.uuid4())[:8]
        timestamp = int(time.time())
        
        # Log which service we're using
        active_service = service_manager.get_active_service_name()
        logger.info(f"Processing text-to-speech using {active_service} service")
        
        # Create directory
        tts_dir = storage_dir / "tts"
        tts_dir.mkdir(exist_ok=True)
        
        # Output file path
        output_path = tts_dir / f"tts_{request_id}_{timestamp}.wav"
        
        # Original input text for reference
        original_text = text
        process_text = text
        response_text = ""
        
        # Step 1: Handle any translation keys in the input text
        if text.startswith("digitalHuman.voiceChat.responses."):
            logger.info(f"Translating key in TTS request: {text}")
            # Ensure we convert any translation keys to actual Chinese text
            if "missYou" in text:
                process_text = "我也很想念你，每次和你交流都让我感到很开心。"
                response_text = process_text
            elif "goodMemories" in text:
                process_text = "谢谢你的消息，我很高兴能和你聊天。作为家庭的一员，能继续和你分享记忆让我感到非常温暖。"
                response_text = process_text
            elif "loveTalking" in text:
                process_text = "我很喜欢和你交谈，这让我感到温暖和亲近。"
                response_text = process_text
            else:
                process_text = "我理解你的意思了。有什么我能帮助你的吗？"
                response_text = process_text
            logger.info(f"Converted TTS request to: {process_text}")
        else:
            # Generate a more personalized response based on content
            if "记忆" in text or "回忆" in text:
                response_text = "我记得小时候在老家的日子，我们经常在院子里乘凉，看着满天的星星，谈论着未来的梦想。那段时光对我来说非常宝贵。"
            elif "家庭" in text or "家人" in text:
                response_text = "家人对我来说是最重要的。每次大家一起吃饭聊天的时候，总是能感受到浓浓的爱意。你还记得我们上次一起去爬山的情景吗？"
            elif "喜欢" in text or "爱好" in text:
                response_text = "我一直很喜欢下象棋和读历史书。这些爱好伴随了我大半辈子，给我带来了很多乐趣和思考。"
            elif "介绍" in text or "自己" in text:
                response_text = "我是张伯父，今年78岁。一生从事教育工作，教了40多年的历史。退休后喜欢园艺和钓鱼。有两个孩子，三个孙子孙女。我很高兴能以这种方式和你交流。"
            elif "想念" in text or "miss" in text.lower():
                response_text = "我也很想念你，每次和你交流都让我感到很开心。希望我们能经常聊天，分享彼此的故事。"
            else:
                response_text = f"谢谢你的消息，我很高兴能和你聊天。我听到你说：{text}。作为家庭的一员，能继续和你分享记忆让我感到非常温暖。"
                
        # Step 2: Handle any translation keys in the response_text separately
        if response_text.startswith("digitalHuman.voiceChat.responses."):
            logger.info(f"Converting response translation key: {response_text} to direct text")
            if response_text == "digitalHuman.voiceChat.responses.missYou":
                response_text = "我也很想念你，每次和你交流都让我感到很开心。"
            elif response_text == "digitalHuman.voiceChat.responses.goodMemories":
                response_text = "谢谢你的消息，我很高兴能和你聊天。作为家庭的一员，能继续和你分享记忆让我感到非常温暖。"
            elif response_text == "digitalHuman.voiceChat.responses.loveTalking":
                response_text = "我很喜欢和你交谈，这让我感到温暖和亲近。"
            else:
                response_text = "我理解你的意思了。有什么我能帮助你的吗？"
            logger.info(f"Converted response to: {response_text}")
            
        # Use service manager to synthesize the speech
        tts_result = await service_manager.synthesize_voice(
            text=process_text,  # Use the properly translated text
            output_path=str(output_path),
            language=language,
            voice_id=voice_id
        )
        
        if not tts_result.success:
            logger.error(f"Speech synthesis failed: {tts_result.error_message}")
            return JSONResponse(
                status_code=500,
                content={"success": False, "error": tts_result.error_message or "Failed to synthesize speech"}
            )
        
        # Return audio URL
        audio_url = f"/audio/tts/tts_{request_id}_{timestamp}.wav"
        
        return {
            "success": True,
            "audioUrl": audio_url,
            "responseText": response_text,  # Pure text without translation keys
            "conversationId": conversation_id or request_id,
            "serviceProvider": service_manager.get_active_service_name()  # Include which service was used
        }
        
    except Exception as e:
        logger.exception(f"Error in text to speech: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@router.get("/audio/{path:path}")
async def get_audio(path: str):
    """Serve audio files"""
    file_path = storage_dir / path
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        path=str(file_path),
        media_type="audio/wav",
        filename=file_path.name
    )
