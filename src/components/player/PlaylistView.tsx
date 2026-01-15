// src/components/player/PlaylistView.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Music, Trash2, PlayCircle } from "lucide-react";
import { usePlayerStore } from "@/src/lib/store/playerStore";
import Image from "next/image";

const PlaylistView: React.FC = () => {
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    setCurrentTrack,
    setIsPlaying,
  } = usePlayerStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName, "My custom playlist");
      setNewPlaylistName("");
      setIsCreating(false);
    }
  };

  const handlePlayPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && playlist.tracks.length > 0) {
      setCurrentTrack(playlist.tracks[0]);
      setIsPlaying(true);
      // In a real app, you would also replace the queue here
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
        >
          <Plus size={20} />
          <span>New Playlist</span>
        </button>
      </div>

      {isCreating && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="bg-white/5 p-4 rounded-xl border border-white/10"
        >
          <input
            autoFocus
            type="text"
            value={newPlaylistName}
            onChange={e => setNewPlaylistName(e.target.value)}
            placeholder="Playlist Name"
            className="w-full bg-transparent border-b border-white/20 p-2 text-white focus:outline-none focus:border-purple-500 mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-white/60 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newPlaylistName.trim()}
              className="px-4 py-2 bg-white text-black rounded-lg font-medium disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </motion.form>
      )}

      {playlists.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>No playlists yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map(playlist => (
            <motion.div
              key={playlist.id}
              layout
              className="group bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="relative aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                {playlist.tracks.length > 0 ? (
                  <Image
                    src={playlist.tracks[0].coverUrl || "/default-cover.jpg"}
                    alt={playlist.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="w-12 h-12 text-white/20" />
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePlayPlaylist(playlist.id)}
                    className="p-3 bg-purple-600 rounded-full hover:scale-105 transition-transform"
                  >
                    <PlayCircle className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white">{playlist.name}</h3>
                  <p className="text-sm text-white/60">
                    {playlist.tracks.length} tracks
                  </p>
                </div>
                <button
                  onClick={() => deletePlaylist(playlist.id)}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistView;
