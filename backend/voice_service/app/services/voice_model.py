# app/services/voice_model.py
import os
import logging
import json
import shutil
import uuid
from typing import List, Optional, Dict, Any

import aiofiles
from pydub import AudioSegment

from app.core.config import settings
from app.schemas.voice import VoiceModelResponse

logger = logging.getLogger("voice_service.services.voice_model")

class VoiceModelService:
    """
    Service for managing voice models
    - Creating voice models from audio samples
    - Retrieving voice models for synthesis
    - Managing voice model metadata
    """
    
    def __init__(self):
        """Initialize the service and ensure storage paths exist"""
        self.models_dir = settings.VOICE_MODEL_PATH
        self.metadata_path = os.path.join(self.models_dir, "metadata.json")
        
        # Ensure directories exist
        os.makedirs(self.models_dir, exist_ok=True)
        
        # Load existing metadata or initialize new
        self._initialize_metadata()
    
    def _initialize_metadata(self):
        """Initialize or load metadata file"""
        if os.path.exists(self.metadata_path):
            try:
                with open(self.metadata_path, 'r') as f:
                    self.metadata = json.load(f)
            except Exception as e:
                logger.error(f"Failed to load voice model metadata: {str(e)}", exc_info=True)
                self.metadata = {"models": {}}
        else:
            self.metadata = {"models": {}}
            self._save_metadata()
    
    def _save_metadata(self):
        """Save metadata to file"""
        try:
            with open(self.metadata_path, 'w') as f:
                json.dump(self.metadata, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save voice model metadata: {str(e)}", exc_info=True)
    
    async def create_model(
        self,
        name: str,
        digital_human_id: str,
        sample_paths: List[str],
    ) -> str:
        """
        Create a new voice model from audio samples
        
        Args:
            name: Name of the voice model
            digital_human_id: ID of the digital human this model belongs to
            sample_paths: Paths to audio sample files
            
        Returns:
            Unique ID of the created model
        """
        model_id = str(uuid.uuid4())
        model_dir = os.path.join(self.models_dir, model_id)
        os.makedirs(model_dir, exist_ok=True)
        
        # Process and save audio samples
        quality_scores = []
        samples_dir = os.path.join(model_dir, "samples")
        os.makedirs(samples_dir, exist_ok=True)
        
        for i, sample_path in enumerate(sample_paths):
            try:
                # Convert to WAV and normalize for consistent quality
                audio = AudioSegment.from_file(sample_path)
                
                # Simple quality check - duration in seconds
                duration_sec = len(audio) / 1000
                
                # Score based on duration (simple heuristic)
                # 5-30 seconds is ideal
                quality_score = min(1.0, duration_sec / 10.0) if duration_sec < 10 else min(1.0, 30.0 / duration_sec)
                quality_scores.append(quality_score)
                
                # Normalize audio
                normalized_audio = audio.normalize()
                
                # Save as WAV
                output_path = os.path.join(samples_dir, f"sample_{i}.wav")
                normalized_audio.export(output_path, format="wav")
                
                logger.info(f"Processed sample {i} for model {model_id} with quality {quality_score:.2f}")
            except Exception as e:
                logger.error(f"Failed to process sample {i}: {str(e)}", exc_info=True)
        
        # Calculate overall quality score
        avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0.5
        
        # In a production system, this is where we would:
        # 1. Extract voice characteristics
        # 2. Train an actual voice model
        # 3. Save model files and parameters
        
        # For this demo, we'll just save metadata
        from datetime import datetime
        now = datetime.now().isoformat()
        model_data = {
            "id": model_id,
            "name": name,
            "digital_human_id": digital_human_id,
            "created_at": now,
            "status": "active",
            "quality_score": avg_quality,
            "samples_count": len(sample_paths),
            "gender": "unknown"  # Would be detected by voice analysis in production
        }
        
        # Add to metadata
        self.metadata["models"][model_id] = model_data
        self._save_metadata()
        
        return model_id
    
    async def get_model(self, model_id: str) -> Optional[VoiceModelResponse]:
        """
        Get a voice model by ID
        
        Args:
            model_id: ID of the voice model
            
        Returns:
            Voice model data or None if not found
        """
        model_data = self.metadata["models"].get(model_id)
        if not model_data:
            return None
        
        return VoiceModelResponse(
            id=model_data["id"],
            name=model_data["name"],
            digital_human_id=model_data["digital_human_id"],
            gender=model_data.get("gender", "unknown"),
            created_at=model_data.get("created_at"),
            status=model_data.get("status", "active"),
            quality_score=model_data.get("quality_score")
        )
    
    async def get_model_by_digital_human(self, digital_human_id: str) -> Optional[VoiceModelResponse]:
        """
        Find a voice model for a specific digital human
        
        Args:
            digital_human_id: ID of the digital human
            
        Returns:
            Voice model data or None if not found
        """
        # Find all models for this digital human
        models = []
        for model_id, model_data in self.metadata["models"].items():
            if model_data["digital_human_id"] == digital_human_id and model_data["status"] == "active":
                models.append((model_id, model_data))
        
        if not models:
            return None
        
        # Sort by quality score and get the best one
        models.sort(key=lambda x: x[1].get("quality_score", 0), reverse=True)
        best_model_id, best_model_data = models[0]
        
        return await self.get_model(best_model_id)
    
    async def list_models(self, digital_human_id: Optional[str] = None) -> List[VoiceModelResponse]:
        """
        List voice models, optionally filtered by digital human ID
        
        Args:
            digital_human_id: Optional filter by digital human ID
            
        Returns:
            List of voice models
        """
        result = []
        
        for model_id, model_data in self.metadata["models"].items():
            if digital_human_id is None or model_data["digital_human_id"] == digital_human_id:
                result.append(VoiceModelResponse(
                    id=model_data["id"],
                    name=model_data["name"],
                    digital_human_id=model_data["digital_human_id"],
                    gender=model_data.get("gender", "unknown"),
                    created_at=model_data.get("created_at"),
                    status=model_data.get("status", "active"),
                    quality_score=model_data.get("quality_score")
                ))
        
        return result
    
    async def delete_model(self, model_id: str) -> bool:
        """
        Delete a voice model
        
        Args:
            model_id: ID of the voice model
            
        Returns:
            True if deleted, False if not found
        """
        if model_id not in self.metadata["models"]:
            return False
        
        # Remove directory
        model_dir = os.path.join(self.models_dir, model_id)
        if os.path.exists(model_dir):
            shutil.rmtree(model_dir)
        
        # Remove from metadata
        del self.metadata["models"][model_id]
        self._save_metadata()
        
        return True

# No longer needed since we use datetime directly in the create_model function