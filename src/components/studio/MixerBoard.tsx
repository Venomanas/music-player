"use client";

import React from "react";
import { VolumeX, Download } from "lucide-react";
import { usePlayerStore } from "@/src/lib/store/playerStore";

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

  const [masterVolume, setMasterVolume] = React.useState(80);
  const { saveMix } = usePlayerStore();

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(
      tracks.map(track => (track.id === id ? { ...track, ...updates } : track)),
    );
  };

  const handleExportMix = () => {
    const mixData = {
      id: Date.now().toString(),
      name: `Mix-${new Date().toLocaleDateString()}`,
      bpm: 120,
      // Provide a sequencer pattern for each track (16 steps default)
      gridData: Object.fromEntries(
        tracks.map(t => [t.id, new Array(16).fill(false)])
      ) as Record<string, boolean[]>,
      tracks: tracks,
      masterVolume: masterVolume,
      createdAt: new Date(),
    };

    // Save to store
    saveMix(mixData);

    // Also download as JSON
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(mixData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${mixData.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    alert("Mix saved to Dashboard and exported!");
  };

  return (
    <div className="bg-gray-900 p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10">
      <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
        Mixer Board
      </h3>

      {/* Tracks - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-w-max md:min-w-0 pb-4 md:pb-0">
          {tracks.map(track => (
            <div
              key={track.id}
              className="bg-gray-800/50 p-4 rounded-xl min-w-[140px] md:min-w-0"
            >
              <div className="mb-4">
                <h4 className="text-white font-semibold text-center text-sm md:text-base">
                  {track.name}
                </h4>

                {/* Volume Slider */}
                <div className="my-4">
                  <div className="h-32 md:h-40 w-6 bg-gray-700 rounded-lg mx-auto relative">
                    <div
                      className="absolute bottom-0 w-full bg-linear-to-t from-red-500 to-pink-500 rounded-lg transition-all"
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
                      style={{
                        writingMode: "vertical-lr",
                        WebkitAppearance: "slider-vertical",
                      }}
                      aria-orientation="vertical"
                    />
                  </div>
                  <div className="text-center mt-2 text-white text-xs md:text-sm">
                    {track.volume}%
                  </div>
                </div>

                {/* Pan Control */}
                <div className="mb-4">
                  <label className="block text-white/70 text-xs mb-1">
                    Pan
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={track.pan}
                    onChange={e =>
                      updateTrack(track.id, { pan: parseInt(e.target.value) })
                    }
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
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
                    } hover:opacity-80 transition-opacity`}
                  >
                    <VolumeX className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => updateTrack(track.id, { solo: !track.solo })}
                    className={`p-2 rounded-lg ${
                      track.solo ? "bg-yellow-500" : "bg-gray-700"
                    } hover:opacity-80 transition-opacity`}
                  >
                    <span className="text-white text-xs font-bold">S</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Controls */}
      <div className="pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold mb-4 text-sm md:text-base">
          Master Channel
        </h4>
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
          <div className="flex-1 w-full">
            <label className="block text-white/70 text-xs md:text-sm mb-2">
              Master Volume
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={e => setMasterVolume(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
            <div className="text-center text-white mt-2 font-bold">
              {masterVolume}%
            </div>
          </div>
          <button
            onClick={handleExportMix}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Download size={18} />
            Export Mix
          </button>
        </div>
      </div>
    </div>
  );
};

export default MixerBoard;
