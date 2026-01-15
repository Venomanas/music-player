// src/components/studio/DrumPad.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface DrumPadProps {
  id: string;
  label: string;
  shortcut: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const DrumPad: React.FC<DrumPadProps> = ({
  label,
  shortcut,
  color,
  isActive,
  onClick,
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative aspect-square rounded-xl flex flex-col items-center justify-center
        ${color} 
        ${isActive ? "ring-4 ring-white/50 brightness-125" : "brightness-100"}
        hover:brightness-110 transition-all duration-100 shadow-lg
      `}
    >
      <span className="text-white font-bold text-xl drop-shadow-md">
        {label}
      </span>
      <div className="absolute bottom-2 right-2 bg-black/20 px-2 py-0.5 rounded text-[10px] text-white/90 font-mono">
        {shortcut}
      </div>
    </motion.button>
  );
};

export default DrumPad;
