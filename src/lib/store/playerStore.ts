import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AudioTrack } from "@/src/lib/audio/player";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: AudioTrack[];
  coverUrl?: string;
  createdAt: Date;
}
export interface AudioTracks {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl: string;
  genre: string; // Changed from optional to required
  bpm?: number;
}

export interface AppState {
  // Player state
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: AudioTrack[];
  repeat: "none" | "one" | "all";
  shuffle: boolean;

  // Library state
  playlists: Playlist[];
  likedTracks: AudioTrack[];
  recentTracks: AudioTrack[];

  // UI state
  sidebarOpen: boolean;
  currentView: "home" | "library" | "search" | "studio";
  selectedCategory: string;

  // Actions
  setCurrentTrack: (track: AudioTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  addToQueue: (track: AudioTrack) => void;
  clearQueue: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;

  // Library actions
  createPlaylist: (name: string, description?: string) => void;
  addToPlaylist: (playlistId: string, track: AudioTrack) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  toggleLikeTrack: (track: AudioTrack) => void;

  // UI actions
  toggleSidebar: () => void;
  setCurrentView: (view: "home" | "library" | "search" | "studio") => void;
  setSelectedCategory: (category: string) => void;
}

const initialTracks: AudioTrack[] = [
  {
    id: "1",
    title: "Coffee Break",
    artist: "Lofi Dreamer",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 168,
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    genre: "chill",
    bpm: 85,
  },
  {
    id: "2",
    title: "Midnight Walk",
    artist: "Ambient Collective",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 195,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    genre: "chill",
    bpm: 90,
  },
  {
    id: "3",
    title: "Digital Dreams",
    artist: "Synth Wave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 262,
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89",
    genre: "electronic",
    bpm: 120,
  },
  {
    id: "4",
    title: "Neon Pulse",
    artist: "Cyber Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 225,
    coverUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04",
    genre: "electronic",
    bpm: 128,
  },
  {
    id: "5",
    title: "Morning Coffee",
    artist: "Acoustic Sessions",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: 210,
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
    genre: "acoustic",
    bpm: 100,
  },
];

export const usePlayerStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      currentTrack: null,
      isPlaying: false,
      volume: 70,
      progress: 0,
      queue: [],
      repeat: "none",
      shuffle: false,

      playlists: [],
      likedTracks: [],
      recentTracks: initialTracks.slice(0, 3),

      sidebarOpen: false,
      currentView: "home",
      selectedCategory: "all",

      // Actions
      setCurrentTrack: track => set({ currentTrack: track }),
      setIsPlaying: isPlaying => set({ isPlaying }),
      setVolume: volume => set({ volume }),
      setProgress: progress => set({ progress }),

      addToQueue: track => set(state => ({ queue: [...state.queue, track] })),

      clearQueue: () => set({ queue: [] }),

      toggleRepeat: () =>
        set(state => ({
          repeat:
            state.repeat === "none"
              ? "one"
              : state.repeat === "one"
              ? "all"
              : "none",
        })),

      toggleShuffle: () => set(state => ({ shuffle: !state.shuffle })),

      createPlaylist: (name, description) =>
        set(state => ({
          playlists: [
            ...state.playlists,
            {
              id: Date.now().toString(),
              name,
              description,
              tracks: [],
              createdAt: new Date(),
            },
          ],
        })),

      addToPlaylist: (playlistId, track) =>
        set(state => ({
          playlists: state.playlists.map(playlist =>
            playlist.id === playlistId
              ? { ...playlist, tracks: [...playlist.tracks, track] }
              : playlist
          ),
        })),

      removeFromPlaylist: (playlistId, trackId) =>
        set(state => ({
          playlists: state.playlists.map(playlist =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  tracks: playlist.tracks.filter(t => t.id !== trackId),
                }
              : playlist
          ),
        })),

      deletePlaylist: playlistId =>
        set(state => ({
          playlists: state.playlists.filter(p => p.id !== playlistId),
        })),

      toggleLikeTrack: track =>
        set(state => {
          const isLiked = state.likedTracks.some(t => t.id === track.id);
          return {
            likedTracks: isLiked
              ? state.likedTracks.filter(t => t.id !== track.id)
              : [...state.likedTracks, track],
          };
        }),

      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

      setCurrentView: view => set({ currentView: view }),
      setSelectedCategory: category => set({ selectedCategory: category }),
    }),
    {
      name: "music-player-storage",
      partialize: state => ({
        volume: state.volume,
        repeat: state.repeat,
        shuffle: state.shuffle,
        playlists: state.playlists,
        likedTracks: state.likedTracks,
        recentTracks: state.recentTracks,
      }),
    }
  )
);
