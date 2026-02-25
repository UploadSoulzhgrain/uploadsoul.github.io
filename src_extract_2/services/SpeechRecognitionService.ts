// src/services/SpeechRecognitionService.ts
/**
 * SpeechRecognitionService - Handles speech recognition using Whisper API
 */
import { apiManager } from '../api/APIManager';
import { RecognitionConfig } from '../models/interfaces';

class SpeechRecognitionService {
  private apiManager = apiManager;
  private recognitionConfig: RecognitionConfig = {
    language: 'auto',
    model: 'whisper-1',
    options: {
      vadSensitivity: 0.5,
      filterProfanity: false
    }
  };
  private isListening: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  /**
   * Initialize the speech recognition service
   */
  public initialize(config: RecognitionConfig): void {
    this.recognitionConfig = {
      language: config.language || 'auto',
      model: config.model || 'whisper-1',
      options: {
        vadSensitivity: config.options?.vadSensitivity || 0.5,
        filterProfanity: config.options?.filterProfanity || false
      }
    };
    console.log('Speech Recognition Service initialized');
  }

  /**
   * Start listening for speech input
   */
  public async startListening(): Promise<void> {
    if (this.isListening) {
      console.warn('Already listening for speech input');
      return;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start(1000); // Collect data in 1-second chunks
      this.isListening = true;
      
      console.log('Started listening for speech input');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      throw new Error(`Failed to start speech recognition: ${error}`);
    }
  }

  /**
   * Stop listening and transcribe the recorded audio
   */
  public async stopListening(): Promise<string> {
    if (!this.isListening || !this.mediaRecorder) {
      console.warn('Not currently listening for speech input');
      return '';
    }

    return new Promise((resolve, reject) => {
      // Set up event handler for when recording stops
      this.mediaRecorder!.onstop = async () => {
        try {
          // Create audio blob from chunks
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          
          // If no audio was recorded
          if (audioBlob.size === 0) {
            this.isListening = false;
            resolve('');
            return;
          }

          // Transcribe the audio using Whisper API
          const transcription = await this.transcribeAudio(audioBlob);
          this.isListening = false;
          resolve(transcription);
        } catch (error) {
          this.isListening = false;
          reject(error);
        }
      };

      // Stop the media recorder
      this.mediaRecorder!.stop();
      
      // Stop all audio tracks
      this.mediaRecorder!.stream.getTracks().forEach(track => track.stop());
      this.mediaRecorder = null;
    });
  }

  /**
   * Toggle listening state
   */
  public async toggleListening(): Promise<void> {
    if (this.isListening) {
      await this.stopListening();
    } else {
      await this.startListening();
    }
  }

  /**
   * Transcribe audio blob using Whisper API
   */
  private async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Convert blob to File
      const audioFile = new File([audioBlob], 'recording.webm', { 
        type: 'audio/webm' 
      });

      // Create form data for API request
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', this.recognitionConfig.model || 'whisper-1');
      
      if (this.recognitionConfig.language && this.recognitionConfig.language !== 'auto') {
        formData.append('language', this.recognitionConfig.language);
      }

      // Call OpenAI Whisper API via our API manager
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Whisper API error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error(`Failed to transcribe audio: ${error}`);
    }
  }

  /**
   * Get current listening state
   */
  public getListeningState(): boolean {
    return this.isListening;
  }
}

// Export singleton instance
export const speechRecognitionService = new SpeechRecognitionService();