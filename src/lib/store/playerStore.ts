/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AudioTrack, audioPlayer } from "@/src/lib/audio/player";
import { supabase } from "@/src/lib/supabase/client";
import { HindiSong, hindiSongs } from "@/src/data/hindiSongs";
/* -------------------------------- TYPES -------------------------------- */
const convertHindiSongToLibraryTrack = (song: HindiSong): LibraryTrack => ({
  id: `hindi-${song.id}`,
  title: song.title,
  artist: song.artist,
  url: song.audioUrl, // This should be "/audio/music/tum-hi-ho.mp3"
  duration: song.duration,
  coverUrl: song.coverUrl,
  genre: song.genre[0], // Take first genre
  source: "library",
  language: song.language.toLowerCase() as "hindi" | "english" | "other",
  mood: song.mood,
  year: song.year,
  album: song.album,
});

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: AudioTrack[];
  coverUrl?: string;
  createdAt: Date;
}

export interface StudioMix {
  id: string;
  name: string;
  bpm: number;
  gridData: Record<string, boolean[]>;
  createdAt: Date;
}

export type LibraryTrack = {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
  genre?: string;
  source: "online" | "local" | "library";
  language?: "hindi" | "english" | "other";
  mood?: string[];
  year?: number;
  album?: string;
};

export interface AppState {
  /* ---------------- PLAYER ---------------- */
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: AudioTrack[];
  repeat: "none" | "one" | "all";
  shuffle: boolean;
  playbackList: AudioTrack[];
  playbackIndex: number;

  /* ---------------- LIBRARY ---------------- */
  libraryTracks: LibraryTrack[];
  playlists: Playlist[];
  likedTracks: AudioTrack[];
  recentTracks: AudioTrack[];
  mixes: StudioMix[];

  /* ---------------- UI ---------------- */
  sidebarOpen: boolean;
  currentView: "home" | "library" | "search" | "studio";
  selectedCategory: string;
  selectedLanguage: "all" | "hindi" | "english";
  isLoading: boolean;

  /* ---------------- ACTIONS ---------------- */
  fetchLibrary: () => Promise<void>;

