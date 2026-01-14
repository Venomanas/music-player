/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPiano } from "@/src/lib/audio/instruments";

type Piano = {
  playNote: (note: string, duration?: string) => void;
};

const PianoKeyboard: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [piano, setPiano] = useState<Piano | null>(null);
  useEffect(() => {
    // Initialize piano only on client side
    if (typeof window !== "undefined") {
      setPiano(getPiano() as Piano); // Use getPiano() instead of piano
    }
  }, []);
  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const blackKeys = ["C#", "D#", "F#", "G#", "A#"];

  const playNote = (note: string, octave: number = 4) => {
    if (!piano) return;
    const fullNote = `${note}${octave}`;
    piano.playNote(fullNote, "8n");

    setActiveNotes(prev => [...prev, fullNote]);
    setTimeout(() => {
      setActiveNotes(prev => prev.filter(n => n !== fullNote));
    }, 300);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-white/10">
      <div className="relative h-48">
        {/* White Keys */}
        <div className="flex">
          {whiteKeys.map((note, index) => (
            <motion.button
              key={`white-${note}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => playNote(note)}
              className={`
                relative w-12 h-full bg-white border border-gray-300 rounded-b-lg
                hover:bg-gray-100 active:bg-gray-200
                ${activeNotes.includes(`${note}4`) ? "bg-yellow-100" : ""}
                ${index === whiteKeys.length - 1 ? "" : "mr-1"}
              `}
            >
              <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-800 text-sm">
                {note}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Black Keys */}
        <div className="absolute top-0 left-6 flex">
          {blackKeys.map((note, index) => (
            <motion.button
              key={`black-${note}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => playNote(note)}
              className={`
                relative w-8 h-32 bg-gray-800 rounded-b-lg
                hover:bg-gray-700 active:bg-gray-900
                ${activeNotes.includes(`${note}4`) ? "bg-yellow-600" : ""}
                ml-${index === 1 || index === 3 ? "7" : "6"}
              `}
            >
              <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs">
                {note}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {["C4", "D4", "E4", "F4", "G4", "A4", "B4"].map(note => (
          <button
            key={note}
            onClick={() => piano?.playNote(note, "8n")}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm"
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PianoKeyboard;
