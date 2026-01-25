/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { Play, Pause, RefreshCw, Save } from "lucide-react";
import { getDrums } from "@/src/lib/audio/instruments";
import { usePlayerStore } from "@/src/lib/store/playerStore";

const STEPS = 16;
const TRACKS = ["Kick", "Snare", "HiHat", "Tom"] as const;

type TrackName = (typeof TRACKS)[number];
type DrumId = "kick" | "snare" | "hihat" | "tom";

interface Drums {
  playSound: (id: DrumId) => void;
}

const Sequencer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [mixName, setMixName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { saveMix } = usePlayerStore();

  const [grid, setGrid] = useState<Record<TrackName, boolean[]>>(() => {
    const initialGrid: Partial<Record<TrackName, boolean[]>> = {};
    TRACKS.forEach(track => {
      initialGrid[track] = Array(STEPS).fill(false);
    });
    return initialGrid as Record<TrackName, boolean[]>;
  });

  const drumsRef = useRef<Drums | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize drums
  useEffect(() => {
    if (!isInitializedRef.current) {
      drumsRef.current = getDrums();
      isInitializedRef.current = true;
    }

    return () => {
      // Cleanup on unmount
      if (sequenceRef.current) {
        try {
          sequenceRef.current.stop();
          sequenceRef.current.dispose();
          sequenceRef.current = null;
        } catch (e) {
          console.warn("Cleanup error:", e);
        }
      }

      try {
        Tone.Transport.stop();
        Tone.Transport.cancel();
      } catch (e) {
        console.warn("Transport cleanup error:", e);
      }
    };
  }, []);

  // Handle BPM changes
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  // Handle play/pause and grid changes
  useEffect(() => {
    // Clean up existing sequence
    if (sequenceRef.current) {
      try {
        sequenceRef.current.stop();
        sequenceRef.current.dispose();
        sequenceRef.current = null;
      } catch (e) {
        console.warn("Error disposing sequence:", e);
      }
    }

    // Only create sequence if playing
    if (isPlaying) {
      try {
        sequenceRef.current = new Tone.Sequence(
          (time, step) => {
            // Update UI on main thread
            Tone.Draw.schedule(() => {
              setCurrentStep(step);
            }, time);

            // Play sounds
            TRACKS.forEach(track => {
              if (grid[track][step]) {
                const drumId = track.toLowerCase().replace("-", "") as DrumId;
                drumsRef.current?.playSound(drumId);
              }
            });
          },
          Array.from({ length: STEPS }, (_, i) => i),
          "16n",
        );

        // Start transport if not already started
        if (Tone.Transport.state !== "started") {
          Tone.Transport.start();
        }

        sequenceRef.current.start(0);
      } catch (error) {
        console.error("Error creating sequence:", error);
        setIsPlaying(false);
      }
    } else {
      // Stop transport and reset step
      try {
        Tone.Transport.stop();
        setCurrentStep(0);
      } catch (e) {
        console.warn("Error stopping transport:", e);
      }
    }
  }, [isPlaying, grid]);

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

  const handlePlayPause = async () => {
    try {
      if (!isPlaying) {
        // Initialize audio context
        await Tone.start();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const loadPattern = (patternName: string) => {
    const newGrid = { ...grid };

    switch (patternName) {
      case "basic":
        newGrid.Kick = [
          true,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
        ];
        newGrid.Snare = [
          false,
          false,
          true,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
          true,
          false,
        ];
        newGrid.HiHat = Array(16)
          .fill(false)
          .map((_, i) => i % 2 === 0);
        newGrid.Tom = Array(16).fill(false);
        break;

      case "rock":
        newGrid.Kick = [
          true,
          false,
          false,
          true,
          false,
          false,
          true,
          false,
          true,
          false,
          false,
          true,
          false,
          false,
          true,
          false,
        ];
        newGrid.Snare = [
          false,
          false,
          true,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
          true,
          false,
        ];
        newGrid.HiHat = Array(16).fill(true);
        newGrid.Tom = Array(16).fill(false);
        break;

      case "hiphop":
        newGrid.Kick = [
          true,
          false,
          false,
          false,
          false,
          false,
          true,
          false,
          false,
          true,
          false,
          false,
          false,
          false,
          true,
          false,
        ];
        newGrid.Snare = [
          false,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
        ];
        newGrid.HiHat = [
          true,
          false,
          true,
          true,
          false,
          true,
          true,
          false,
          true,
          false,
          true,
          true,
          false,
          true,
          true,
          false,
        ];
        newGrid.Tom = Array(16).fill(false);
        break;

      case "trap":
        newGrid.Kick = [
          true,
          false,
          false,
          false,
          true,
          false,
          false,
          false,
          true,
          false,
          true,
          false,
          true,
          false,
          false,
          false,
        ];
        newGrid.Snare = [
          false,
          false,
          false,
          false,
          true,
          false,
          false,
          true,
          false,
          false,
          false,
          false,
          true,
          false,
          false,
          true,
        ];
        newGrid.HiHat = Array(16)
          .fill(false)
          .map((_, i) => i % 2 === 1);
        newGrid.Tom = [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          true,
          false,
          true,
          false,
          false,
        ];
        break;
    }

    setGrid(newGrid);
  };

  const handleSaveMix = () => {
    if (!mixName.trim()) {
      alert("Please enter a name for your beat");
      return;
    }

    const mix = {
      id: Date.now().toString(),
      name: mixName,
      bpm,
      gridData: grid,
      createdAt: new Date(),
    };

    saveMix(mix);
    setShowSaveDialog(false);
    setMixName("");
    alert("Beat saved to Dashboard!");
  };

  return (
    <div className="bg-gray-900 p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-white">Sequencer</h3>

        <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
          {/* BPM Control */}
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1 flex-1 sm:flex-initial">
            <span className="text-xs text-white/60 px-2">BPM</span>
            <input
              type="number"
              value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              min="60"
              max="200"
              className="w-14 md:w-16 bg-transparent text-white text-right px-2 py-1 focus:outline-none text-sm md:text-base"
            />
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className={`p-2.5 md:p-3 rounded-full ${
              isPlaying
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white transition-colors shadow-lg`}
          >
            {isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} className="ml-0.5" />
            )}
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="p-2.5 md:p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors"
            title="Clear Pattern"
          >
            <RefreshCw size={18} />
          </button>

          {/* Save Button */}
          <button
            onClick={() => setShowSaveDialog(true)}
            className="p-2.5 md:p-3 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors"
            title="Save Beat"
          >
            <Save size={18} />
          </button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Save Beat</h3>
            <input
              type="text"
              value={mixName}
              onChange={e => setMixName(e.target.value)}
              placeholder="Enter beat name..."
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setMixName("");
                }}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMix}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-bold transition-colors"
              >
                Save to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sequencer Grid */}
      <div className="space-y-2 md:space-y-3 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        {TRACKS.map(track => (
          <div
            key={track}
            className="flex items-center gap-2 md:gap-4 min-w-max md:min-w-0"
          >
            {/* Track Label */}
            <div className="w-12 md:w-16 shrink-0">
              <span className="text-white/80 font-medium text-xs md:text-sm">
                {track}
              </span>
            </div>

            {/* Step Grid */}
            <div className="flex-1 grid grid-cols-16 gap-1 md:gap-1.5">
              {grid[track].map((active, step) => (
                <button
                  key={step}
                  onClick={() => toggleStep(track, step)}
                  className={`
                    h-8 md:h-10 rounded-sm transition-all duration-100
                    ${
                      active
                        ? "bg-linear-to-br from-yellow-400 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                        : "bg-white/10 hover:bg-white/20"
                    }
                    ${currentStep === step && isPlaying ? "ring-2 ring-white/70 scale-95" : ""}
                    ${step % 4 === 0 ? "ml-0.5 md:ml-1" : ""}
                    active:scale-90
                  `}
                  aria-label={`${track} step ${step + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Patterns */}
      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10">
        <h4 className="text-white/80 text-xs md:text-sm mb-2 md:mb-3">
          Quick Patterns:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => loadPattern("basic")}
            className="px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm transition-colors"
          >
            Basic Beat
          </button>
          <button
            onClick={() => loadPattern("rock")}
            className="px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm transition-colors"
          >
            Rock
          </button>
          <button
            onClick={() => loadPattern("hiphop")}
            className="px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm transition-colors"
          >
            Hip Hop
          </button>
          <button
            onClick={() => loadPattern("trap")}
            className="px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm transition-colors"
          >
            Trap
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sequencer;
