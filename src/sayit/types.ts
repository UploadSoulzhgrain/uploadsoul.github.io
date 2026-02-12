
export enum AppView {
  HOME = 'home',
  MEMOIR_ROOM = 'memoir_room',
  COLLECTION = 'collection',
  TIME_CAPSULE = 'time_capsule',
  SETTINGS = 'settings',
  MEMOIR_PREVIEW = 'memoir_preview',
  MOOD_TREE_HOLLOW = 'mood_tree_hollow',
  LETTER_TO_FUTURE = 'letter_to_future'
}

export interface MemorySnippet {
  id: string;
  timestamp: string;
  category: string;
  text: string;
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  daysJoined: number;
  memoryCount: number;
  avatarUrl: string;
}

export interface Chapter {
  id: string;
  title: string;
  progress: number;
  imageUrl: string;
  isCompleted: boolean;
}
