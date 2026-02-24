"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Headphones, Guitar, User} from "lucide-react";
import PianoKeyboard from "@/src/components/studio/PianoKeyboard";
import DrumMachine from "@/src/components/studio/DrumMachine";
import MixerBoard from "@/src/components/studio/MixerBoard";
import MusicLibrary from "@/src/components/player/musicLibrary";
import Sequencer from "@/src/components/studio/Sequencer";
import { usePlayerStore } from "@/src/lib/store/playerStore";
import Link from "next/link";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"stream" | "studio">("stream");
  const { fetchLibrary } = usePlayerStore();

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  return (
    <div className="min-h-screen p-3 md:p-8 pb-32">
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="p-2 md:p-3 bg-[#FF3EA5] rounded-lg md:rounded-xl">
              <Music className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            <h1 className="text-xl md:text-3xl font-bold">Music Vault</h1>
          </div>
          {/* Navigation Buttons */}
          <div className="flex gap-1.5 md:gap-2">
            <button
              onClick={() => setActiveTab("stream")}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                activeTab === "stream"
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-1.5 md:gap-2">
                <Headphones className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Stream</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("studio")}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all text-sm md:text-base ${
                activeTab === "studio"
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <div className="flex items-center gap-1.5 md:gap-2">
                <Guitar className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Studio</span>
              </div>
            </button>
            <Link href="/dashboard">
              <button className="p-2 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <User className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </Link>
          </div>
        </div>
        <p className="text-white/70 mt-3 md:mt-4 text-xs md:text-base px-0.5">
          {activeTab === "stream"
            ? "Upload your music files and stream anytime"
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
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <PianoKeyboard />
              <DrumMachine />
            </div>
            <Sequencer />
            <MixerBoard />
          </div>
        )}
      </motion.div>
    </div>
  );
}
