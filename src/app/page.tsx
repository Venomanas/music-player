"use client";

import { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Headphones, Guitar, Drum } from "lucide-react";
import PianoKeyboard from "@/src/components/studio/PianoKeyboard";
import DrumMachine from "@/src/components/studio/DrumMachine";
import MixerBoard from "@/src/components/studio/MixerBoard";
import MusicLibrary from "@/src/components/player/musicLibrary"; 
import Sequencer from "@/src/components/studio/Sequencer";
import { usePlayerStore } from "@/src/lib/store/playerStore";
import { User } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"stream" | "studio">("stream");
  const { fetchLibrary } = usePlayerStore();

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl">
              <Music className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">MusicStream</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("stream")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "stream"
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                <span>Stream</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("studio")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "studio"
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <Guitar className="w-5 h-5" />
                <span>Studio</span>
              </div>
            </button>
          {/* Add this button */}
          <Link href="/dashboard">
            <button className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
          </Link>
        </div>
          </div>
          

        <p className="text-white/70 mt-4">
          {activeTab === "stream"
            ? "Discover and stream music from around the world"
            : "Create your own music with virtual instruments and mixing tools"}
        </p>
      </header>

      {/* Main Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "stream" ? (
          <MusicLibrary />
        ) : (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <PianoKeyboard />
              <DrumMachine />
            </div>
            <Sequencer />
            <MixerBoard />

            <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">
                Quick Start Guide
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Music className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">
                    1. Play Instruments
                  </h4>
                  <p className="text-white/60 text-sm">
                    Click piano keys or drum pads to play sounds
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Drum className="w-6 h-6 text-pink-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">
                    2. Adjust Mix
                  </h4>
                  <p className="text-white/60 text-sm">
                    Use mixer controls to adjust volume and pan
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Guitar className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">
                    3. Export Music
                  </h4>
                  <p className="text-white/60 text-sm">
                    Export your creation as audio file
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
