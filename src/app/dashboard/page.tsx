// src/app/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ListMusic,
  Mic2,
  Download,
  Trash2,
  Play,
  Edit3,
  Save,
  User as UserIcon,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { usePlayerStore } from "@/src/lib/store/playerStore";
import { useRouter } from "next/navigation";

// Mock User Data (Replace with Supabase Auth later)
const MOCK_USER = {
  name: "VenomAnas",
  bio: "Music producer & Beat maker. Love Lo-Fi and HipHop.",
  age: 21,
  avatar: "/default-avatar.png", // Ensure you have this or use a placeholder
};

export default function DashboardPage() {
  const router = useRouter();
  const { likedTracks, playlists, mixes, deleteMix, deletePlaylist } =
    usePlayerStore();

  const [activeTab, setActiveTab] = useState<
    "fav" | "liked" | "playlist" | "studio"
  >("liked");
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(MOCK_USER);

  // --- Types ---
  type Mix = {
    id: string;
    name: string;
    createdAt: string | number | Date;
    bpm?: number;
  };

  // --- Handlers ---
  const handleExportMix = (mix: Mix) => {
    // Convert mix data to JSON and trigger download
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mix));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${mix.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Add Supabase update logic here
    console.log("Profile saved:", userProfile);
  };

  return (
    <div className="min-h-screen p-8 pt-24 text-white flex gap-8">
      {/* LEFT SECTION: MAIN CONTENT */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4">
          {[
            {
              id: "fav",
              label: "Fav Music",
              icon: <Heart className="w-4 h-4" />,
            },
            {
              id: "liked",
              label: "Liked Music",
              icon: <Heart className="w-4 h-4 fill-current" />,
            },
            {
              id: "playlist",
              label: "Playlist Music",
              icon: <ListMusic className="w-4 h-4" />,
            },
            {
              id: "studio",
              label: "Studio Created Music",
              icon: <Mic2 className="w-4 h-4" />,
            },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "fav" | "liked" | "playlist" | "studio")
              }
              className={`
                px-6 py-3 rounded-full border border-white/20 flex items-center gap-2 transition-all
                ${
                  activeTab === tab.id
                    ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {/* --- RENDER LOGIC BASED ON TAB --- */}

              {/* 1. STUDIO MIXES */}
              {activeTab === "studio" &&
                (mixes.length > 0 ? (
                  mixes.map(mix => (
                    <div
                      key={mix.id}
                      className="bg-gray-900/50 p-6 rounded-2xl border border-white/10 group hover:border-purple-500/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-600/20 rounded-xl">
                          <Mic2 className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleExportMix(mix)}
                            title="Export JSON"
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-green-400"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => deleteMix(mix.id)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-red-400"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold">{mix.name}</h3>
                      <p className="text-white/40 text-sm mb-4">
                        {new Date(mix.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 rounded-lg w-fit">
                        <span>{mix.bpm} BPM</span>
                        <span>•</span>
                        <span>16 Steps</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="No beats created yet. Go to Studio!" />
                ))}

              {/* 2. PLAYLISTS */}
              {activeTab === "playlist" &&
                (playlists.length > 0 ? (
                  playlists.map(playlist => (
                    <div
                      key={playlist.id}
                      className="relative aspect-square bg-gray-800 rounded-2xl overflow-hidden group border border-white/10"
                    >
                      {/* Cover */}
                      {playlist.tracks[0]?.coverUrl ? (
                        <Image
                          src={playlist.tracks[0].coverUrl}
                          alt={playlist.name}
                          fill
                          className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                          <ListMusic className="w-12 h-12 text-white/20" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <h3 className="text-2xl font-bold truncate">
                          {playlist.name}
                        </h3>
                        <p className="text-white/60">
                          {playlist.tracks.length} Songs
                        </p>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => deletePlaylist(playlist.id)}
                        className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/60 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <EmptyState message="No playlists found." />
                ))}

              {/* 3. LIKED / FAV MUSIC */}
              {(activeTab === "liked" || activeTab === "fav") &&
                (likedTracks.length > 0 ? (
                  likedTracks.map(track => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={track.coverUrl}
                          fill
                          alt={track.title}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate">{track.title}</h4>
                        <p className="text-xs text-white/60 truncate">
                          {track.artist}
                        </p>
                      </div>
                      <button className="p-2 bg-white text-black rounded-full hover:scale-105 transition-transform">
                        <Play size={14} fill="currentColor" />
                      </button>
                    </div>
                  ))
                ) : (
                  <EmptyState message="No liked songs yet." />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SECTION: USER PROFILE SIDEBAR */}
      <aside className="w-80 shrink-0 flex flex-col gap-6">
        <div className="border-l border-white/10 pl-8 h-full">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <UserIcon size={48} className="text-white/20" />
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-200"
                >
                  <Save size={16} /> Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 border border-white/20 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-white/10"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl" />

            {/* Fields */}
            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase tracking-wider font-bold">
                Name
              </label>
              {isEditing ? (
                <input
                  value={userProfile.name}
                  onChange={e =>
                    setUserProfile({ ...userProfile, name: e.target.value })
                  }
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                />
              ) : (
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase tracking-wider font-bold">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={userProfile.bio}
                  onChange={e =>
                    setUserProfile({ ...userProfile, bio: e.target.value })
                  }
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500 h-24 resize-none"
                />
              ) : (
                <p className="text-white/80 leading-relaxed text-sm">
                  {userProfile.bio}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40 uppercase tracking-wider font-bold">
                Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={e =>
                    setUserProfile({
                      ...userProfile,
                      age: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                />
              ) : (
                <p className="text-xl font-mono text-purple-400">
                  {userProfile.age}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-auto pt-8 flex justify-end">
            <button
              onClick={() => router.push("/")}
              className="p-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all group"
            >
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

// Simple Helper Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/40 gap-4">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
        <ListMusic size={32} className="opacity-50" />
      </div>
      <p>{message}</p>
    </div>
  );
}
