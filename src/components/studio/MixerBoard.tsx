"use client";

import React from "react";
import { VolumeX } from "lucide-react";

interface Track {
  id: string;
  name: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
}

const MixerBoard: React.FC = () => {
  const [tracks, setTracks] = React.useState<Track[]>([
    { id: "1", name: "Kick", volume: 80, pan: 0, mute: false, solo: false },
    { id: "2", name: "Snare", volume: 75, pan: 0, mute: false, solo: false },
    { id: "3", name: "Hi-Hat", volume: 70, pan: 0, mute: false, solo: false },
    { id: "4", name: "Bass", volume: 85, pan: 0, mute: false, solo: false },
    { id: "5", name: "Synth", volume: 65, pan: 0, mute: false, solo: false },
    { id: "6", name: "Vocals", volume: 90, pan: 0, mute: false, solo: false },
  ]);

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(
      tracks.map(track => (track.id === id ? { ...track, ...updates } : track))
    );
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6">Mixer Board</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {tracks.map(track => (
          <div key={track.id} className="bg-gray-800/50 p-4 rounded-xl">
            <div className="mb-4">
              <h4 className="text-white font-semibold text-center">
                {track.name}
              </h4>

              {/* Volume Slider */}
              <div className="my-4">
                <div className="h-40 w-6 bg-gray-700 rounded-lg mx-auto relative">
                  <div
                    className="absolute bottom-0 w-full bg-linear-to-t from-[#f31b1b] to-[#FF0087] rounded-lg transition-all"
                    style={{ height: `${track.volume}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={track.volume}
                    onChange={e =>
                      updateTrack(track.id, {
                        volume: parseInt(e.target.value),
                      })
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-orientation="vertical"
                  />
                </div>
                <div className="text-center mt-2 text-white text-sm">
                  {track.volume}%
                </div>
              </div>

              {/* Pan Control */}
              <div className="mb-4">
                <label className="block text-white/70 text-xs mb-1">Pan</label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={track.pan}
                  onChange={e =>
                    updateTrack(track.id, { pan: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="text-center text-white/60 text-xs mt-1">
                  {track.pan > 0
                    ? `R ${track.pan}`
                    : track.pan < 0
                      ? `L ${-track.pan}`
                      : "C"}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => updateTrack(track.id, { mute: !track.mute })}
                  className={`p-2 rounded-lg ${
                    track.mute ? "bg-red-500" : "bg-gray-700"
                  } hover:opacity-80`}
                >
                  <VolumeX className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => updateTrack(track.id, { solo: !track.solo })}
                  className={`p-2 rounded-lg ${
                    track.solo ? "bg-yellow-500" : "bg-gray-700"
                  } hover:opacity-80`}
                >
                  <span className="text-white text-xs font-bold">S</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Master Controls */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold mb-4">Master Channel</h4>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <label className="block text-white/70 text-sm mb-2">
              Master Volume
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className="w-full"
            />
          </div>
          <button className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90">
            Export Mix
          </button>
        </div>
      </div>
    </div>
  );
};

export default MixerBoard;
