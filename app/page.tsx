"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Music,
  Home,
  Library,
  Search,
  Plus,
  Menu,
  X,
  ListMusic,
  User, // Now used in the Header
  LogOut,
} from "lucide-react";

import Image from "next/image";

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audioUrl: string;
  liked: boolean;
  genre: string;
  coverUrl: string;
}

interface User {
  email: string;
  fullName: string;
}

interface Playlist {
  id: number;
  name: string;
  trackIds: number[];
  createdAt: Date;
  coverUrl?: string;
}

const sampleTracks: Track[] = [
  {
    id: 1,
    title: "Coffee Break",
    artist: "Lofi Dreamer",
    album: "Chill Beats",
    duration: "2:48",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    liked: false,
    genre: "chill",
    coverUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Midnight Walk",
    artist: "Ambient Collective",
    album: "Night Sounds",
    duration: "3:15",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    liked: true,
    genre: "chill",
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Digital Dreams",
    artist: "Synth Wave",
    album: "Electronic Vibes",
    duration: "4:22",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    liked: false,
    genre: "electronic",
    coverUrl:
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Neon Pulse",
    artist: "Cyber Beats",
    album: "Future Sounds",
    duration: "3:45",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    liked: true,
    genre: "electronic",
    coverUrl:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Morning Coffee",
    artist: "Acoustic Sessions",
    album: "Quiet Moments",
    duration: "3:30",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    liked: false,
    genre: "acoustic",
    coverUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  },
];

const musicCategories = [
  { id: "all", name: "All Music", color: "from-purple-500 to-pink-500" },
  { id: "chill", name: "Chill & Lo-fi", color: "from-blue-500 to-teal-500" },
  { id: "electronic", name: "Electronic", color: "from-green-500 to-blue-500" },
  { id: "acoustic", name: "Acoustic", color: "from-yellow-500 to-orange-500" },
  { id: "jazz", name: "Jazz", color: "from-red-500 to-purple-500" },
];

