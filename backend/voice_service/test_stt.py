#!/usr/bin/env python
# test_stt.py

import asyncio
import os
import time
import argparse
import logging
from dotenv import load_dotenv
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

async def test_google_stt_service():
    """Test the Google STT service integration"""
    try:
        # First, load environment variables
        load_dotenv()
        
        # Import after loading environment variables to ensure they're available
        from app.services.google_stt_service import GoogleSTTService
        from app.services.service_adapter import ServiceAdapter
        from app.services.service_factory import ServiceFactory, ServiceManager
        
        print("\n=== Testing Google STT Service Integration ===\n")
        
        # Check if Google credentials are set
        google_creds = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        if not google_creds:
            print("⚠️  Warning: GOOGLE_APPLICATION_CREDENTIALS environment variable not set")
            print("   Please set it to the path of your Google credentials JSON file")
            print("   Example: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json\n")
        else:
            print(f"✅ Google credentials found at: {google_creds}\n")
        
        # Test direct GoogleSTTService
        print("1. Testing direct GoogleSTTService implementation...")
        google_stt = GoogleSTTService()
        is_available = await google_stt.test_connection()
        if is_available:
            print("✅ Google STT Service connection successful")
        else:
            print("❌ Google STT Service connection failed")
        
        # Test ServiceAdapter with GoogleSTTService
        print("\n2. Testing ServiceAdapter with GoogleSTTService...")
        service_adapter = ServiceAdapter(
            primary_provider="google",
            failover_providers=["whisper"],  # This is for demonstration only
            failover_strategy="availability",
            auto_restore=True
        )
        await service_adapter.start()
        
        active_provider = service_adapter.get_active_provider()
        print(f"✅ Service adapter initialized with active provider: {active_provider}")
        
        status = service_adapter.get_provider_status()
        print(f"✅ Provider statuses: {status}")
        
        # Test ServiceManager with ServiceAdapter
        print("\n3. Testing ServiceManager with ServiceAdapter...")
        service_manager = await ServiceFactory.create_voice_service()
        active_name = service_manager.get_active_service_name()
        status_info = service_manager.get_status()
        
        print(f"✅ Service Manager initialized with active provider: {active_name}")
        print("✅ Overall service status:", status_info.get("overall_status"))
        
        # Test transcription with a sample file
        print("\n4. Testing transcription functionality...")
        sample_file = None
        
        # Look for a sample audio file
        storage_dir = Path(os.environ.get("STORAGE_DIR", "storage"))
        if storage_dir.exists():
            audio_files = list(storage_dir.glob("**/*.wav"))
            if audio_files:
                sample_file = str(audio_files[0])
                print(f"Found sample audio file: {sample_file}")
        
        if not sample_file:
            print("⚠️  No sample audio files found in storage directory")
            print("   Skipping transcription test")
        else:
            print(f"Testing transcription with file: {sample_file}")
            result = await service_manager.transcribe(sample_file, "zh-CN")
            
            if result.get("success"):
                print(f"✅ Transcription successful: {result.get('text')}")
                print(f"   Confidence: {result.get('confidence')}")
                print(f"   Provider: {result.get('provider')}")
                if result.get('audioQuality'):
                    print(f"   Audio quality issues: {result.get('audioQuality').get('issues', [])}")
            else:
                print(f"❌ Transcription failed: {result.get('error', {}).get('message')}")
        
        print("\n=== Test Completed ===\n")
        
    except Exception as e:
        logger.exception(f"Error testing Google STT service: {e}")
        print(f"\n❌ Test failed with error: {e}")

async def main():
    parser = argparse.ArgumentParser(description="Test Google STT Service integration")
    parser.add_argument("--env-file", type=str, default=".env", help="Path to .env file")
    args = parser.parse_args()
    
    # Load environment variables
    if os.path.exists(args.env_file):
        print(f"Loading environment from {args.env_file}")
        load_dotenv(args.env_file)
    
    await test_google_stt_service()

if __name__ == "__main__":
    asyncio.run(main())