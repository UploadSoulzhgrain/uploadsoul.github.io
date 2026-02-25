// src/services/SpeechSynthesisService.ts
/**
 * SpeechSynthesisService - Handles text-to-speech using ElevenLabs API
 */
import { apiManager } from '../api/APIManager';
import { EmotionParams, SynthesisConfig, VoiceInfo } from '../models/interfaces';

class SpeechSynthesisService {
  private apiManager = apiManager;
  private voices: Map<string, VoiceInfo> = new Map();
  private synthesisConfig: SynthesisConfig = {
    defaultVoiceId: '',
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0,
    useSpeakerBoost: true
  };

  /**
   * Initialize the speech synthesis service
   */
  public async initialize(config: SynthesisConfig): Promise<void> {
    this.synthesisConfig = {
      defaultVoiceId: config.defaultVoiceId || '',
      stability: config.stability || 0.5,
      similarityBoost: config.similarityBoost || 0.75,
      style: config.style || 0,
      useSpeakerBoost: config.useSpeakerBoost !== false
    };
    
    // Load available voices
    await this.loadVoices();
    
    console.log('Speech Synthesis Service initialized');
  }

  /**
   * Load available voices from ElevenLabs API
   */
  private async loadVoices(): Promise<void> {
    try {
      const response = await this.apiManager.callAPI('elevenlabs', '/v1/voices', {
        method: 'GET'
      });
      
      // Clear existing voices
      this.voices.clear();
      
      // Store voices in map for quick access
      if (response && response.voices) {
        response.voices.forEach((voice: any) => {
          this.voices.set(voice.voice_id, {
            id: voice.voice_id,
            name: voice.name,
            previewUrl: voice.preview_url,
            languages: voice.labels?.language || [],
            gender: voice.labels?.gender,
            cloned: voice.category === 'cloned',
            ownerId: voice.labels?.owner_id
          });
        });
      }
      
      // Set default voice ID if not already set
      if (!this.synthesisConfig.defaultVoiceId && response.voices.length > 0) {
        this.synthesisConfig.defaultVoiceId = response.voices[0].voice_id;
      }
      
      console.log(`Loaded ${this.voices.size} voices from ElevenLabs`);
    } catch (error) {
      console.error('Error loading voices:', error);
      // Continue with empty voice list
    }
  }

