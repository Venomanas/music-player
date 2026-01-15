// src/components/player/AudioPlayer.tsx
"use client";

import React from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { usePlayerStore } from "@/src/lib/store/playerStore";
import { audioPlayer } from "@/src/lib/audio/player";
import Image from "next/image";

const AudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying } = usePlayerStore();

  const handlePlayPause = () => {
    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      audioPlayer.resume();
      setIsPlaying(true);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4 border border-white/10 shadow-xl">
      <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
        <Image
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          width={64}
          height={64}
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white truncate">{currentTrack.title}</h4>
        <p className="text-sm text-white/60 truncate">{currentTrack.artist}</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-white/60 hover:text-white">
          <SkipBack size={20} />
        </button>
        <button
          onClick={handlePlayPause}
          className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition"
        >
          {isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
        </button>
        <button className="p-2 text-white/60 hover:text-white">
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
