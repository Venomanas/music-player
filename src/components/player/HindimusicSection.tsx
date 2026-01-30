/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Heart, Clock, Globe } from "lucide-react";
import Image from "next/image";
import {
  usePlayerStore,
  type LibraryTrack,
} from "@/src/lib/store/playerStore";
import { audioPlayer } from "@/src/lib/audio/player";
import { createAudioTrack } from "@/src/lib/utils/audio";

export default function HindimusicSection() {
  const {
    likedTracks,
    toggleLike,
    getHindiSongs,
    setCurrentTrack,
    setIsPlaying,
    currentTrack,
    isPlaying,
  } = usePlayerStore();

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isMounted, setIsMounted] = useState(false);

  const hindiSongs = getHindiSongs();

  const filters = [
    { id: "all", label: "All" },
    { id: "romantic", label: "Romantic" },
    { id: "dance", label: "Dance" },
    { id: "classic", label: "Classic" },
    { id: "sad", label: "Sad" },
  ];

  const filteredSongs =
    activeFilter === "all"
      ? hindiSongs
      : hindiSongs.filter(song =>
          song.genre?.toLowerCase().includes(activeFilter.toLowerCase()),
        );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Fixed play handler - same as musicLibrary.tsx
  const handlePlayTrack = (track: LibraryTrack) => {
    if (!track.url) {
      alert("Audio unavailable");
      return;
    }

    // If same track is playing, pause it
    if (currentTrack?.id === track.id && isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
      return;
    }

    // Create audio track and play
    const audioTrack = createAudioTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      url: track.url,
      duration: track.duration,
      coverUrl: track.coverUrl || "",
      genre: track.genre || "unknown",
    });

    setCurrentTrack(audioTrack);
    audioPlayer.play(audioTrack);
    setIsPlaying(true);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-pink-500" />
            <h2 className="text-2xl font-bold text-white">
              Hindi Bollywood Hits
            </h2>
          </div>
          <p className="text-gray-400 text-sm md:text-base">
            Your favorite Bollywood tracks
          </p>
        </div>
        <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors text-sm md:text-base">
          View All
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors text-sm ${
              activeFilter === filter.id
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
        {filteredSongs.map((song: LibraryTrack, index: number) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-white/10 transition-all group"
          >
            {/* CLICKABLE Album Cover Area */}
            <div
              className="relative mb-3 md:mb-4 cursor-pointer"
              onClick={() => handlePlayTrack(song)} // Fixed: Now uses handlePlayTrack
            >
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                {song.coverUrl ? (
                  <Image
                    src={song.coverUrl}
                    alt={song.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">🎵</span>
                  </div>
                )}
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                  <Play size={20} className="text-white ml-1" fill="white" />
                </button>
              </div>
            </div>

            {/* Song Info */}
            <div className="space-y-1 md:space-y-2">
              <h3
                className="font-semibold text-white truncate text-sm md:text-base"
                title={song.title}
              >
                {song.title}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm truncate">
                {song.artist}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={
                        likedTracks.some(t => t.id === song.id)
                          ? "fill-pink-500 text-pink-500"
                          : ""
                      }
                    />
                  </button>
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <Clock size={12} />
                    {formatDuration(song.duration)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
