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
  User,
} from "lucide-react";

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audioUrl: string;
  liked: boolean;
  genre: string;
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
  },
  {
    id: 6,
    title: "Wooden Chairs",
    artist: "Folk Friends",
    album: "Campfire Stories",
    duration: "2:55",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    liked: true,
    genre: "acoustic",
  },
  {
    id: 7,
    title: "Smooth Jazz",
    artist: "Blue Note Trio",
    album: "Late Night Sessions",
    duration: "4:10",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    liked: false,
    genre: "jazz",
  },
  {
    id: 8,
    title: "City Lights",
    artist: "Urban Jazz Collective",
    album: "Metropolitan",
    duration: "3:52",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    liked: true,
    genre: "jazz",
  },
];

const musicCategories = [
  { id: "all", name: "All Music", color: "from-purple-500 to-pink-500" },
  { id: "chill", name: "Chill & Lo-fi", color: "from-blue-500 to-teal-500" },
  { id: "electronic", name: "Electronic", color: "from-green-500 to-blue-500" },
  { id: "acoustic", name: "Acoustic", color: "from-yellow-500 to-orange-500" },
  { id: "jazz", name: "Jazz", color: "from-red-500 to-purple-500" },
];

export default function MusicPlayer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [currentView, setCurrentView] = useState<"home" | "library" | "search">(
    "home"
  );
  const [tracks, setTracks] = useState<Track[]>(sampleTracks);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });
  const [authError, setAuthError] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);

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

  const handleAuth = () => {
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
    setPlaylists([
      ...playlists,
      {
        id: Date.now(),
        name: newPlaylistName,
        trackIds: [],
        createdAt: new Date(),
      },
    ]);
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

  const TrackRow = ({
    track,
    onPlay,
    onAddToPlaylist,
    onLike,
  }: {
    track: Track;
    onPlay: () => void;
    onAddToPlaylist: () => void;
    onLike: () => void;
  }) => (
    <div
      onClick={onPlay}
      className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer group transition-colors ${
        currentTrack?.id === track.id ? "bg-white/10" : ""
      }`}
    >
      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
        <Music className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate text-white">{track.title}</h4>
        <p className="text-sm text-white/60 truncate">{track.artist}</p>
      </div>
      <span className="text-sm text-white/60 hidden sm:block">
        {track.duration}
      </span>
      <button
        onClick={e => {
          e.stopPropagation();
          onAddToPlaylist();
        }}
        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={e => {
          e.stopPropagation();
          onLike();
        }}
        className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-white/10 rounded-lg"
      >
        <Heart
          className={`w-5 h-5 ${
            track.liked ? "fill-purple-500 text-purple-500" : "text-white/60"
          }`}
        />
      </button>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Music className="w-12 h-12 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">MusicStream</h1>
            <p className="mt-2 text-purple-200">
              Your Personal Music Experience
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              {authMode === "signin" ? "Welcome Back" : "Create Account"}
            </h2>

            {authError && (
              <div className="mb-4 p-3 text-sm rounded-lg bg-red-500/20 text-red-200 border border-red-500/30">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onKeyDown={e => e.key === "Enter" && handleAuth()}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  onKeyDown={e => e.key === "Enter" && handleAuth()}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              {authMode === "signup" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    onKeyDown={e => e.key === "Enter" && handleAuth()}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <button
                onClick={handleAuth}
                className="w-full py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-lg"
              >
                {authMode === "signin" ? "Sign In" : "Sign Up"}
              </button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-white/70">
                {authMode === "signin"
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <button
                onClick={() => {
                  setAuthMode(authMode === "signin" ? "signup" : "signin");
                  setAuthError("");
                }}
                className="font-semibold text-purple-300 hover:text-purple-200 underline transition-colors"
              >
                {authMode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-linear-to-br from-gray-900 via-purple-900 to-violet-900 text-white flex flex-col">
      <audio ref={audioRef} src={currentTrack?.audioUrl} preload="metadata" />

      {/* Modals */}
      {showCreatePlaylist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-white">
              Create New Playlist
            </h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createPlaylist()}
              placeholder="Playlist name"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 transition-colors"
            />
            <div className="flex space-x-3">
              <button
                onClick={createPlaylist}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreatePlaylist(false);
                  setNewPlaylistName("");
                }}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddToPlaylist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-white">
              Add to Playlist
            </h3>
            {playlists.length > 0 ? (
              <div className="space-y-2">
                {playlists.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addTrackToPlaylist(p.id)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-sm text-white/60">
                      {p.trackIds.length} tracks
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-4">
                No playlists yet. Create one first!
              </p>
            )}
            <button
              onClick={() => {
                setShowAddToPlaylist(false);
                setSelectedTrackForPlaylist(null);
              }}
              className="w-full mt-4 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white/80 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Music className="w-8 h-8 text-purple-400" />
          <h1 className="text-2xl font-bold text-white hidden sm:block">
            MusicStream
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-purple-300 hidden sm:block">
            Welcome, {user?.fullName}
          </span>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setCurrentTrack(null);
              setIsPlaying(false);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black/40 backdrop-blur-lg border-r border-white/10 p-4 transition-transform overflow-y-auto`}
        >
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setCurrentView("home");
                setSidebarOpen(false);
                setViewingPlaylist(null);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === "home" && !viewingPlaylist
                  ? "bg-purple-600 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("search");
                setSidebarOpen(false);
                setViewingPlaylist(null);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === "search"
                  ? "bg-purple-600 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("library");
                setSidebarOpen(false);
                setViewingPlaylist(null);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === "library" && !viewingPlaylist
                  ? "bg-purple-600 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Library className="w-5 h-5" />
              <span>Your Library</span>
            </button>
          </nav>

          <div className="mt-8">
            <button
              onClick={() => setShowCreatePlaylist(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Playlist</span>
            </button>
            <button
              onClick={() => {
                setCurrentView("library");
                setSidebarOpen(false);
                setViewingPlaylist(null);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>Liked Songs ({tracks.filter(t => t.liked).length})</span>
            </button>
          </div>

          {playlists.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white/60 px-4 mb-2">
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
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                      viewingPlaylist?.id === p.id
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ListMusic className="w-4 h-4" />
                      <span className="truncate">{p.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32">
          {viewingPlaylist ? (
            <div>
              <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6 rounded-xl mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-linear-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shrink-0">
                      <ListMusic className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">
                        PLAYLIST
                      </p>
                      <h2 className="text-3xl font-bold text-white">
                        {viewingPlaylist.name}
                      </h2>
                      <p className="text-white/80">
                        {getPlaylistTracks(viewingPlaylist).length} tracks
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deletePlaylist(viewingPlaylist.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors"
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
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-white/60">
                    <ListMusic className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No tracks in this playlist yet.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {currentView === "home" && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-white">
                    Good{" "}
                    {new Date().getHours() < 12
                      ? "Morning"
                      : new Date().getHours() < 18
                      ? "Afternoon"
                      : "Evening"}
                  </h2>

                  {/* Categories */}
                  <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Browse Categories
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      {musicCategories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`bg-linear-to-r ${
                            category.color
                          } p-4 rounded-lg text-white font-semibold text-sm hover:scale-105 transition-transform ${
                            selectedCategory === category.id
                              ? "ring-2 ring-white ring-opacity-50"
                              : ""
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Recent Tracks */}
                  <section>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {selectedCategory === "all"
                        ? "All Tracks"
                        : musicCategories.find(c => c.id === selectedCategory)
                            ?.name + " Tracks"}
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
                  <h2 className="text-3xl font-bold mb-6 text-white">Search</h2>
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Search for songs, artists, or albums..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
                    />
                  </div>

                  {/* Categories in Search */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-white">
                      Browse by Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {musicCategories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category.id
                              ? `bg-linear-to-r ${category.color} text-white`
                              : "bg-white/10 text-white/80 hover:bg-white/20"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {filteredTracks.length > 0 ? (
                      filteredTracks.map(track => (
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
                      <div className="text-center py-12 text-white/60">
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No results found. Try a different search term.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentView === "library" && (
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-white">
                    Your Library
                  </h2>

                  {/* Liked Songs Section */}
                  <section className="mb-8">
                    <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6 rounded-xl mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-linear-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                          <Heart
                            className="w-10 h-10 text-white"
                            fill="currentColor"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white/80">
                            PLAYLIST
                          </p>
                          <h3 className="text-2xl font-bold text-white">
                            Liked Songs
                          </h3>
                          <p className="text-white/80">
                            {tracks.filter(t => t.liked).length} liked songs
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {tracks
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
                        ))}
                    </div>
                  </section>

                  {/* Playlists Section */}
                  {playlists.length > 0 && (
                    <section>
                      <h3 className="text-2xl font-bold mb-4 text-white">
                        Your Playlists
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {playlists.map(playlist => (
                          <div
                            key={playlist.id}
                            onClick={() => setViewingPlaylist(playlist)}
                            className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all cursor-pointer group"
                          >
                            <div className="w-full aspect-square rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                              <ListMusic className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-semibold truncate text-white">
                              {playlist.name}
                            </h4>
                            <p className="text-sm text-white/60">
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
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 p-4">
          <div className="max-w-screen-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-3">
              <div
                onClick={handleProgressClick}
                className="h-1 bg-white/20 rounded-full cursor-pointer group"
              >
                <div
                  className="h-full bg-purple-500 rounded-full relative group-hover:bg-purple-400 transition-colors"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Track Info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 items-center justify-center hidden sm:flex">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold truncate text-sm sm:text-base text-white">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/60 truncate">
                    {currentTrack.artist}
                  </p>
                </div>
                <button
                  onClick={() => toggleLike(currentTrack.id)}
                  className="hidden md:block p-2 hover:bg-white/10 rounded-lg transition-colors"
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
              <div className="flex items-center space-x-2 sm:space-x-4 mx-4">
                <button
                  onClick={handlePrevious}
                  className="text-white/80 hover:text-white transition-colors p-2"
                >
                  <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="text-white/80 hover:text-white transition-colors p-2"
                >
                  <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Volume */}
              <div className="hidden lg:flex items-center space-x-2 flex-1 justify-end">
                <button
                  onClick={() => setVolume(volume === 0 ? 70 : 0)}
                  className="text-white/80 hover:text-white transition-colors p-2"
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
                  className="w-24 accent-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </div>
  );
}
