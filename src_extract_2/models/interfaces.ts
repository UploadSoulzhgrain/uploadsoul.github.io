// src/models/interfaces.ts
/**
 * Interfaces for the Digital Avatar application
 */

// API Configuration
export interface APIConfig {
  keys: Record<string, string>;
  endpoints: Record<string, string>;
  timeouts: Record<string, number>;
}

// Speech Recognition Configuration
export interface RecognitionConfig {
  language?: string;
  model?: string;
  options?: {
    vadSensitivity?: number;
    filterProfanity?: boolean;
  };
}

// Dialogue Model Configuration
export interface ModelConfig {
  primaryModel: string; // e.g., 'gpt-4'
  fallbackModel: string; // e.g., 'gpt-3.5-turbo'
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

// Speech Synthesis Configuration
export interface SynthesisConfig {
  defaultVoiceId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
}

// Lip Sync Configuration
export interface SyncConfig {
  quality: 'high' | 'medium' | 'low';
  renderEngine: string;
  format: 'json' | 'blendshapes';
}

// Memory Configuration
export interface MemoryConfig {
  vectorDb: string;
  embeddingModel: string;
  maxMemories: number;
  relevanceThreshold: number;
}

// Avatar Configuration
export interface AvatarConfig {
  modelUrl: string;
  textureUrl?: string;
  voiceId?: string;
  personalityTraits?: Record<string, number>;
  knowledgeBase?: string[];
}

// Animation Data Structure
export interface AnimationData {
  blendshapes: Record<string, number>[];
  timing: number[];
}

// Conversation Context
export interface ConversationContext {
  history: Message[];
  relevantMemories: Memory[];
  userProfile: UserProfile;
  avatarPersonality: PersonalityConfig;
  currentTopic?: string;
  forceFallbackModel?: boolean;
}

// Message Structure
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  language: string;
}

// Memory Structure
export interface Memory {
  id: string;
  content: string;
  importance: number;
  embedding: number[];
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
}

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  preferences: UserPreferences;
  interactionHistory: InteractionSummary[];
}

// User Preferences
export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  voiceInteraction: boolean;
  avatarPreferences: Record<string, unknown>;
}

// Internationalization Configuration
export interface I18nConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  namespaces: string[];
  loadPath: string;
}

// Voice Emotion Parameters
export interface EmotionParams {
  joy?: number;
  sadness?: number;
  anger?: number;
  surprise?: number;
  emphasis?: number;
}

// Voice Information
export interface VoiceInfo {
  id: string;
  name: string;
  previewUrl: string;
  languages: string[];
  gender?: 'male' | 'female' | 'neutral';
  cloned: boolean;
  ownerId?: string;
}

// Avatar Model
export interface AvatarModel {
  id: string;
  url: string;
  previewUrl: string;
  supportedBlendshapes: string[];
}

// Storage Service Interface
export interface StorageService {
  set(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
  delete(key: string): Promise<boolean>;
  query(filters: Record<string, any>): Promise<any[]>;
}

// Vector Service Interface
export interface VectorService {
  addVector(id: string, vector: number[], metadata?: any): Promise<void>;
  searchVector(vector: number[], limit?: number): Promise<{id: string, score: number}[]>;
  updateVector(id: string, vector: number[]): Promise<boolean>;
  deleteVector(id: string): Promise<boolean>;
}

// Personality Configuration
export interface PersonalityConfig {
  traits: Record<string, number>;
  background: string;
  interests: string[];
  communication: {
    formality: number;
    humor: number;
    empathy: number;
  };
}

// Interaction Summary for User History
export interface InteractionSummary {
  date: number;
  durationMs: number;
  topicsDiscussed: string[];
  sentimentScore: number;
  messagesCount: number;
}

// Response Type from Conversation Manager
export interface Response {
  text: string;
  audio?: AudioBuffer;
  animation?: AnimationData;
}

// Avatar Data Structure
export interface AvatarData {
  id: string;
  name: string;
  model: AvatarModel;
  voiceId: string;
  personality: PersonalityConfig;
  createdAt: number;
  lastUsed: number;
  usageCount: number;
}