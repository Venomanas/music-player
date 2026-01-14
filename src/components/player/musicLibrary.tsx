"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Heart,
  MoreVertical,
  ListMusic,
  Clock,
  Music,
  Headphones,
  TrendingUp,
} from "lucide-react";
import { usePlayerStore } from "@/src/lib/store/playerStore";
import { audioPlayer } from "@/src/lib/audio/player";
import { createAudioTrack } from "@/src/lib/utils/audio";
import Image from "next/image";

type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  audioUrl?: string;
  url?: string;
  coverUrl?: string;
  genre?: string;
  liked?: boolean;
  playCount?: number;
};

const MusicLibrary: React.FC = () => {
  const {
    recentTracks,
    likedTracks,
    currentTrack,
    isPlaying,
    toggleLikeTrack,
    setCurrentTrack,
    setIsPlaying,
  } = usePlayerStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for music library
  const categories = [
    {
      id: "all",
      name: "All Music",
      icon: <Music className="w-4 h-4" />,
      count: 150,
    },
    {
      id: "chill",
      name: "Chill & Lo-fi",
      icon: <Headphones className="w-4 h-4" />,
      count: 42,
    },
    {
      id: "electronic",
      name: "Electronic",
      icon: <TrendingUp className="w-4 h-4" />,
      count: 38,
    },
    {
      id: "acoustic",
      name: "Acoustic",
      icon: <Music className="w-4 h-4" />,
      count: 25,
    },
    {
      id: "jazz",
      name: "Jazz",
      icon: <ListMusic className="w-4 h-4" />,
      count: 18,
    },
    {
      id: "hiphop",
      name: "Hip Hop",
      icon: <Headphones className="w-4 h-4" />,
      count: 22,
    },
  ];

  const musicTracks = [
    {
      id: "1",
      title: "Coffee Break",
      artist: "Lofi Dreamer",
      album: "Chill Beats Vol. 1",
      duration: 168,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
      genre: "chill",
      liked: false,
      playCount: 1245,
    },
    {
      id: "2",
      title: "Midnight Walk",
      artist: "Ambient Collective",
      album: "Night Sounds",
      duration: 195,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "chill",
      liked: true,
      playCount: 892,
    },
    {
      id: "3",
      title: "Digital Dreams",
      artist: "Synth Wave",
      album: "Electronic Vibes",
      duration: 262,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
      genre: "electronic",
      liked: false,
      playCount: 1567,
    },
    {
      id: "4",
      title: "Neon Pulse",
      artist: "Cyber Beats",
      album: "Future Sounds",
      duration: 225,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop",
      genre: "electronic",
      liked: true,
      playCount: 2103,
    },
    {
      id: "5",
      title: "Morning Coffee",
      artist: "Acoustic Sessions",
      album: "Quiet Moments",
      duration: 210,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
      genre: "acoustic",
      liked: false,
      playCount: 756,
    },
    {
      id: "6",
      title: "Urban Jazz",
      artist: "Smooth Operators",
      album: "City Nights",
      duration: 245,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
      genre: "jazz",
      liked: false,
      playCount: 943,
    },
    {
      id: "7",
      title: "Desert Vibes",
      artist: "Nomadic Sounds",
      album: "World Traveler",
      duration: 198,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop",
      genre: "world",
      liked: true,
      playCount: 1124,
    },
    {
      id: "8",
      title: "Ocean Waves",
      artist: "Nature Sounds",
      album: "Calm Nature",
      duration: 315,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
      genre: "ambient",
      liked: false,
      playCount: 1876,
    },
  ];

  const handlePlayTrack = (track: MusicTrack) => {
    if (currentTrack?.id === track.id && isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else if (currentTrack?.id === track.id && !isPlaying) {
      audioPlayer.resume();
      setIsPlaying(true);
    } else {
      if (!track.audioUrl) {
        // don't try to play tracks without a valid audio URL
        console.warn("Attempted to play a track without an audio URL:", track);
        return;
      }
      const audioTrack = createAudioTrack({
        id: track.id,
        title: track.title,
        artist: track.artist,
        url: track.audioUrl,
        duration: track.duration || 0,
        coverUrl: track.coverUrl || "",
        genre: track.genre || "unknown", // Provide default value
      });
      setCurrentTrack(audioTrack);
      audioPlayer.play(audioTrack);
      setIsPlaying(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredTracks = musicTracks.filter(track => {
    const matchesCategory =
      selectedCategory === "all" || track.genre === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search songs, artists, or albums..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-4 min-w-max">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all
                ${
                  selectedCategory === category.id
                    ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {category.icon}
              <span className="font-medium">{category.name}</span>
              <span className="text-xs opacity-70">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Tracks</p>
              <p className="text-2xl font-bold text-white">150</p>
            </div>
            <Music className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-linear-to-r from-blue-500/20 to-teal-500/20 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Listening Time</p>
              <p className="text-2xl font-bold text-white">48h 22m</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-linear-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Liked Songs</p>
              <p className="text-2xl font-bold text-white">
                {likedTracks.length}
              </p>
            </div>
            <Heart className="w-8 h-8 text-green-400 fill-green-400" />
          </div>
        </div>
      </div>

      {/* Music Tracks Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {selectedCategory === "all"
              ? "All Tracks"
              : categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-white/60 ml-2">
              ({filteredTracks.length})
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 font-medium">#</th>
                <th className="text-left p-4 text-white/60 font-medium">
                  Title
                </th>
                <th className="text-left p-4 text-white/60 font-medium">
                  Album
                </th>
                <th className="text-left p-4 text-white/60 font-medium">
                  <Clock className="w-4 h-4 inline" />
                </th>
                <th className="text-left p-4 text-white/60 font-medium">
                  Plays
                </th>
                <th className="text-left p-4 text-white/60 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTracks.map((track, index) => (
                <motion.tr
                  key={track.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-white/5 border-b border-white/5 last:border-0"
                >
                  <td className="p-4">
                    <div className="relative w-8 h-8">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <button
                          onClick={() => handlePlayTrack(track)}
                          className="absolute inset-0 flex items-center justify-center bg-purple-600 rounded-full"
                        >
                          <Pause className="w-3 h-3 text-white" />
                        </button>
                      ) : (
                        <>
                          <span className="absolute inset-0 flex items-center justify-center text-white/60 group-hover:opacity-0">
                            {index + 1}
                          </span>
                          <button
                            onClick={() => handlePlayTrack(track)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-purple-600 rounded-full hover:bg-purple-500 transition-all"
                          >
                            <Play className="w-3 h-3 text-white ml-0.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image
                        width={100}
                        height={100}
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                          {track.title}
                        </div>
                        <div className="text-sm text-white/60">
                          {track.artist}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white/80">{track.album}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white/60">
                      {formatDuration(track.duration)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white/60">
                      {track.playCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          toggleLikeTrack({
                            id: track.id,
                            title: track.title,
                            artist: track.artist,
                            url: track.audioUrl,
                            duration: track.duration,
                            coverUrl: track.coverUrl || "",
                            genre: track.genre || "unknown",
                          })
                        }
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            track.liked
                              ? "fill-red-500 text-red-500"
                              : "text-white/60 hover:text-white"
                          }`}
                        />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recently Played */}
      {recentTracks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Recently Played</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentTracks.map(track => (
              <motion.div
                key={track.id}
                whileHover={{ y: -5 }}
                className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition-all cursor-pointer group"
                onClick={() => {
                  setCurrentTrack(track);
                  audioPlayer.play(track);
                  setIsPlaying(true);
                }}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <Image
                    src={track.coverUrl}
                    alt={track.title}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <button className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white truncate">
                    {track.title}
                  </h4>
                  <p className="text-sm text-white/60 truncate">
                    {track.artist}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;
