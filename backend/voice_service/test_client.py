#!/usr/bin/env python3
"""
Test client for the Voice Service API.
This script demonstrates how to interact with the Voice Service API endpoints.
"""

import argparse
import asyncio
import json
import os
import time
import uuid
from pathlib import Path

import aiohttp
from pydub import AudioSegment
from pydub.playback import play

# Default API URL
DEFAULT_API_URL = "http://localhost:8000"


async def test_health_check(session, base_url):
    """Test the health check endpoint."""
    print("\n🔍 Testing Health Check Endpoint...")
    async with session.get(f"{base_url}/health") as response:
        data = await response.json()
        print(f"Status Code: {response.status}")
        print(f"Response: {json.dumps(data, indent=2)}")
        return response.status == 200


async def test_tts(session, base_url, text, language="en-US", voice_id=None):
    """Test the text-to-speech endpoint."""
    print(f"\n🔊 Testing Text-to-Speech Endpoint...")
    print(f"Converting text: '{text}'")
    
    data = aiohttp.FormData()
    data.add_field('text', text)
    data.add_field('language', language)
    if voice_id:
        data.add_field('voice_id', voice_id)
    
    async with session.post(f"{base_url}/voice/tts", data=data) as response:
        result = await response.json()
        print(f"Status Code: {response.status}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status == 200 and result.get('success'):
            audio_url = result.get('audioUrl')
            if audio_url:
                # Download the audio file
                full_audio_url = f"{base_url}{audio_url}"
                print(f"📥 Downloading audio from {full_audio_url}")
                
                async with session.get(full_audio_url) as audio_response:
                    if audio_response.status == 200:
                        # Save the audio file locally
                        content = await audio_response.read()
                        output_file = f"tts_output_{int(time.time())}.mp3"
                        with open(output_file, "wb") as f:
                            f.write(content)
                        print(f"💾 Saved audio to {output_file}")
                        
                        # Optionally play the audio if pydub is available
                        try:
                            print("▶️ Playing audio...")
                            audio = AudioSegment.from_file(output_file)
                            play(audio)
                        except Exception as e:
                            print(f"⚠️ Could not play audio: {e}")
        
        return response.status == 200 and result.get('success')


async def test_stt(session, base_url, audio_file_path, language="en-US"):
    """Test the speech-to-text endpoint."""
    print(f"\n🎤 Testing Speech-to-Text Endpoint...")
    print(f"Converting audio file: {audio_file_path}")
    
    if not os.path.exists(audio_file_path):
        print(f"❌ Error: Audio file not found: {audio_file_path}")
        return False
    
    data = aiohttp.FormData()
    data.add_field('audio', 
                  open(audio_file_path, 'rb'),
                  filename=os.path.basename(audio_file_path),
                  content_type='audio/wav')
    data.add_field('language', language)
    
    async with session.post(f"{base_url}/voice/stt", data=data) as response:
        result = await response.json()
        print(f"Status Code: {response.status}")
        print(f"Response: {json.dumps(result, indent=2)}")
        return response.status == 200 and result.get('success')


async def test_voice_chat(session, base_url, audio_file_path, language="en-US", voice_id=None):
    """Test the complete voice chat flow."""
    print(f"\n💬 Testing Voice Chat Endpoint...")
    print(f"Using audio file: {audio_file_path}")
    
    if not os.path.exists(audio_file_path):
        print(f"❌ Error: Audio file not found: {audio_file_path}")
        return False
    
    conversation_id = str(uuid.uuid4())
    
    data = aiohttp.FormData()
    data.add_field('audio', 
                  open(audio_file_path, 'rb'),
                  filename=os.path.basename(audio_file_path),
                  content_type='audio/wav')
    data.add_field('language', language)
    if voice_id:
        data.add_field('voice_id', voice_id)
    data.add_field('conversation_id', conversation_id)
    
    async with session.post(f"{base_url}/voice/chat", data=data) as response:
        result = await response.json()
        print(f"Status Code: {response.status}")
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status == 200 and result.get('success'):
            audio_url = result.get('audioUrl')
            if audio_url:
                # Download the audio file
                full_audio_url = f"{base_url}{audio_url}"
                print(f"📥 Downloading audio from {full_audio_url}")
                
                async with session.get(full_audio_url) as audio_response:
                    if audio_response.status == 200:
                        # Save the audio file locally
                        content = await audio_response.read()
                        output_file = f"voice_chat_output_{int(time.time())}.mp3"
                        with open(output_file, "wb") as f:
                            f.write(content)
                        print(f"💾 Saved audio to {output_file}")
                        
                        # Optionally play the audio if pydub is available
                        try:
                            print("▶️ Playing audio...")
                            audio = AudioSegment.from_file(output_file)
                            play(audio)
                        except Exception as e:
                            print(f"⚠️ Could not play audio: {e}")
        
        return response.status == 200 and result.get('success')


async def test_conversation_history(session, base_url, conversation_id):
    """Test retrieving conversation history."""
    print(f"\n📜 Testing Conversation History Endpoint...")
    print(f"Retrieving history for conversation ID: {conversation_id}")
    
    async with session.get(f"{base_url}/voice/history/{conversation_id}") as response:
        result = await response.json()
        print(f"Status Code: {response.status}")
        print(f"Response: {json.dumps(result, indent=2)}")
        return response.status == 200 and result.get('success')


async def main():
    parser = argparse.ArgumentParser(description="Test the Voice Service API")
    parser.add_argument("--api-url", default=DEFAULT_API_URL, help="Base URL for the Voice Service API")
    parser.add_argument("--audio-file", help="Path to an audio file for STT and voice chat tests")
    parser.add_argument("--text", default="Hello, this is a test message for text-to-speech conversion.", 
                      help="Text to convert to speech")
    parser.add_argument("--language", default="en-US", help="Language code (e.g., en-US, zh-CN)")
    parser.add_argument("--voice-id", help="Voice ID for TTS")
    parser.add_argument("--conversation-id", help="Conversation ID for retrieving history")
    
    args = parser.parse_args()
    
    print(f"🚀 Testing Voice Service API at {args.api_url}")
    
    async with aiohttp.ClientSession() as session:
        # Always run health check
        if not await test_health_check(session, args.api_url):
            print("❌ Health check failed! Service may not be running properly.")
            return
        
        # Test TTS
        await test_tts(session, args.api_url, args.text, args.language, args.voice_id)
        
        # Test STT and voice chat if audio file is provided
        if args.audio_file:
            await test_stt(session, args.api_url, args.audio_file, args.language)
            conversation_result = await test_voice_chat(
                session, args.api_url, args.audio_file, args.language, args.voice_id
            )
            
            # If we have a conversation ID from the response, test history retrieval
            if conversation_result and not args.conversation_id:
                # Wait for a moment to ensure the history is persisted
                await asyncio.sleep(1)
                await test_conversation_history(session, args.api_url, args.conversation_id)
        
        # Test conversation history if ID is provided
        elif args.conversation_id:
            await test_conversation_history(session, args.api_url, args.conversation_id)


if __name__ == "__main__":
    asyncio.run(main())
