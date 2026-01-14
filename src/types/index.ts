export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl: string;
  genre: string;
  bpm?: number;
  liked: boolean;
  playCount: number;
  releaseDate?: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  favoriteGenres: string[];
  createdAt: Date;
}

export interface MusicCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

// Audio and instrument types
export interface InstrumentConfig {
  volume?: number;
  attack?: number;
  release?: number;
  reverb?: number;
}

export interface AudioEffect {
  id: string;
  name: string;
  type: "reverb" | "delay" | "chorus" | "distortion" | "filter";
  parameters: Record<string, number>;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl: string;
  genre: string;
  bpm?: number;
}


export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl: string;
  genre: string; // Make it required, not optional
  bpm?: number;
  liked: boolean;
  playCount: number;
  releaseDate?: Date;
}

// App state types
export interface PlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: AudioTrack[];
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}