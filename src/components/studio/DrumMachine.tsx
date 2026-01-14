/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { getDrums } from "@/src/lib/audio/instruments";

const DrumMachine: React.FC = () => {
  const [activePad, setActivePad] = useState<string | null>(null);

     const [drums, setDrums] = useState<any>(null);

     useEffect(() => {
       // Initialize drums only on client side
       if (typeof window !== "undefined") {
         setDrums(getDrums()); // Use getDrums() instead of drums
       }
     }, []);

    // const [piano, setPiano] = useState<Piano | null>(null);

  const drumPads = [
    { id: "kick", label: "Kick", color: "bg-red-500", key: "Q" },
    { id: "snare", label: "Snare", color: "bg-blue-500", key: "W" },
    { id: "hihat", label: "Hi-Hat", color: "bg-green-500", key: "E" },
    { id: "tom", label: "Tom", color: "bg-yellow-500", key: "R" },
    { id: "clap", label: "Clap", color: "bg-purple-500", key: "A" },
    { id: "crash", label: "Crash", color: "bg-pink-500", key: "S" },
    { id: "ride", label: "Ride", color: "bg-indigo-500", key: "D" },
    { id: "cowbell", label: "Cowbell", color: "bg-orange-500", key: "F" },
  ];

  type DrumKey =
    | "kick"
    | "snare"
    | "hihat"
    | "tom"
    | "clap"
    | "crash"
    | "ride"
    | "cowbell";

  const isDrumKey = (id: string): id is DrumKey =>
    (
      [
        "kick",
        "snare",
        "hihat",
        "tom",
        "clap",
        "crash",
        "ride",
        "cowbell",
      ] as const
    ).includes(id as DrumKey);

  const playDrum = (padId: string) => {
    if (isDrumKey(padId)) {
      drums.playSound(padId);
    }
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 100);
  };

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pad = drumPads.find(p => p.key === e.key.toUpperCase());
      if (pad) {
        playDrum(pad.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Drum Machine</h3>

      <div className="grid grid-cols-4 gap-4">
        {drumPads.map(pad => (
          <motion.button
            key={pad.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => playDrum(pad.id)}
            className={`
              relative aspect-square rounded-xl flex flex-col items-center justify-center
              ${pad.color} ${activePad === pad.id ? "ring-4 ring-white/50" : ""}
              hover:brightness-110 transition-all duration-150
            `}
          >
            <span className="text-white font-bold text-lg">{pad.label}</span>
            <span className="text-white/80 text-xs mt-1">[{pad.key}]</span>
          </motion.button>
        ))}
      </div>
      <div className="mt-6">
        <h4 className="text-white/80 text-sm mb-2">Quick Patterns:</h4>
        <div className="flex gap-2">
          {[
            { name: "Basic Beat", pattern: ["kick", "snare", "hihat"] },
            { name: "Rock", pattern: ["kick", "snare", "crash"] },
            { name: "Hip Hop", pattern: ["kick", "snare", "hihat", "clap"] },
          ].map(pattern => (
            <button
              key={pattern.name}
              onClick={() => {
                pattern.pattern.forEach((sound, i) => {
                  setTimeout(() => {
                    if (isDrumKey(sound)) {
                      drums.playSound(sound);
                    }
                  }, i * 200);
                });
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm"
            >
              {pattern.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrumMachine;
