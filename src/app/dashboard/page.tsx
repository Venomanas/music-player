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
  Music2,
  Clock,
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

  const handleExportAllMixes = () => {
    if (mixes.length === 0) return;

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(mixes, null, 2));

    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "studio-beats.json";
    a.click();
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    console.log("Profile saved:", userProfile);
  };

  const handleCreatePlaylist = () => {
    const name = prompt("Enter playlist name");
    if (!name) return;
    usePlayerStore.getState().createPlaylist(name);
  };

  const handleOpenPlaylist = (playlistId: string) => {
    console.log("Open playlist:", playlistId);
    // later → router.push(`/playlist/${playlistId}`)
  };

  return (
    <div className="min-h-screen bg-[#FF3EA5]/5 pb-24">
      {/* Header */}
      <div className="sticky backdrop-brightness-75 top-0 z-50 bg-[#000000] px-8 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#fafafa] hover:text-[#FF3EA5] text-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">
              Back to Library
            </span>
          </button>
          <h1 className="text-2xl font-semibold text-[#FF3EA5]">Profile</h1>
          <div className="w-32" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Profile Section */}
        <div className="mb-12">
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-[#7c17e2] flex items-center justify-center">
                  <UserIcon size={56} className="text-white/90" />
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
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg px-4 py-3 text-[#1a1a1a] text-xl font-semibold focus:outline-none focus:border-[#FF3EA5]"
                    />
                    <textarea
                      value={userProfile.bio}
                      onChange={e =>
                        setUserProfile({ ...userProfile, bio: e.target.value })
                      }
                      className="w-full bg-white border border-[#e5e5e5] rounded-lg px-4 py-3 text-[#666666] focus:outline-none focus:border-[#FF3EA5] h-20 resize-none"
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
                      className="w-24 bg-white border border-[#e5e5e5] rounded-lg px-4 py-3 text-[#666666] focus:outline-none focus:border-[#FF3EA5]"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-4xl font-semibold text-[#1a1a1a] mb-3">
                      {userProfile.name}
                    </h2>
                    <p className="text-[#666666] text-base mb-6 max-w-2xl">
                      {userProfile.bio}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <span className="px-4 py-2 bg-[#f5f5f5] rounded-lg text-[#1a1a1a] font-medium text-sm">
                        Age: {userProfile.age}
                      </span>
                      <span className="px-4 py-2 bg-[#f5f5f5] rounded-lg text-[#1a1a1a] font-medium text-sm">
                        {mixes.length} Beats Created
                      </span>
                      <span className="px-4 py-2 bg-[#f5f5f5] rounded-lg text-[#1a1a1a] font-medium text-sm">
                        {likedTracks.length} Liked Songs
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Edit Button */}
              <div className="flex gap-3 shrink-0">
                {isEditing ? (
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-[#FF3EA5] text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#FF7ED4] transition-colors"
                  >
                    <Save size={18} /> Save Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 border border-[#e5e5e5] text-[#1a1a1a] rounded-lg font-medium text-sm flex items-center gap-2 hover:border-[#FF3EA5] hover:text-[#FF3EA5] transition-colors"
                  >
                    <Edit3 size={18} /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - MOVED ABOVE CONTENT */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {[
              {
                id: "liked",
                label: "Liked Songs",
                icon: <Heart className="w-5 h-5 fill-current" />,
              },
              {
                id: "fav",
                label: "Favorite Music",
                icon: <Heart className="w-5 h-5" />,
              },
              {
                id: "playlist",
                label: "Playlists",
                icon: <ListMusic className="w-5 h-5" />,
              },
              {
                id: "studio",
                label: "Studio Beats",
                icon: <Mic2 className="w-5 h-5" />,
              },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  px-5 py-3 rounded-lg flex items-center gap-2 transition-all font-medium text-sm border
                  ${
                    activeTab === tab.id
                      ? "bg-[#FF3EA5] text-white border-[#FF3EA5]"
                      : "bg-white text-[#666666] border-[#e5e5e5] hover:border-[#FF3EA5] hover:text-[#FF3EA5]"
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - NOW DIRECTLY BELOW TABS */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-10 min-h-[600px]">
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
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                      Your Studio Beats
                    </h3>
                    {mixes.length > 0 && (
                      <button
                        onClick={handleExportAllMixes}
                        className="px-5 py-3 border border-[#e5e5e5] rounded-lg text-[#1a1a1a] hover:border-[#FF3EA5] hover:text-[#FF3EA5] flex items-center gap-2"
                      >
                        <Download size={18} />
                        Export All
                      </button>
                    )}
                  </div>

                  {mixes.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {mixes.map((mix, index) => (
                        <motion.div
                          key={mix.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white border border-[#e5e5e5] p-6 rounded-xl group hover:border-[#FF3EA5] transition-all"
                        >
                          <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center justify-center w-14 h-14 bg-[#f5f5f5] rounded-lg">
                              <Mic2 className="w-7 h-7 text-[#FF3EA5]" />
                            </div>
                            <button
                              onClick={() => deleteMix(mix.id)}
                              className="p-2 hover:bg-[#fff0f7] rounded-lg text-[#999999] hover:text-[#FF3EA5] opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <h4 className="text-lg font-semibold text-[#1a1a1a] mb-2 truncate">
                            {mix.name}
                          </h4>
                          <p className="text-[#999999] text-sm mb-5 flex items-center gap-2">
                            <Clock size={14} />
                            {new Date(mix.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1.5 bg-[#f5f5f5] text-[#1a1a1a] rounded-lg font-medium">
                              {mix.bpm} BPM
                            </span>
                            <span className="px-3 py-1.5 bg-[#f5f5f5] text-[#1a1a1a] rounded-lg font-medium">
                              16 Steps
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No beats created yet. Head to the Studio!" />
                  )}
                </div>
              )}

              {/* PLAYLISTS */}
              {activeTab === "playlist" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                      Your Playlists
                    </h3>

                    <button
                      onClick={handleCreatePlaylist}
                      className="px-5 py-3 bg-[#FF3EA5] text-white rounded-lg font-medium hover:bg-[#FF7ED4] transition"
                    >
                      + Create Playlist
                    </button>
                  </div>

                  {playlists.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {playlists.map((playlist, index) => (
                        <motion.div
                          key={playlist.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleOpenPlaylist(playlist.id)}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-[#e5e5e5] hover:border-[#FF3EA5]"
                        >
                          {playlist.tracks[0]?.coverUrl ? (
                            <Image
                              src={playlist.tracks[0].coverUrl}
                              alt={playlist.name}
                              fill
                              className="object-cover opacity-70 group-hover:opacity-50"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#6420AA]">
                              <ListMusic className="w-16 h-16 text-white/30" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute inset-0 p-5 flex flex-col justify-end">
                            <h4 className="text-lg font-semibold text-white truncate">
                              {playlist.name}
                            </h4>
                            <p className="text-white/80 text-sm">
                              {playlist.tracks.length} Songs
                            </p>
                          </div>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              deletePlaylist(playlist.id);
                            }}
                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-lg text-[#999] hover:text-[#FF3EA5] opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No playlists found. Create one to get started!" />
                  )}
                </div>
              )}

              {/* LIKED/FAV MUSIC */}
              {(activeTab === "liked" || activeTab === "fav") && (
                <div>
                  <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-8">
                    {activeTab === "liked" ? "Liked Songs" : "Favorite Music"}
                  </h3>
                  {likedTracks.length > 0 ? (
                    <div className="space-y-3">
                      {likedTracks.map((track, index) => (
                        <motion.div
                          key={track.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center gap-5 bg-white border border-[#e5e5e5] p-5 rounded-xl hover:border-[#FFB5DA] transition-all"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                            {track.coverUrl ? (
                              <Image
                                src={track.coverUrl}
                                alt={track.title}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[#6420AA] flex items-center justify-center">
                                <Music2 className="w-6 h-6 text-white/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#1a1a1a] truncate">
                              {track.title}
                            </h4>
                            <p className="text-[#666666] text-sm truncate">
                              {track.artist}
                            </p>
                          </div>
                          <button className="p-3 bg-[#FF3EA5] text-white rounded-lg hover:bg-[#FF7ED4] transition-colors">
                            <Play size={16} fill="currentColor" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No liked songs yet. Start exploring music!" />
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
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-20 h-20 rounded-full bg-[#f5f5f5] flex items-center justify-center">
        <Music2 size={32} className="text-[#cccccc]" />
      </div>
      <p className="text-[#999999] text-base">{message}</p>
    </div>
  );
}
