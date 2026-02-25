// src/services/LipSyncService.ts
/**
 * LipSyncService - Handles lip sync generation using external API
 */
import { apiManager } from '../api/APIManager';
import { AnimationData, AvatarModel, SyncConfig } from '../models/interfaces';

class LipSyncService {
  private apiManager = apiManager;
  private avatarModels: Map<string, AvatarModel> = new Map();
  private syncConfig: SyncConfig;

  constructor() {
    this.syncConfig = {
      quality: 'medium',
      renderEngine: 'default',
      format: 'blendshapes'
    };
  }

  /**
   * Initialize the lip sync service
   */
  public initialize(config: SyncConfig): void {
    this.syncConfig = {
      quality: config.quality || 'medium',
      renderEngine: config.renderEngine || 'default',
      format: config.format || 'blendshapes'
    };
    
    // Register available avatar models
    this.registerDefaultModels();
    
    console.log('LipSync Service initialized');
  }

  /**
   * Generate lip sync animation from audio
   */
  public async generateLipSync(audio: ArrayBuffer, avatarId: string): Promise<AnimationData> {
    try {
      // Get avatar model
      const avatarModel = this.avatarModels.get(avatarId);
      if (!avatarModel) {
        throw new Error(`Avatar model not found for ID: ${avatarId}`);
      }

      // In a real implementation, we would call the SyncLabs API here
      // For now, we'll simulate with a mock implementation
      const mockAnimationData = this.generateMockLipSync(audio, avatarModel);
      
      return mockAnimationData;
    } catch (error) {
      console.error('Error generating lip sync:', error);
      // Return empty animation data as fallback
      return {
        blendshapes: [],
        timing: []
      };
    }
  }

  /**
   * Stream lip sync animation for real-time playback
   */
  public async streamLipSync(audioStream: ReadableStream, avatarId: string): Promise<ReadableStream<AnimationData>> {
    try {
      // Get avatar model
      const avatarModel = this.avatarModels.get(avatarId);
      if (!avatarModel) {
        throw new Error(`Avatar model not found for ID: ${avatarId}`);
      }

      // In a real implementation, we would call the SyncLabs API here
      // For now, we'll create a mock streaming implementation
      return this.createMockAnimationStream(audioStream, avatarModel);
    } catch (error) {
      console.error('Error streaming lip sync:', error);
      throw new Error(`Failed to stream lip sync: ${error}`);
    }
  }

  /**
   * Register an avatar model for lip syncing
   */
  public registerAvatarModel(model: AvatarModel): void {
    this.avatarModels.set(model.id, model);
  }

  /**
   * Get all registered avatar models
   */
  public getAvatarModels(): AvatarModel[] {
    return Array.from(this.avatarModels.values());
  }

  /**
   * Register default avatar models
   */
  private registerDefaultModels(): void {
    // Register some default models
    this.registerAvatarModel({
      id: 'default-male',
      url: '/models/default-male.glb',
      previewUrl: '/previews/default-male.png',
      supportedBlendshapes: [
        'browDownLeft', 'browDownRight', 'browInnerUp', 'browOuterUpLeft', 'browOuterUpRight',
        'cheekPuff', 'cheekSquintLeft', 'cheekSquintRight',
        'eyeBlinkLeft', 'eyeBlinkRight', 'eyeLookDownLeft', 'eyeLookDownRight',
        'eyeLookInLeft', 'eyeLookInRight', 'eyeLookOutLeft', 'eyeLookOutRight',
        'eyeLookUpLeft', 'eyeLookUpRight', 'eyeSquintLeft', 'eyeSquintRight',
        'eyeWideLeft', 'eyeWideRight',
        'jawForward', 'jawLeft', 'jawOpen', 'jawRight',
        'mouthClose', 'mouthDimpleLeft', 'mouthDimpleRight', 'mouthFrownLeft', 'mouthFrownRight',
        'mouthFunnel', 'mouthLeft', 'mouthLowerDownLeft', 'mouthLowerDownRight',
        'mouthPressLeft', 'mouthPressRight', 'mouthPucker', 'mouthRight', 'mouthRollLower',
        'mouthRollUpper', 'mouthShrugLower', 'mouthShrugUpper', 'mouthSmileLeft',
        'mouthSmileRight', 'mouthStretchLeft', 'mouthStretchRight', 'mouthUpperUpLeft',
        'mouthUpperUpRight', 'noseSneerLeft', 'noseSneerRight'
      ]
    });

    this.registerAvatarModel({
      id: 'default-female',
      url: '/models/default-female.glb',
      previewUrl: '/previews/default-female.png',
      supportedBlendshapes: [
        'browDownLeft', 'browDownRight', 'browInnerUp', 'browOuterUpLeft', 'browOuterUpRight',
        'cheekPuff', 'cheekSquintLeft', 'cheekSquintRight',
        'eyeBlinkLeft', 'eyeBlinkRight', 'eyeLookDownLeft', 'eyeLookDownRight',
        'eyeLookInLeft', 'eyeLookInRight', 'eyeLookOutLeft', 'eyeLookOutRight',
        'eyeLookUpLeft', 'eyeLookUpRight', 'eyeSquintLeft', 'eyeSquintRight',
        'eyeWideLeft', 'eyeWideRight',
        'jawForward', 'jawLeft', 'jawOpen', 'jawRight',
        'mouthClose', 'mouthDimpleLeft', 'mouthDimpleRight', 'mouthFrownLeft', 'mouthFrownRight',
        'mouthFunnel', 'mouthLeft', 'mouthLowerDownLeft', 'mouthLowerDownRight',
        'mouthPressLeft', 'mouthPressRight', 'mouthPucker', 'mouthRight', 'mouthRollLower',
        'mouthRollUpper', 'mouthShrugLower', 'mouthShrugUpper', 'mouthSmileLeft',
        'mouthSmileRight', 'mouthStretchLeft', 'mouthStretchRight', 'mouthUpperUpLeft',
        'mouthUpperUpRight', 'noseSneerLeft', 'noseSneerRight'
      ]
    });

    this.registerAvatarModel({
      id: 'stylized-character',
      url: '/models/stylized-character.glb',
      previewUrl: '/previews/stylized-character.png',
      supportedBlendshapes: [
        'eyeBlinkLeft', 'eyeBlinkRight', 'jawOpen', 'mouthClose', 'mouthOpen',
        'mouthSmile', 'mouthFrown', 'eyebrowUp', 'eyebrowDown'
      ]
    });
  }

