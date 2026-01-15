/* eslint-disable react-hooks/immutability */
// src/components/studio/PianoKeyboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPiano, PianoType } from "@/src/lib/audio/instruments";

const PianoKeyboard: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [instrumentType, setInstrumentType] = useState<PianoType>("grand");
  const piano = getPiano();

  // Keyboard mapping: Key -> Note
  const keyMap: Record<string, string> = {
    a: "C4",
    w: "C#4",
    s: "D4",
    e: "D#4",
    d: "E4",
    f: "F4",
    t: "F#4",
    g: "G4",
    y: "G#4",
    h: "A4",
    u: "A#4",
    j: "B4",
    k: "C5",
  };

  useEffect(() => {
    // Handle physical keyboard press
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keyMap[key] && !e.repeat) {
        playNote(
          keyMap[key].replace("4", "").replace("5", ""),
          keyMap[key].includes("5") ? 5 : 4
        );
      }
    };

    const handleKeyUp = () => {
      // Optional: Logic to stop note sustain if needed
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  },);

  // Update instrument sound when type changes
  useEffect(() => {
    piano.setInstrumentType(instrumentType);
  }, [instrumentType, piano]);

  const playNote = (note: string, octave: number = 4) => {
    const fullNote = `${note}${octave}`;
    piano.playNote(fullNote, "8n");
    setActiveNotes(prev => [...prev, fullNote]);
    setTimeout(() => {
      setActiveNotes(prev => prev.filter(n => n !== fullNote));
    }, 200);
  };

  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-white/10 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Piano</h3>

        {/* Instrument Selector */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          {(["grand", "electric", "synth", "organ"] as PianoType[]).map(
            type => (
              <button
                key={type}
                onClick={() => setInstrumentType(type)}
                className={`px-3 py-1 rounded-md text-sm capitalize transition-all ${
                  instrumentType === type
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {type}
              </button>
            )
          )}
        </div>
      </div>

      <div className="relative h-48 select-none">
        {/* White Keys */}
        <div className="flex h-full">
          {whiteKeys.map((note, index) => {
            const noteName = `${note}4`;
            return (
              <motion.button
                key={`white-${note}`}
                whileTap={{ scale: 0.98 }}
                onMouseDown={() => playNote(note)}
                className={`
                  relative flex-1 bg-white border border-gray-300 rounded-b-lg
                  active:bg-gray-200 transition-colors
                  ${activeNotes.includes(noteName) ? "bg-purple-200" : ""}
                  ${index === 0 ? "rounded-bl-xl" : ""}
                  ${index === whiteKeys.length - 1 ? "rounded-br-xl" : ""}
                `}
              >
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-400 text-xs">
                  {/* Show keyboard shortcut hint */}
                  {Object.keys(keyMap)
                    .find(k => keyMap[k] === noteName)
                    ?.toUpperCase()}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Black Keys */}
        <div className="absolute top-0 left-0 w-full h-32 flex pointer-events-none">
          {/* Spacer for C */}
          <div className="flex-[0.5]" />

          {/* C# */}
          <div className="flex-1 flex justify-center pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseDown={() => playNote("C#")}
              className={`w-2/3 h-full bg-black rounded-b-lg border-x border-b border-gray-800 z-10 ${
                activeNotes.includes("C#4") ? "bg-purple-600" : ""
              }`}
            />
          </div>

          {/* D# */}
          <div className="flex-1 flex justify-center pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseDown={() => playNote("D#")}
              className={`w-2/3 h-full bg-black rounded-b-lg border-x border-b border-gray-800 z-10 ${
                activeNotes.includes("D#4") ? "bg-purple-600" : ""
              }`}
            />
          </div>

          {/* Spacer between E and F */}
          <div className="flex-1" />

          {/* F# */}
          <div className="flex-1 flex justify-center pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseDown={() => playNote("F#")}
              className={`w-2/3 h-full bg-black rounded-b-lg border-x border-b border-gray-800 z-10 ${
                activeNotes.includes("F#4") ? "bg-purple-600" : ""
              }`}
            />
          </div>

          {/* G# */}
          <div className="flex-1 flex justify-center pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseDown={() => playNote("G#")}
              className={`w-2/3 h-full bg-black rounded-b-lg border-x border-b border-gray-800 z-10 ${
                activeNotes.includes("G#4") ? "bg-purple-600" : ""
              }`}
            />
          </div>

          {/* A# */}
          <div className="flex-1 flex justify-center pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onMouseDown={() => playNote("A#")}
              className={`w-2/3 h-full bg-black rounded-b-lg border-x border-b border-gray-800 z-10 ${
                activeNotes.includes("A#4") ? "bg-purple-600" : ""
              }`}
            />
          </div>

          {/* Spacer for B */}
          <div className="flex-[0.5]" />
        </div>
      </div>
    </div>
  );
};

export default PianoKeyboard;