// --- Helper Function --- //
const searchMusic = async (query: string): Promise<Track[]> => {
  if (!query.trim()) return [];
  return new Promise(resolve => {
    setTimeout(() => {
      const filtered = sampleTracks.filter(
        track =>
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase()) ||
          track.album.toLowerCase().includes(query.toLowerCase()) ||
          track.genre.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, 500);
  });
};

// --- Component --- //
export default function MusicPlayer() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [currentView, setCurrentView] = useState<"home" | "library" | "search">(
    "home"
  );

  const [tracks, setTracks] = useState<Track[]>(sampleTracks);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<
    number | null
  >(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [viewingPlaylist, setViewingPlaylist] = useState<Playlist | null>(null);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });
  const [authError, setAuthError] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Hydration Fix
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleTrackSelect = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(
      () => audioRef.current?.play().catch(() => setIsPlaying(false)),
      100
    );
  }, []);

  const handleNext = useCallback(() => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextTrack = tracks[(currentIndex + 1) % tracks.length];
    handleTrackSelect(nextTrack);
  }, [tracks, currentTrack, handleTrackSelect]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleNext);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleNext);
    };
  }, [handleNext]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Search Functionality
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        const results = await searchMusic(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (authMode === "signup") {
      if (!formData.email || !formData.password || !formData.fullName) {
        return setAuthError("Please fill in all fields");
      }
      if (formData.password !== formData.confirmPassword) {
        return setAuthError("Passwords do not match");
      }
      if (formData.password.length < 6) {
        return setAuthError("Password must be at least 6 characters");
      }
      setUser({ email: formData.email, fullName: formData.fullName });
    } else {
      if (!formData.email || !formData.password) {
        return setAuthError("Please fill in all fields");
      }
      setUser({ email: formData.email, fullName: "Music Lover" });
    }
    setIsAuthenticated(true);
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    handleTrackSelect(
      tracks[(currentIndex - 1 + tracks.length) % tracks.length]
    );
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    audioRef.current.currentTime =
      ((e.clientX - bounds.left) / bounds.width) * audioRef.current.duration;
  };

  const toggleLike = (trackId: number) => {
    setTracks(
      tracks.map(t => (t.id === trackId ? { ...t, liked: !t.liked } : t))
    );
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist: Playlist = {
      id: Date.now(),
      name: newPlaylistName,
      trackIds: [],
      createdAt: new Date(),
      coverUrl:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
    };
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    setShowCreatePlaylist(false);
  };

  const addTrackToPlaylist = (playlistId: number) => {
    if (selectedTrackForPlaylist === null) return;
    setPlaylists(
      playlists.map(p =>
        p.id === playlistId && !p.trackIds.includes(selectedTrackForPlaylist)
          ? { ...p, trackIds: [...p.trackIds, selectedTrackForPlaylist] }
          : p
      )
    );
    setShowAddToPlaylist(false);
    setSelectedTrackForPlaylist(null);
  };

  const removeTrackFromPlaylist = (playlistId: number, trackId: number) => {
    setPlaylists(
      playlists.map(p =>
        p.id === playlistId
          ? { ...p, trackIds: p.trackIds.filter(id => id !== trackId) }
          : p
      )
    );
  };

  const deletePlaylist = (playlistId: number) => {
    setPlaylists(playlists.filter(p => p.id !== playlistId));
    if (viewingPlaylist?.id === playlistId) setViewingPlaylist(null);
  };

  const filteredTracks = tracks.filter(track => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || track.genre === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPlaylistTracks = (playlist: Playlist) => {
    return tracks.filter(track => playlist.trackIds.includes(track.id));
  };

  // Greeting logic to prevent hydration mismatch
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Morning";
    if (hours < 18) return "Afternoon";
    return "Evening";
  };

  // --- Sub component : TrackRow --- (tweaked animations)
  const TrackRow = ({
    track,
    onPlay,
    onAddToPlaylist,
    onLike,
    showRemoveButton = false,
    onRemove,
  }: {
    track: Track;
    onPlay: () => void;
    onAddToPlaylist: () => void;
    onLike: () => void;
    showRemoveButton?: boolean;
    onRemove?: () => void;
  }) => (
    <div
      onClick={onPlay}
      className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer group transition-all duration-150 ease-out
        ${currentTrack?.id === track.id ? "bg-white/10" : "hover:bg-white/5"}
        active:scale-[0.99]
      `}
    >
      <div className="relative w-12 h-12 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden shrink-0">
        <Image
          src={track.coverUrl}
          alt={track.title}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <Music className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate text-white">{track.title}</h4>
        <p className="text-sm text-white/60 truncate">{track.artist}</p>
      </div>
      <span className="text-sm text-white/60 hidden sm:block">
        {track.duration}
      </span>
      <div className="flex items-center space-x-1">
        {showRemoveButton && onRemove && (
          <button
            onClick={e => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove from playlist"
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all duration-150"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        )}
        <button
          onClick={e => {
            e.stopPropagation();
            onAddToPlaylist();
          }}
          aria-label="Add to playlist"
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onLike();
          }}
          aria-label="Like song"
          className="opacity-0 group-hover:opacity-100 transition-all duration-150 p-2 hover:bg-white/10 rounded-lg"
        >
          <Heart
            className={`w-5 h-5 ${
              track.liked ? "fill-purple-500 text-purple-500" : "text-white/60"
            }`}
          />
        </button>
      </div>
    </div>
  );

  // --- Authentication View --- //
  if (!isMounted) return null; // Prevent hydration mismatch

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-slate-950 to-purple-950 p-4">
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-purple-600/90 rounded-full flex items-center justify-center shadow-lg shadow-purple-700/40">
              <Music className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">
            {authMode === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-center text-gray-300/90 mb-8 text-sm">
            {authMode === "signin"
              ? "Sign in to pick up your music where you left off."
              : "Sign up to start building your personal library."}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            {authError && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-2 rounded-lg text-sm text-center">
                {authError}
              </div>
            )}

            {authMode === "signup" && (
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/80 transition-all text-sm"
                  value={formData.fullName}
                  onChange={e =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/80 transition-all text-sm"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/80 transition-all text-sm"
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {authMode === "signup" && (
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/80 transition-all text-sm"
                  value={formData.confirmPassword}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-semibold shadow-lg shadow-purple-700/40 transform hover:translate-y-[1px] transition-all duration-150 text-sm"
            >
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === "signin" ? "signup" : "signin");
                setAuthError("");
                setFormData({
                  email: "",
                  password: "",
                  fullName: "",
                  confirmPassword: "",
                });
              }}
              className="text-purple-300 hover:text-white text-xs transition-colors"
            >
              {authMode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main App View --- //
  return (
    <div className="h-screen bg-linear-to-br from-gray-950 via-slate-950 to-purple-950 text-white flex flex-col">
      <audio ref={audioRef} src={currentTrack?.audioUrl} preload="metadata" />

      {/* Modals */}
      {showCreatePlaylist && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-white/10 shadow-xl shadow-black/60">
            <h3 className="text-xl font-bold mb-4 text-white">
              Create New Playlist
            </h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createPlaylist()}
              placeholder="Playlist name"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 text-sm"
            />
            <div className="flex space-x-3">
              <button
                onClick={createPlaylist}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors text-sm"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreatePlaylist(false);
                  setNewPlaylistName("");
                }}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddToPlaylist && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto border border-white/10 shadow-xl shadow-black/60">
            <h3 className="text-xl font-bold mb-4 text-white">
              Add to Playlist
            </h3>
            {playlists.length > 0 ? (
              <div className="space-y-2">
                {playlists.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addTrackToPlaylist(p.id)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex justify-between items-center text-sm"
                  >
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-xs text-white/60">
                        {p.trackIds.length} tracks
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-white/50" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-4 text-sm">
                No playlists yet. Create one first.
              </p>
            )}
            <button
              onClick={() => {
                setShowAddToPlaylist(false);
                setSelectedTrackForPlaylist(null);
              }}
              className="w-full mt-4 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Menu"
            className="lg:hidden text-white/80 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/90 flex items-center justify-center shadow-md shadow-purple-700/40">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white hidden sm:block tracking-tight">
              MusicStream
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-purple-200 font-medium">
              {user?.fullName}
            </span>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setCurrentTrack(null);
              setIsPlaying(false);
            }}
            aria-label="Sign Out"
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Sidebar overlay (fixed UX) */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden backdrop-blur-sm transition-opacity duration-200 ease-out"
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/45 backdrop-blur-xl border-r border-white/5 p-4 transition-transform duration-200 ease-out overflow-y-auto
            ${
              sidebarOpen
                ? "translate-x-0 shadow-xl shadow-black/60"
                : "-translate-x-full"
            }
            lg:static lg:translate-x-0 lg:shadow-none
          `}
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setCurrentView("home");
                setSidebarOpen(false);
                setViewingPlaylist(null);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm active:scale-[0.98]
                ${
                  currentView === "home" && !viewingPlaylist
                    ? "bg-purple-600 text-white shadow-md shadow-purple-700/40"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("search");
                setSidebarOpen(false);
                setViewingPlaylist(null);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm active:scale-[0.98]
                ${
                  currentView === "search"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-700/40"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("library");
                setSidebarOpen(false);
                setViewingPlaylist(null);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm active:scale-[0.98]
                ${
                  currentView === "library" && !viewingPlaylist
                    ? "bg-purple-600 text-white shadow-md shadow-purple-700/40"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Library className="w-4 h-4" />
              <span>Your Library</span>
            </button>
          </nav>

          <div className="mt-8">
            <button
              onClick={() => setShowCreatePlaylist(true)}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors group text-sm active:scale-[0.98]"
            >
              <div className="p-1 bg-white/15 rounded-md group-hover:bg-white/25 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span>Create Playlist</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("library");
                setSidebarOpen(false);
                setViewingPlaylist(null);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-colors text-sm active:scale-[0.98]"
            >
              <Heart className="w-4 h-4 text-white fill-white" />
              <span>Liked Songs ({tracks.filter(t => t.liked).length})</span>
            </button>
          </div>

          {playlists.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-white/50 px-4 mb-2 uppercase tracking-wider">
                Your Playlists
              </h3>
              <div className="space-y-1">
                {playlists.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setViewingPlaylist(p);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-xs active:scale-[0.98]
                      ${
                        viewingPlaylist?.id === p.id
                          ? "bg-white/10 text-white"
                          : "text-white/75 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <ListMusic className="w-3.5 h-3.5 opacity-70" />
                      <span className="truncate">{p.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32 scrollbar-thin scrollbar-thumb-white/15 scrollbar-track-transparent"
          style={{ paddingBottom: currentTrack ? "140px" : "20px" }}
        >
          {viewingPlaylist ? (
            <div>
              <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6 rounded-xl mb-6 shadow-xl shadow-purple-900/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-linear-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/40">
                      <ListMusic className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/80 mb-1">
                        PLAYLIST
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        {viewingPlaylist.name}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {getPlaylistTracks(viewingPlaylist).length} tracks
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deletePlaylist(viewingPlaylist.id)}
                    className="px-4 py-2 bg-white/90 hover:bg-purple-600 rounded-lg text-xs font-semibold transition-colors text-black hover:text-white border border-red-500/20"
                  >
                    Delete Playlist
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {getPlaylistTracks(viewingPlaylist).length > 0 ? (
                  getPlaylistTracks(viewingPlaylist).map(track => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      onPlay={() => handleTrackSelect(track)}
                      onAddToPlaylist={() => {
                        setSelectedTrackForPlaylist(track.id);
                        setShowAddToPlaylist(true);
                      }}
                      onLike={() => toggleLike(track.id)}
                      showRemoveButton={true}
                      onRemove={() =>
                        removeTrackFromPlaylist(viewingPlaylist.id, track.id)
                      }
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-white/60 text-sm">
                    <ListMusic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No tracks in this playlist yet.</p>
                    <button
                      onClick={() => setCurrentView("search")}
                      className="mt-3 text-purple-300 hover:text-purple-200 underline"
                    >
                      Find songs to add
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {currentView === "home" && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
                    Good {getGreeting()}
                  </h2>

                  {/* Categories */}
                  <section className="mb-8">
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
                      Browse Categories
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      {musicCategories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`bg-linear-to-r ${
                            category.color
                          } p-4 rounded-lg text-white font-semibold text-xs sm:text-sm transition-all duration-150
                            ${
                              selectedCategory === category.id
                                ? "ring-2 ring-white/70 shadow-md shadow-black/40"
                                : "hover:shadow-md hover:shadow-black/40 hover:scale-[1.02]"
                            }
                          `}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Recent Tracks */}
                  <section>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
                      {selectedCategory === "all"
                        ? "All Tracks"
                        : `${
                            musicCategories.find(c => c.id === selectedCategory)
                              ?.name
                          }`}
                    </h3>
                    <div className="space-y-2">
                      {filteredTracks.slice(0, 8).map(track => (
                        <TrackRow
                          key={track.id}
                          track={track}
                          onPlay={() => handleTrackSelect(track)}
                          onAddToPlaylist={() => {
                            setSelectedTrackForPlaylist(track.id);
                            setShowAddToPlaylist(true);
                          }}
                          onLike={() => toggleLike(track.id)}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {currentView === "search" && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
                    Search Music
                  </h2>
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search songs, artists, albums, or genres..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full px-10 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors text-sm sm:text-base"
                        autoFocus
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                      {isSearching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Search Results */}
                  <div className="space-y-2">
                    {searchQuery && (
                      <>
                        <h3 className="text-lg font-semibold mb-3 text-white">
                          {isSearching
                            ? "Searching..."
                            : `Search Results (${searchResults.length})`}
                        </h3>
                        {searchResults.length > 0 ? (
                          searchResults.map(track => (
                            <TrackRow
                              key={track.id}
                              track={track}
                              onPlay={() => handleTrackSelect(track)}
                              onAddToPlaylist={() => {
                                setSelectedTrackForPlaylist(track.id);
                                setShowAddToPlaylist(true);
                              }}
                              onLike={() => toggleLike(track.id)}
                            />
                          ))
                        ) : !isSearching ? (
                          <div className="text-center py-12 text-white/60 text-sm">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>
                              No results found for &quot;{searchQuery}&quot;.
                            </p>
                            <p className="text-xs mt-2">
                              Try different keywords or browse categories.
                            </p>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>

                  {/* Categories in Search */}
                  {!searchQuery && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3 text-white">
                        Browse by Category
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {musicCategories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-150
                              ${
                                selectedCategory === category.id
                                  ? `bg-linear-to-r ${category.color} text-white`
                                  : "bg-white/5 text-white/80 hover:bg-white/10"
                              }
                            `}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentView === "library" && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
                    Your Library
                  </h2>

                  {/* Liked Songs Section */}
                  <section className="mb-8">
                    <div
                      className="bg-linear-to-r from-purple-600 to-pink-600 p-6 rounded-xl mb-6 shadow-lg shadow-purple-900/40 cursor-pointer hover:scale-[1.01] transition-transform"
                      onClick={() => {
                        // Could navigate to a "Liked Songs" detail view later
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-linear-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shadow-md shadow-purple-900/40">
                          <Heart className="w-10 h-10 text-white fill-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white/80 mb-1">
                            PLAYLIST
                          </p>
                          <h3 className="text-2xl font-bold text-white">
                            Liked Songs
                          </h3>
                          <p className="text-white/80 text-sm">
                            {tracks.filter(t => t.liked).length} liked songs
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {tracks.filter(track => track.liked).length > 0 ? (
                        tracks
                          .filter(track => track.liked)
                          .map(track => (
                            <TrackRow
                              key={track.id}
                              track={track}
                              onPlay={() => handleTrackSelect(track)}
                              onAddToPlaylist={() => {
                                setSelectedTrackForPlaylist(track.id);
                                setShowAddToPlaylist(true);
                              }}
                              onLike={() => toggleLike(track.id)}
                            />
                          ))
                      ) : (
                        <div className="text-center py-12 text-white/60 text-sm">
                          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No liked songs yet.</p>
                          <p className="text-xs mt-2">
                            Tap the heart icon on any song to add it here.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Playlists Section */}
                  {playlists.length > 0 && (
                    <section>
                      <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
                        Your Playlists
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {playlists.map(playlist => (
                          <div
                            key={playlist.id}
                            onClick={() => setViewingPlaylist(playlist)}
                            className="bg-white/5 hover:bg-white/8 rounded-xl p-4 transition-all duration-150 cursor-pointer group hover:-translate-y-[2px] shadow-sm hover:shadow-md hover:shadow-black/40"
                          >
                            <div className="w-full aspect-square rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 relative overflow-hidden">
                              {playlist.coverUrl ? (
                                <Image
                                  src={playlist.coverUrl}
                                  alt={playlist.name}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-150"
                                />
                              ) : (
                                <ListMusic className="w-8 h-8 text-white" />
                              )}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 backdrop-blur-[1px]">
                                <Play className="w-7 h-7 text-white fill-white" />
                              </div>
                            </div>
                            <h4 className="font-semibold truncate text-sm text-white">
                              {playlist.name}
                            </h4>
                            <p className="text-xs text-white/60">
                              {playlist.trackIds.length} tracks
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Player Bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/5 p-4 z-50 shadow-[0_-16px_40px_rgba(0,0,0,0.75)]">
          <div className="max-w-screen-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-3 group/progress">
              <div
                onClick={handleProgressClick}
                className="h-1 bg-white/15 rounded-full cursor-pointer relative"
              >
                <div
                  className="h-full bg-purple-500 rounded-full relative group-hover/progress:bg-purple-400 transition-colors duration-150"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity duration-150 shadow-md scale-150" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] sm:text-xs text-white/60 mt-1 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              {/* Track Info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden hidden sm:block shadow-md shadow-black/60 group/cover">
                  <Image
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover/cover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity duration-150">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold truncate text-sm sm:text-base text-white">
                    {currentTrack.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-white/60 truncate">
                    {currentTrack.artist}
                  </p>
                </div>
                <button
                  onClick={() => toggleLike(currentTrack.id)}
                  aria-label="Like song"
                  className="hidden md:block p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      currentTrack.liked
                        ? "fill-purple-500 text-purple-500"
                        : "text-white/60"
                    }`}
                  />
                </button>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2 sm:space-x-4 mx-2 sm:mx-4">
                <button
                  onClick={handlePrevious}
                  aria-label="Previous Track"
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                >
                  <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white text-black rounded-full hover:scale-[1.05] transition-transform duration-150 shadow-lg shadow-black/50"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 sm:w-5 sm:h-5 fill-black" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-5 sm:h-5 ml-[1px] fill-black" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next Track"
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                >
                  <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Volume */}
              <div className="hidden lg:flex items-center space-x-2 flex-1 justify-end group/volume">
                <button
                  onClick={() => setVolume(volume === 0 ? 70 : 0)}
                  aria-label="Mute"
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  aria-label="Volume Control"
                  className="w-24 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:opacity-0
                    group-hover/volume:[&::-webkit-slider-thumb]:opacity-100
                    transition-all
                  "
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