  setCurrentTrack: (track: AudioTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;

  addToQueue: (track: AudioTrack) => void;
  clearQueue: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setPlaybackListState: (tracks: AudioTrack[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;

  /* Library actions */
  addToLibrary: (track: LibraryTrack) => void;
  removeFromLibrary: (id: string) => void;

  createPlaylist: (name: string, description?: string) => Promise<void>;
  addToPlaylist: (playlistId: string, track: AudioTrack) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  toggleLikeTrack: (track: AudioTrack) => void;

  /* UI actions */
  toggleSidebar: () => void;
  setCurrentView: (view: AppState["currentView"]) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedLanguage: (language: "all" | "hindi" | "english") => void;

  /* Studio */
  saveMix: (mix: StudioMix) => void;
  deleteMix: (id: string) => void;

  /* Hindi Songs Actions */
  getHindiSongs: () => LibraryTrack[];
  getEnglishSongs: () => LibraryTrack[];
  searchSongs: (query: string) => LibraryTrack[];
  filterSongsByGenre: (genre: string) => LibraryTrack[];
  filterSongsByMood: (mood: string) => LibraryTrack[];
  filterSongsByYear: (year: number) => LibraryTrack[];
  getTopHindiSongs: (limit?: number) => LibraryTrack[];
  getNewReleases: () => LibraryTrack[];

  playTrack: (track: LibraryTrack) => void;
  toggleLike: (id: string) => void;
}

/* ---------------- INITIAL PUBLIC TRACKS (INCLUDING HINDI SONGS) ---------------- */
const HINDI_LIBRARY_FROM_LOCAL: LibraryTrack[] = hindiSongs.map(
  convertHindiSongToLibraryTrack,
);

const INITIAL_LIBRARY: LibraryTrack[] = [
  {
    id: "seed-1",
    title: "Coffee Break",
    artist: "Lofi Dreamer",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 168,
    coverUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    genre: "chill",
    source: "online",
    language: "english",
    mood: ["relaxing", "calm"],
  },
  {
    id: "seed-2",
    title: "Midnight Walk",
    artist: "Ambient Collective",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 195,
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    genre: "chill",
    source: "online",
    language: "english",
    mood: ["relaxing", "peaceful"],
  },
  {
    id: "seed-3",
    title: "Digital Dreams",
    artist: "Synth Wave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 262,
    coverUrl:
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
    genre: "electronic",
    source: "online",
    language: "english",
    mood: ["energetic", "futuristic"],
  },
];

/* ---------------- STORE ---------------- */

export const usePlayerStore = create<AppState>()(
  persist(
    (set, get) => ({
      /* PLAYER */
      currentTrack: null,
      isPlaying: false,
      volume: 70,
      progress: 0,
      queue: [],
      repeat: "none",
      shuffle: false,
      playbackList: [],
      playbackIndex: -1,

      /* LIBRARY */
      libraryTracks: [...INITIAL_LIBRARY, ...HINDI_LIBRARY_FROM_LOCAL],
      playlists: [],
      likedTracks: [],
      recentTracks: [],
      mixes: [],

      /* UI */
      sidebarOpen: false,
      currentView: "home",
      selectedCategory: "all",
      selectedLanguage: "all",
      isLoading: false,

      /* ---------------- CORE ACTIONS ---------------- */

      setCurrentTrack: track => set({ currentTrack: track }),
      setIsPlaying: isPlaying => set({ isPlaying }),
      setVolume: volume => set({ volume }),
      setProgress: progress => set({ progress }),

      addToQueue: track => set(state => ({ queue: [...state.queue, track] })),

      clearQueue: () => set({ queue: [] }),

      toggleRepeat: () => {
        const state = get();
        const newRepeat =
          state.repeat === "none"
            ? "one"
            : state.repeat === "one"
              ? "all"
              : "none";
        audioPlayer.setRepeatMode(newRepeat);
        set({ repeat: newRepeat });
      },

      toggleShuffle: () => {
        const newShuffle = !get().shuffle;
        audioPlayer.setShuffleMode(newShuffle);
        set({ shuffle: newShuffle });
      },

      setPlaybackListState: (tracks, index) => {
        set({ playbackList: tracks, playbackIndex: index });
        audioPlayer.setPlaybackList(tracks, index);
      },

      playNext: () => {
        const nextTrack = audioPlayer.next();
        if (nextTrack) {
          set({
            currentTrack: nextTrack,
            isPlaying: true,
            playbackIndex: audioPlayer.getCurrentIndex(),
          });
        }
      },

      playPrevious: () => {
        const prevTrack = audioPlayer.previous();
        if (prevTrack) {
          set({
            currentTrack: prevTrack,
            isPlaying: true,
            playbackIndex: audioPlayer.getCurrentIndex(),
          });
        }
      },

      /* ---------------- PLAYER ACTIONS ---------------- */

      playTrack: (track: LibraryTrack) => {
        const audioTrack = convertToAudioTrack(track);
        set({ currentTrack: audioTrack, isPlaying: true });
        // You might want to integrate with your audioPlayer here
      },

      toggleLike: (id: string) => {
        const track = get().libraryTracks.find(t => t.id === id);
        if (track) {
          const audioTrack = convertToAudioTrack(track);
          const exists = get().likedTracks.some(t => t.id === id);
          set(state => ({
            likedTracks: exists
              ? state.likedTracks.filter(t => t.id !== id)
              : [...state.likedTracks, audioTrack],
          }));
        }
      },

      /* ---------------- LIBRARY ACTIONS ---------------- */

      addToLibrary: track =>
        set(state => {
          if (state.libraryTracks.some(t => t.id === track.id)) return state;
          return { libraryTracks: [track, ...state.libraryTracks] };
        }),

      removeFromLibrary: id =>
        set(state => ({
          libraryTracks: state.libraryTracks.filter(t => t.id !== id),
        })),

      toggleLikeTrack: track =>
        set(state => {
          const exists = state.likedTracks.some(t => t.id === track.id);
          return {
            likedTracks: exists
              ? state.likedTracks.filter(t => t.id !== track.id)
              : [...state.likedTracks, track],
          };
        }),

      /* ---------------- PLAYLISTS ---------------- */

      createPlaylist: async (name, description) => {
        const tempId = Date.now().toString();

        const optimistic: Playlist = {
          id: tempId,
          name,
          description,
          tracks: [],
          createdAt: new Date(),
        };

        set(state => ({ playlists: [...state.playlists, optimistic] }));

        if (!supabase) return;

        const { data, error } = await supabase
          .from("playlists")
          .insert({ name, description })
          .select()
          .single();

        if (!error && data) {
          set(state => ({
            playlists: state.playlists.map(p =>
              p.id === tempId ? { ...p, id: data.id } : p,
            ),
          }));
        }
      },

      addToPlaylist: (playlistId, track) =>
        set(state => ({
          playlists: state.playlists.map(p =>
            p.id === playlistId ? { ...p, tracks: [...p.tracks, track] } : p,
          ),
        })),

      removeFromPlaylist: (playlistId, trackId) =>
        set(state => ({
          playlists: state.playlists.map(p =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.filter(t => t.id !== trackId) }
              : p,
          ),
        })),

      deletePlaylist: playlistId =>
        set(state => ({
          playlists: state.playlists.filter(p => p.id !== playlistId),
        })),

      /* ---------------- UI ---------------- */

      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

      setCurrentView: view => set({ currentView: view }),

      setSelectedCategory: category => set({ selectedCategory: category }),

      setSelectedLanguage: language => set({ selectedLanguage: language }),

      /* ---------------- STUDIO ---------------- */

      saveMix: mix => set(state => ({ mixes: [...state.mixes, mix] })),

      deleteMix: id =>
        set(state => ({
          mixes: state.mixes.filter(m => m.id !== id),
        })),

      /* ---------------- HINDI SONGS ACTIONS ---------------- */

      getHindiSongs: () => {
        const { libraryTracks } = get();
        return libraryTracks.filter(track => track.language === "hindi");
      },

      getEnglishSongs: () => {
        const { libraryTracks } = get();
        return libraryTracks.filter(track => track.language === "english");
      },

      searchSongs: (query: string) => {
        const { libraryTracks } = get();
        const q = query.toLowerCase();
        return libraryTracks.filter(
          track =>
            track.title.toLowerCase().includes(q) ||
            track.artist.toLowerCase().includes(q) ||
            (track.album && track.album.toLowerCase().includes(q)) ||
            (track.genre && track.genre.toLowerCase().includes(q)),
        );
      },

      filterSongsByGenre: (genre: string) => {
        const { libraryTracks } = get();
        return libraryTracks.filter(track =>
          track.genre?.toLowerCase().includes(genre.toLowerCase()),
        );
      },

      filterSongsByMood: (mood: string) => {
        const { libraryTracks } = get();
        return libraryTracks.filter(track =>
          track.mood?.some(m => m.toLowerCase().includes(mood.toLowerCase())),
        );
      },

      filterSongsByYear: (year: number) => {
        const { libraryTracks } = get();
        return libraryTracks.filter(track => track.year === year);
      },

      getTopHindiSongs: (limit = 5) => {
        const hindiSongs = get().getHindiSongs();
        return hindiSongs
          .sort((a, b) => (b.year || 0) - (a.year || 0))
          .slice(0, limit);
      },

      getNewReleases: () => {
        const { libraryTracks } = get();
        const currentYear = new Date().getFullYear();
        return libraryTracks
          .filter(track => track.year && track.year >= currentYear - 1)
          .sort((a, b) => (b.year || 0) - (a.year || 0));
      },

      /* ---------------- OPTIONAL FETCH ---------------- */

      fetchLibrary: async () => {
        set({ isLoading: true });

        try {
          if (supabase) {
            const { data: playlistData } = await supabase
              .from("playlists")
              .select("*")
              .order("created_at", { ascending: false });

            if (playlistData) {
              set(state => ({
                playlists: playlistData.map(p => ({
                  id: p.id,
                  name: p.name,
                  description: p.description,
                  tracks: p.tracks || [],
                  createdAt: new Date(p.created_at),
                })),
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching library:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "music-player-storage-v2",
      partialize: state => ({
        libraryTracks: state.libraryTracks,
        playlists: state.playlists,
        likedTracks: state.likedTracks,
        volume: state.volume,
        repeat: state.repeat,
        shuffle: state.shuffle,
        recentTracks: state.recentTracks,
        mixes: state.mixes,
      }),
    },
  ),
);

/* ---------------- HELPER FUNCTIONS ---------------- */

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function convertToAudioTrack(libraryTrack: LibraryTrack): AudioTrack {
  return {
    id: libraryTrack.id,
    title: libraryTrack.title,
    artist: libraryTrack.artist,
    url: libraryTrack.url,
    duration: libraryTrack.duration,
    coverUrl: libraryTrack.coverUrl || "",
    genre: "",
  };
}
