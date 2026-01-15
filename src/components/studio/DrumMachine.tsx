/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDrums, type DrumSound } from "@/src/lib/audio/instruments"; // Import DrumSound type

const DrumMachine: React.FC = () => {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [drums, setDrums] = useState<ReturnType<typeof getDrums> | null>(null);

  useEffect(() => {
    // Initialize drums only on client side
    if (typeof window !== "undefined") {
      setDrums(getDrums());
    }
  }, []);

  const drumPads: Array<{
    id: DrumSound;
    label: string;
    color: string;
    key: string;
  }> = [
    { id: "kick", label: "Kick", color: "bg-red-500", key: "Z" },
    { id: "snare", label: "Snare", color: "bg-blue-500", key: "X" },
    { id: "hihat", label: "Hi-Hat", color: "bg-green-500", key: "C" },
    { id: "tom", label: "Tom", color: "bg-yellow-500", key: "V" },
    { id: "clap", label: "Clap", color: "bg-purple-500", key: "B" },
    { id: "crash", label: "Crash", color: "bg-pink-500", key: "N" },
    { id: "ride", label: "Ride", color: "bg-indigo-500", key: "M" },
    { id: "cowbell", label: "Cowbell", color: "bg-orange-500", key: "L" },
  ];

  const playDrum = async (padId: DrumSound) => {
    if (!drums) return;

    await drums.playSound(padId);
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 100);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!drums) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const pad = drumPads.find(p => p.key === e.key.toUpperCase());
      if (pad) {
        playDrum(pad.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drumPads, drums, playDrum]);

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Drum Machine</h3>

      <div className="grid grid-cols-4 gap-4">
        {drumPads.map(pad => (
          <motion.button
            key={pad.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => playDrum(pad.id)}
            disabled={!drums}
            className={`
              relative aspect-square rounded-xl flex flex-col items-center justify-center
              ${pad.color} ${activePad === pad.id ? "ring-4 ring-white/50" : ""}
              hover:brightness-110 transition-all duration-150 disabled:opacity-50
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
            {
              name: "Basic Beat",
              pattern: [
                "kick" as DrumSound,
                "snare" as DrumSound,
                "hihat" as DrumSound,
              ],
            },
            {
              name: "Rock",
              pattern: [
                "kick" as DrumSound,
                "snare" as DrumSound,
                "crash" as DrumSound,
              ],
            },
            {
              name: "Hip Hop",
              pattern: [
                "kick" as DrumSound,
                "snare" as DrumSound,
                "hihat" as DrumSound,
                "clap" as DrumSound,
              ],
            },
          ].map(pattern => (
            <button
              key={pattern.name}
              onClick={async () => {
                if (!drums) return;

                for (let i = 0; i < pattern.pattern.length; i++) {
                  const sound = pattern.pattern[i];
                  setTimeout(async () => {
                    await drums.playSound(sound);
                  }, i * 200);
                }
              }}
              disabled={!drums}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm disabled:opacity-50"
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
