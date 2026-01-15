// src/components/player/VolumeControl.tsx
"use client";

import React from "react";
import { Volume2, Volume1, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  className?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  className = "",
}) => {
  const handleMuteToggle = () => {
    if (volume === 0) onVolumeChange(50);
    else onVolumeChange(0);
  };

  const getIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 50) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleMuteToggle}
        className="text-white/80 hover:text-white transition-colors"
      >
        {getIcon()}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={e => onVolumeChange(Number(e.target.value))}
        className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
      />
    </div>
  );
};

export default VolumeControl;
