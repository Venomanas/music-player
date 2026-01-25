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
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { usePlayerStore } from "@/src/lib/store/playerStore";
import { useRouter } from "next/navigation";

// Mock User Data
const MOCK_USER = {
  name: "VenomAnas",
  bio: "Music producer & Beat maker. Love Lo-Fi and HipHop.",
  age: 21,
  avatar: "/default-avatar.png",
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

  type Mix = {
    id: string;
    name: string;
    createdAt: string | number | Date;
    bpm?: number;
  };

  const handleExportMix = (mix: Mix) => {
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
    console.log("Profile saved:", userProfile);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 to-purple-950 text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Profile Section */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl shrink-0">
                <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <UserIcon size={48} className="text-white/30" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 w-full text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      value={userProfile.name}
                      onChange={e =>
                        setUserProfile({ ...userProfile, name: e.target.value })
                      }
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white text-xl font-bold focus:outline-none focus:border-purple-500"
                    />
                    <textarea
                      value={userProfile.bio}
                      onChange={e =>
                        setUserProfile({ ...userProfile, bio: e.target.value })
                      }
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 h-20 resize-none"
                    />
                    <input
                      type="number"
                      value={userProfile.age}
                      onChange={e =>
                        setUserProfile({
                          ...userProfile,
                          age: parseInt(e.target.value),
                        })
                      }
                      className="w-24 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      {userProfile.name}
                    </h2>
                    <p className="text-white/70 mb-3">{userProfile.bio}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                      <span className="px-3 py-1 bg-purple-500/20 rounded-full">
                        Age: {userProfile.age}
                      </span>
                      <span className="px-3 py-1 bg-pink-500/20 rounded-full">
                        {mixes.length} Beats Created
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 rounded-full">
                        {likedTracks.length} Liked Songs
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Edit Button */}
              <div className="flex gap-3">
                {isEditing ? (
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                    <Save size={16} /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 border border-white/20 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <Edit3 size={16} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <div className="flex gap-2 md:gap-4 min-w-max md:min-w-0">
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
                label: "Playlists",
                icon: <ListMusic className="w-4 h-4" />,
              },
              {
                id: "studio",
                label: "Studio Beats",
                icon: <Mic2 className="w-4 h-4" />,
              },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/20 flex items-center gap-2 transition-all whitespace-nowrap text-sm md:text-base
                  ${
                    activeTab === tab.id
                      ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* STUDIO MIXES */}
              {activeTab === "studio" && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-4">
                    Your Studio Beats
                  </h3>
                  {mixes.length > 0 ? (
                    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-max md:min-w-0 pb-4 md:pb-0">
                        {mixes.map(mix => (
                          <div
                            key={mix.id}
                            className="bg-gray-900/50 p-6 rounded-2xl border border-white/10 group hover:border-purple-500/50 transition-colors min-w-[280px] md:min-w-0"
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
                            <h3 className="text-xl font-bold mb-2">
                              {mix.name}
                            </h3>
                            <p className="text-white/40 text-sm mb-4">
                              {new Date(mix.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-2 rounded-lg w-fit">
                              <span>{mix.bpm} BPM</span>
                              <span>•</span>
                              <span>16 Steps</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <EmptyState message="No beats created yet. Go to Studio!" />
                  )}
                </div>
              )}

              {/* PLAYLISTS */}
              {activeTab === "playlist" && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-4">
                    Your Playlists
                  </h3>
                  {playlists.length > 0 ? (
                    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-max md:min-w-0 pb-4 md:pb-0">
                        {playlists.map(playlist => (
                          <div
                            key={playlist.id}
                            className="relative aspect-square bg-gray-800 rounded-2xl overflow-hidden group border border-white/10 min-w-[200px] md:min-w-0"
                          >
                            {playlist.tracks[0]?.coverUrl ? (
                              <Image
                                src={playlist.tracks[0].coverUrl}
                                alt={playlist.name}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                unoptimized
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-purple-600 to-pink-600">
                                <ListMusic className="w-12 h-12 text-white/20" />
                              </div>
                            )}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                              <h3 className="text-2xl font-bold truncate">
                                {playlist.name}
                              </h3>
                              <p className="text-white/60">
                                {playlist.tracks.length} Songs
                              </p>
                            </div>
                            <button
                              onClick={() => deletePlaylist(playlist.id)}
                              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/60 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="mt-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors md:hidden">
                        <ChevronRight />
                      </button>
                    </div>
                  ) : (
                    <EmptyState message="No playlists found." />
                  )}
                </div>
              )}

              {/* LIKED/FAV MUSIC */}
              {(activeTab === "liked" || activeTab === "fav") && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-4">
                    {activeTab === "liked" ? "Liked Songs" : "Favorite Music"}
                  </h3>
                  {likedTracks.length > 0 ? (
                    <div className="space-y-2">
                      {likedTracks.map(track => (
                        <div
                          key={track.id}
                          className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                              <ListMusic className="w-6 h-6 text-white/30" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold truncate">
                              {track.title}
                            </h4>
                            <p className="text-xs text-white/60 truncate">
                              {track.artist}
                            </p>
                          </div>
                          <button className="p-2 bg-white text-black rounded-full hover:scale-105 transition-transform">
                            <Play size={14} fill="currentColor" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No liked songs yet." />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

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
