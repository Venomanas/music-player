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
        genre: track.genre || "unknown",
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
    <div className="space-y-4 md:space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search songs, artists, or albums..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-10 md:px-12 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white text-sm md:text-base placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
        <Music className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/40" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* Categories - Horizontal Scroll */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl whitespace-nowrap transition-all text-sm md:text-base
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

      {/* Stats - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-linear-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl md:rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs md:text-sm">Total Tracks</p>
              <p className="text-xl md:text-2xl font-bold text-white">150</p>
            </div>
            <Music className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-linear-to-r from-blue-500/20 to-teal-500/20 p-4 rounded-xl md:rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs md:text-sm">Listening Time</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                48h 22m
              </p>
            </div>
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-linear-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl md:rounded-2xl border border-white/10 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs md:text-sm">Liked Songs</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                {likedTracks.length}
              </p>
            </div>
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-green-400 fill-green-400" />
          </div>
        </div>
      </div>

      {/* Music Tracks - Responsive Layout */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4">
            {selectedCategory === "all"
              ? "All Tracks"
              : categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-white/60 ml-2">
              ({filteredTracks.length})
            </span>
          </h3>
        </div>

        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 font-medium text-sm">
                  #
                </th>
                <th className="text-left p-4 text-white/60 font-medium text-sm">
                  Title
                </th>
                <th className="text-left p-4 text-white/60 font-medium text-sm">
                  Album
                </th>
                <th className="text-left p-4 text-white/60 font-medium text-sm">
                  <Clock className="w-4 h-4 inline" />
                </th>
                <th className="text-left p-4 text-white/60 font-medium text-sm">
                  Plays
                </th>
                <th className="text-left p-4 text-white/60 font-medium text-sm"></th>
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
                          className="absolute inset-0 flex items-center justify-center bg-pink-600 rounded-full"
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
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-pink-600 rounded-full hover:bg-pink-700 transition-all"
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
                          width={48}
                          height={48}
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-pink-400 transition-colors">
                          {track.title}
                        </div>
                        <div className="text-sm text-white/60">
                          {track.artist}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white/80 text-sm">{track.album}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white/60 text-sm">
                      {formatDuration(track.duration)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white/60 text-sm">
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-2 p-4">
          {filteredTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 active:bg-white/10 transition-colors"
            >
              <button
                onClick={() => handlePlayTrack(track)}
                className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0"
              >
                <Image
                  width={48}
                  height={48}
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="w-5 h-5 text-white" fill="currentColor" />
                  ) : (
                    <Play
                      className="w-5 h-5 text-white ml-0.5"
                      fill="currentColor"
                    />
                  )}
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate text-sm">
                  {track.title}
                </h4>
                <p className="text-xs text-white/60 truncate">{track.artist}</p>
                <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                  <span>{formatDuration(track.duration)}</span>
                  <span>•</span>
                  <span>{track.playCount.toLocaleString()} plays</span>
                </div>
              </div>
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
                  className={`w-5 h-5 ${
                    track.liked ? "fill-red-500 text-red-500" : "text-white/60"
                  }`}
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recently Played */}
      {recentTracks.length > 0 && (
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 px-4 md:px-0">
            Recently Played
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {recentTracks.map(track => (
              <motion.div
                key={track.id}
                whileHover={{ y: -5 }}
                className="bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 transition-all cursor-pointer group"
                onClick={() => {
                  setCurrentTrack(track);
                  audioPlayer.play(track);
                  setIsPlaying(true);
                }}
              >
                <div className="relative aspect-square rounded-lg md:rounded-xl overflow-hidden mb-3 md:mb-4">
                  <Image
                    src={track.coverUrl}
                    alt={track.title}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 right-2 md:right-3">
                    <button className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full flex items-center justify-center ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      ) : (
                        <Play className="w-3 h-3 md:w-4 md:h-4 text-white ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white truncate text-sm md:text-base">
                    {track.title}
                  </h4>
                  <p className="text-xs md:text-sm text-white/60 truncate">
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
