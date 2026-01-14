/* eslint-disable react-hooks/immutability */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Heart,
} from "lucide-react";
import { usePlayerStore } from "@/src/lib/store/playerStore";
import { audioPlayer } from "@/src/lib/audio/player";
import Image from "next/image";

const EnhancedAudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    repeat,
    shuffle,
    setIsPlaying,
    setVolume,
    setProgress,
    toggleRepeat,
    toggleShuffle,
    toggleLikeTrack,
    likedTracks,
  } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTrack) {
      setIsLiked(likedTracks.some(track => track.id === currentTrack.id));
    }
  }, [currentTrack, likedTracks]);

  useEffect(() => {
    audioPlayer.on("play", () => setIsPlaying(true));
    audioPlayer.on("pause", () => setIsPlaying(false));
    audioPlayer.on("end", () => handleNext());
    audioPlayer.on("seek", (time: number) => setCurrentTime(time));

    const interval = setInterval(() => {
      const time = audioPlayer.getCurrentTime();
      const duration = audioPlayer.getDuration();
      if (duration > 0) {
        setCurrentTime(time);
        setProgress((time / duration) * 100);
      }
    }, 100);

    return () => {
      audioPlayer.off("play", () => {});
      audioPlayer.off("pause", () => {});
      audioPlayer.off("end", () => {});
      audioPlayer.off("seek", () => {});
      clearInterval(interval);
    };
  }, );

  const handlePlayPause = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    // Implement next track logic based on shuffle and repeat
    console.log("Next track");
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      audioPlayer.seek(0);
    } else {
      // Previous track logic
      console.log("Previous track");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    audioPlayer.setVolume(newVolume / 100);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !currentTrack) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const duration = audioPlayer.getDuration();
    const newTime = percent * duration;

    audioPlayer.seek(newTime);
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black/95 via-black/90 to-transparent backdrop-blur-xl border-t border-white/10 z-50 p-4 shadow-2xl"
    >
      <div className="max-w-screen-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-3 group/progress">
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="h-1 bg-white/20 rounded-full cursor-pointer relative"
          >
            <motion.div
              className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full relative"
              style={{ width: `${progress}%` }}
              layout
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 shadow-lg" />
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audioPlayer.getDuration())}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
              <Image
              width={100}
              height={100}
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-purple-500/20 to-pink-500/20" />
            </div>

            <div className="min-w-0">
              <h4 className="font-semibold text-white truncate">
                {currentTrack.title}
              </h4>
              <p className="text-sm text-white/60 truncate">
                {currentTrack.artist}
              </p>
            </div>

            <button
              onClick={() => toggleLikeTrack(currentTrack)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-red-500 text-red-500" : "text-white/60"
                }`}
              />
            </button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-lg transition-colors ${
                shuffle
                  ? "text-purple-400 bg-white/10"
                  : "text-white/60 hover:bg-white/5"
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={handlePrevious}
              className="p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-lg transition-colors ${
                repeat !== "none"
                  ? "text-purple-400 bg-white/10"
                  : "text-white/60 hover:bg-white/5"
              }`}
            >
              {repeat === "one" ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              onClick={() => setVolume(volume === 0 ? 70 : 0)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedAudioPlayer;
