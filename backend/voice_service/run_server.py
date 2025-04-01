#!/usr/bin/env python
# run_server.py

import os
import logging
import uvicorn
import argparse
from dotenv import load_dotenv

# Configure argument parser
parser = argparse.ArgumentParser(description="Voice Service API Server")
parser.add_argument(
    "--host", 
    type=str, 
    default="0.0.0.0", 
    help="Host address to bind the server (default: 0.0.0.0)"
)
parser.add_argument(
    "--port", 
    type=int, 
    default=3001, 
    help="Port to bind the server (default: 3001)"
)
parser.add_argument(
    "--reload", 
    action="store_true", 
    help="Enable auto-reload for development"
)
parser.add_argument(
    "--log-level", 
    type=str, 
    default="info", 
    choices=["debug", "info", "warning", "error", "critical"],
    help="Logging level (default: info)"
)
parser.add_argument(
    "--env-file",
    type=str,
    default=".env",
    help="Path to environment file (default: .env)"
)

def main():
    # Parse arguments
    args = parser.parse_args()
    
    # Load environment variables from .env file
    env_file = args.env_file
    if os.path.exists(env_file):
        print(f"Loading environment from {env_file}")
        load_dotenv(env_file)
    
    # Setup logging
    log_level = getattr(logging, args.log_level.upper())
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    
    # Configure Uvicorn log level
    uvicorn_log_level = args.log_level.lower()
    
    # Create storage directory if it doesn't exist
    storage_dir = os.environ.get("STORAGE_DIR", "storage")
    os.makedirs(storage_dir, exist_ok=True)
    
    # Print startup info
    print(f"Starting Voice Service API on http://{args.host}:{args.port}")
    print(f"API docs will be available at http://{args.host}:{args.port}/docs")
    print(f"Log level: {args.log_level}")
    
    # Check if we're likely to run into environment setup issues
    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") and "google" in os.environ.get("STT_PROVIDER", "google"):
        print("\n⚠️  Warning: GOOGLE_APPLICATION_CREDENTIALS not set in environment")
        print("   Google Speech-to-Text service might not work correctly.\n")
    
    # Log availability of required libraries
    try:
        import google.cloud.speech
        print("✅ Google Cloud Speech library is available")
    except ImportError:
        print("❌ Google Cloud Speech library is not installed")
        
    try:
        import edge_tts
        print("✅ Edge TTS library is available")
    except ImportError:
        print("❌ Edge TTS library is not installed")
    
    try:
        from pydub import AudioSegment
        print("✅ PyDub library is available for audio preprocessing")
    except ImportError:
        print("❌ PyDub library is not installed - audio preprocessing will be limited")
    
    # Start the server
    uvicorn.run(
        "app.main:app", 
        host=args.host, 
        port=args.port,
        reload=args.reload,
        log_level=uvicorn_log_level
    )

if __name__ == "__main__":
    main()