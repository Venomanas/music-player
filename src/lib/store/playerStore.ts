/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AudioTrack } from "@/src/lib/audio/player";
import { supabase } from "@/src/lib/supabase/client";

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
export interface StudioMix {
  id: string;
  name: string;
  bpm: number;
  gridData: Record<string, boolean[]>; // The sequencer pattern
  createdAt: Date;
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
  mixes: StudioMix[]; // NEW: Store for saved studio beats

  // UI state
  sidebarOpen: boolean;
  currentView: "home" | "library" | "search" | "studio";
  selectedCategory: string;

  // NEW: Loading state
  isLoading: boolean;
  fetchLibrary: () => Promise<void>;
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

  saveMix: (mix: StudioMix) => void;
  deleteMix: (id: string) => void;
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
    set => {
      return {
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
        isLoading: false,
        mixes: [],

        // --- NEW: Fetch Real Data ---
        fetchLibrary: async () => {
          set({ isLoading: true });

          // Guard: ensure supabase client is available
          if (!supabase) {
            console.error("Supabase client not initialized");
            set({ isLoading: false });
            return;
          }

          // 1. Fetch Songs for the "Home" view
          const { data: songs, error: songError } = await supabase
            .from("songs")
            .select("*")
            .limit(20);

          if (songError) console.error("Error fetching songs:", songError);

          // 2. Fetch User Playlists (if logged in)
          // Note: You need to handle auth user checking in a real app component
          // For now, we just fetch what's available or public

          // Map DB structure to App structure
          const mappedSongs: AudioTrack[] = (songs || []).map(song => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            url: song.url,
            duration: song.duration || 0,
            coverUrl: song.cover_url || "/default-cover.jpg",
            genre: song.genre || "unknown",
          }));

          set({
            // If you want to replace the hardcoded "initialTracks" with DB data:
            // recentTracks: mappedSongs.slice(0, 5),
            isLoading: false,
          });
        },

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

        // Updated Create Playlist (Optimistic UI + DB Insert)
                createPlaylist: async (name, description) => {
                  // 1. Optimistic Update
                  const tempId = Date.now().toString();
                  const newPlaylist = {
                    id: tempId,
                    name,
                    description,
                    tracks: [],
                    createdAt: new Date(),
                  };
        
                  set(state => ({ playlists: [...state.playlists, newPlaylist] }));
        
                  // 2. DB Insert
                  if (!supabase) {
                    console.error("Supabase client not initialized");
                    return;
                  }
        
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();
                  if (!user) return; // Guard clause if not logged in
        
                  const { data, error } = await supabase
                    .from("playlists")
                    .insert({ user_id: user.id, name, description })
                    .select()
                    .single();
        
                  if (error) {
                    console.error("Failed to create playlist:", error);
                    // Revert state if needed
                  } else if (data) {
                    // Update the temporary ID with real DB ID
                    set(state => ({
                      playlists: state.playlists.map(p =>
                        p.id === tempId ? { ...p, id: data.id } : p
                      ),
                    }));
                  }
                },

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

        toggleSidebar: () =>
          set(state => ({ sidebarOpen: !state.sidebarOpen })),

        setCurrentView: view => set({ currentView: view }),
        setSelectedCategory: category => set({ selectedCategory: category }),

        saveMix: mix =>
          set(state => ({
            mixes: [...state.mixes, mix],
          })),

        deleteMix: id =>
          set(state => ({
            mixes: state.mixes.filter(m => m.id !== id),
          })),
      };
    },
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
