/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react"; // Add useEffect
import { motion } from "framer-motion";
import { Play, Heart, MoreVertical, Clock, Globe } from "lucide-react";
import Image from "next/image";
import { usePlayerStore, type LibraryTrack } from "@/src/lib/store/playerStore";

export default function HindimusicSection() {
  const {  playTrack, toggleLike, likedTracks, getHindiSongs } =
    usePlayerStore();

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isMounted, setIsMounted] = useState(false); // Add mounted state

  // Get Hindi songs from the store
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

  // Use useEffect to set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything during SSR
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-purple-500" />
              <h2 className="text-2xl font-bold text-white">
                Hindi Bollywood Hits
              </h2>
            </div>
            <p className="text-gray-400">Your favorite Bollywood tracks</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
            View All
          </button>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 animate-pulse"
            >
              <div className="aspect-square rounded-lg bg-gray-700 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-purple-500" />
            <h2 className="text-2xl font-bold text-white">
              Hindi Bollywood Hits
            </h2>
          </div>
          <p className="text-gray-400">Your favorite Bollywood tracks</p>
        </div>
        <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors">
          View All
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSongs.map((song: LibraryTrack, index: number) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all group"
          >
            {/* Album Cover */}
            <div className="relative mb-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                {song.coverUrl ? (
                  <Image
                    src={song.coverUrl}
                    alt={song.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-white font-bold">🎵</span>
                  </div>
                )}
              </div>

              {/* Play Button Overlay */}
              <button
                onClick={() => playTrack(song)}
                className="absolute bottom-2 right-2 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 hover:bg-purple-700"
              >
                <Play size={20} className="text-white ml-1" fill="white" />
              </button>
            </div>

            {/* Song Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-white truncate">
                {song.title}
              </h3>
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(song.id)}
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
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Clock size={14} />
                    {formatDuration(song.duration)}
                  </span>
                </div>

                <button className="text-gray-400 hover:text-white">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* If no Hindi songs found */}
      {filteredSongs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No Hindi songs found. Add some to your library!
          </p>
        </div>
      )}
    </div>
  );
}