  /**
   * Generate mock lip sync data for testing
   */
  private generateMockLipSync(audio: ArrayBuffer, model: AvatarModel): AnimationData {
    // Estimate audio duration (rough approximation)
    const audioBytes = audio.byteLength;
    const estimatedDurationMs = audioBytes / 16; // Very crude approximation
    
    // Generate frames at 30fps
    const frameCount = Math.ceil(estimatedDurationMs / 33.33);
    const blendshapes: Record<string, number>[] = [];
    const timing: number[] = [];
    
    // Generate random lip movement patterns
    const visemes = ['mouthOpen', 'mouthClose', 'mouthSmileLeft', 'mouthSmileRight', 'jawOpen'];
    let lastViseme = 'mouthClose';
    
    for (let i = 0; i < frameCount; i++) {
      const timeMs = i * 33.33;
      timing.push(timeMs);
      
      // Random viseme changes with some continuity
      if (Math.random() < 0.2) {
        lastViseme = visemes[Math.floor(Math.random() * visemes.length)];
      }
      
      // Create blendshape values for this frame
      const frame: Record<string, number> = {};
      
      model.supportedBlendshapes.forEach(shape => {
        if (shape === lastViseme) {
          frame[shape] = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
        } else if (shape.includes('mouth') || shape.includes('jaw')) {
          frame[shape] = Math.random() * 0.3; // Random small mouth movements
        } else if (shape.includes('eye') && Math.random() < 0.05) {
          frame[shape] = Math.random() * 0.9; // Random blinks
        } else {
          frame[shape] = Math.random() * 0.1; // Small random movements for other shapes
        }
      });
      
      blendshapes.push(frame);
    }
    
    return {
      blendshapes,
      timing
    };
  }

  /**
   * Create a mock animation stream
   */
  private createMockAnimationStream(audioStream: ReadableStream, model: AvatarModel): ReadableStream<AnimationData> {
    return new ReadableStream({
      start(controller) {
        // Process the audio stream
        const reader = audioStream.getReader();
        let frameCount = 0;
        
        const processChunk = async () => {
          try {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              return;
            }
            
            // Generate a frame every ~100ms
            if (frameCount % 3 === 0) {
              const frame: Record<string, number> = {};
              
              // Simple random animation for mock purposes
              model.supportedBlendshapes.forEach(shape => {
                if (shape === 'mouthOpen' || shape === 'jawOpen') {
                  // Make these alternate to simulate talking
                  const talkValue = Math.sin(frameCount * 0.2) * 0.5 + 0.5;
                  frame[shape] = talkValue;
                } else if (shape.includes('eye') && Math.random() < 0.03) {
                  frame[shape] = 0.9; // Occasional blink
                } else if (shape.includes('mouth')) {
                  frame[shape] = Math.random() * 0.3; // Small mouth movements
                } else {
                  frame[shape] = Math.random() * 0.1; // Small random movements
                }
              });
              
              const animationFrame: AnimationData = {
                blendshapes: [frame],
                timing: [frameCount * 33.33] // milliseconds
              };
              
              controller.enqueue(animationFrame);
            }
            
            frameCount++;
            processChunk();
          } catch (error) {
            controller.error(error);
          }
        };
        
        processChunk();
      }
    });
  }
}

// Export singleton instance
export const lipSyncService = new LipSyncService();