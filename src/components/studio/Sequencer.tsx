/* eslint-disable react-hooks/set-state-in-effect */
// src/components/studio/Sequencer.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { Play, Pause, RefreshCw } from "lucide-react";
import { getDrums } from "@/src/lib/audio/instruments";

const STEPS = 16;
const TRACKS = ["Kick", "Snare", "HiHat", "Tom"] as const;

type TrackName = (typeof TRACKS)[number];

const Sequencer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120);

  // Grid state: Record<TrackName, boolean[]>
  const [grid, setGrid] = useState<Record<TrackName, boolean[]>>(() => {
    const initialGrid: Partial<Record<TrackName, boolean[]>> = {};
    TRACKS.forEach(track => {
      initialGrid[track] = Array(STEPS).fill(false);
    });
    return initialGrid as Record<TrackName, boolean[]>;
  });

  type DrumId = "kick" | "snare" | "hihat" | "tom";

  interface Drums {
    playSound: (id: DrumId) => void;
  }

  const drumsRef = useRef<Drums | null>(null);

  useEffect(() => {
    drumsRef.current = getDrums();

    // Setup Tone.js Loop
    const loop = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        TRACKS.forEach(track => {
          if (grid[track][step]) {
            // Convert track name to drum ID (lowercase)
            const drumId = track.toLowerCase().replace("-", "") as DrumId;
            drumsRef.current?.playSound(drumId);
          }
        });
      },
      Array.from({ length: STEPS }, (_, i) => i),
      "16n"
    );

    if (isPlaying) {
      Tone.Transport.start();
      loop.start(0);
    } else {
      Tone.Transport.stop();
      loop.stop();
      setCurrentStep(0);
    }

    return () => {
      loop.dispose();
    };
  }, [isPlaying, grid]);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const toggleStep = (track: TrackName, step: number) => {
    setGrid(prev => ({
      ...prev,
      [track]: prev[track].map((val, i) => (i === step ? !val : val)),
    }));
  };

  const handleClear = () => {
    const newGrid: Partial<Record<TrackName, boolean[]>> = {};
    TRACKS.forEach(track => {
      newGrid[track] = Array(STEPS).fill(false);
    });
    setGrid(newGrid as Record<TrackName, boolean[]>);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-white/10 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Sequencer</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
            <span className="text-xs text-white/60 px-2">BPM</span>
            <input
              type="number"
              value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              className="w-16 bg-transparent text-white text-right px-2 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-3 rounded-full ${
              isPlaying ? "bg-red-500" : "bg-green-500"
            } text-white hover:opacity-90 transition`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={handleClear}
            className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {TRACKS.map(track => (
          <div key={track} className="flex items-center gap-4">
            <div className="w-16 text-white/80 font-medium text-sm">
              {track}
            </div>
            <div className="flex-1 grid grid-cols-16 gap-1">
              {grid[track].map((active, step) => (
                <button
                  key={step}
                  onClick={() => toggleStep(track, step)}
                  className={`
                    h-8 rounded-sm transition-all duration-75
                    ${
                      active
                        ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        : "bg-white/10 hover:bg-white/20"
                    }
                    ${currentStep === step ? "border border-white/50" : ""}
                    ${step % 4 === 0 ? "ml-1" : ""} 
                  `}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sequencer;