  /**
   * Synthesize speech from text
   */
  public async synthesizeSpeech(
    text: string, 
    voiceId?: string, 
    emotions?: EmotionParams
  ): Promise<AudioBuffer> {
    try {
      // Use specified voice ID or default
      const actualVoiceId = voiceId || this.synthesisConfig.defaultVoiceId;
      if (!actualVoiceId) {
        throw new Error('No voice ID specified and no default voice configured');
      }

      // Prepare the request body with emotion parameters if provided
      const requestBody: any = {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: this.synthesisConfig.stability,
          similarity_boost: this.synthesisConfig.similarityBoost,
          style: this.synthesisConfig.style,
          use_speaker_boost: this.synthesisConfig.useSpeakerBoost
        }
      };
      
      // Add emotion parameters if provided
      if (emotions) {
        const { joy, sadness, anger, surprise, emphasis } = emotions;
        let voiceStyle = '';
        
        if (joy !== undefined && joy > 0.5) voiceStyle += '[happy] ';
        if (sadness !== undefined && sadness > 0.5) voiceStyle += '[sad] ';
        if (anger !== undefined && anger > 0.5) voiceStyle += '[angry] ';
        if (surprise !== undefined && surprise > 0.5) voiceStyle += '[surprised] ';
        if (emphasis !== undefined && emphasis > 0.5) voiceStyle += '[emphasize] ';
        
        // Add voice style markers to the text if any emotions are specified
        if (voiceStyle) {
          requestBody.text = voiceStyle + text;
        }
      }
      
      // Call ElevenLabs API
      const audioArrayBuffer = await this.apiManager.callAPI(
        'elevenlabs', 
        `/v1/text-to-speech/${actualVoiceId}`, 
        {
          body: requestBody,
          headers: {
            'Accept': 'audio/mpeg'
          }
        }
      );
      
      // Convert array buffer to AudioBuffer
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      return await audioContext.decodeAudioData(audioArrayBuffer);
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw new Error(`Failed to synthesize speech: ${error}`);
    }
  }

  /**
   * Stream speech synthesis for real-time audio playback
   */
  public async streamSpeech(
    text: string, 
    voiceId?: string, 
    emotions?: EmotionParams
  ): Promise<ReadableStream> {
    try {
      // Use specified voice ID or default
      const actualVoiceId = voiceId || this.synthesisConfig.defaultVoiceId;
      if (!actualVoiceId) {
        throw new Error('No voice ID specified and no default voice configured');
      }

      // Prepare the request body with emotion parameters if provided
      const requestBody: any = {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: this.synthesisConfig.stability,
          similarity_boost: this.synthesisConfig.similarityBoost,
          style: this.synthesisConfig.style,
          use_speaker_boost: this.synthesisConfig.useSpeakerBoost
        },
        output_format: 'mp3_44100_128',
        stream: true
      };
      
      // Add emotion parameters if provided
      if (emotions) {
        const { joy, sadness, anger, surprise, emphasis } = emotions;
        let voiceStyle = '';
        
        if (joy !== undefined && joy > 0.5) voiceStyle += '[happy] ';
        if (sadness !== undefined && sadness > 0.5) voiceStyle += '[sad] ';
        if (anger !== undefined && anger > 0.5) voiceStyle += '[angry] ';
        if (surprise !== undefined && surprise > 0.5) voiceStyle += '[surprised] ';
        if (emphasis !== undefined && emphasis > 0.5) voiceStyle += '[emphasize] ';
        
        // Add voice style markers to the text if any emotions are specified
        if (voiceStyle) {
          requestBody.text = voiceStyle + text;
        }
      }
      
      // Call ElevenLabs API with streaming
      return await this.apiManager.streamAPI(
        'elevenlabs', 
        `/v1/text-to-speech/${actualVoiceId}/stream`, 
        {
          body: requestBody,
          headers: {
            'Accept': 'audio/mpeg'
          }
        }
      );
    } catch (error) {
      console.error('Error streaming speech:', error);
      throw new Error(`Failed to stream speech: ${error}`);
    }
  }

  /**
   * Clone a voice from audio samples
   */
  public async cloneVoice(samples: ArrayBuffer[], name: string): Promise<string> {
    try {
      // Create form data for API request
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', `Cloned voice: ${name}`);
      
      // Add audio samples
      samples.forEach((sample, index) => {
        const blob = new Blob([sample], { type: 'audio/mpeg' });
        formData.append(`files`, blob, `sample_${index}.mp3`);
      });
      
      // Call ElevenLabs API
      const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY || ''
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`ElevenLabs API error: ${JSON.stringify(error)}`);
      }
      
      const data = await response.json();
      const voiceId = data.voice_id;
      
      // Update the voices map with the new voice
      this.voices.set(voiceId, {
        id: voiceId,
        name: name,
        previewUrl: data.preview_url || '',
        languages: [],
        cloned: true,
        ownerId: 'user'
      });
      
      // Refresh voices list
      await this.loadVoices();
      
      return voiceId;
    } catch (error) {
      console.error('Error cloning voice:', error);
      throw new Error(`Failed to clone voice: ${error}`);
    }
  }

  /**
   * Get all available voices
   */
  public getVoices(): VoiceInfo[] {
    return Array.from(this.voices.values());
  }

  /**
   * Get a voice by ID
   */
  public getVoiceById(voiceId: string): VoiceInfo | undefined {
    return this.voices.get(voiceId);
  }
}

// Export singleton instance
export const speechSynthesisService = new SpeechSynthesisService();