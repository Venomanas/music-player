"use client";

import { Play, Pause } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePlayerStore } from "@/src/lib/store/playerStore";
import { audioPlayer } from "@/src/lib/audio/player";
import { createAudioTrack } from "@/src/lib/utils/audio";

export default function MusicShelf() {
  const {
    libraryTracks,
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setIsPlaying,
    setPlaybackListState,
  } = usePlayerStore();

  const tracks = libraryTracks.slice(0, 10); // 👈 first 10 for all users

  const handlePlay = (track: (typeof libraryTracks)[number]) => {
    if (currentTrack?.id === track.id && isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
      return;
    }

    const audioTrack = createAudioTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      url: track.url,
      duration: track.duration,
      coverUrl: track.coverUrl || "",
      genre: track.genre || "unknown",
    });

    // Build playback list from shelf tracks
    const allAudioTracks = tracks.map(t =>
      createAudioTrack({
        id: t.id,
        title: t.title,
        artist: t.artist,
        url: t.url,
        duration: t.duration,
        coverUrl: t.coverUrl || "",
        genre: t.genre || "unknown",
      }),
    );
    const clickedIndex = allAudioTracks.findIndex(t => t.id === track.id);
    setPlaybackListState(allAudioTracks, clickedIndex >= 0 ? clickedIndex : 0);

    setCurrentTrack(audioTrack);
    audioPlayer.play(audioTrack);
    setIsPlaying(true);
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-white mb-4">Music for You</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tracks.map(track => {
          const isCurrent = currentTrack?.id === track.id;

          return (
            <motion.div
              key={track.id}
              whileHover={{ scale: 1.04 }}
              className="group relative bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-purple-500/40 transition"
            >
              {/* COVER */}
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                {track.coverUrl ? (
                  <Image
                    src={track.coverUrl}
                    alt={track.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-pink-600" />
                )}

                {/* PLAY BUTTON */}
                <button
                  onClick={() => handlePlay(track)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
                >
                  {isCurrent && isPlaying ? (
                    <Pause size={32} className="text-white" />
                  ) : (
                    <Play size={32} className="text-white ml-1" />
                  )}
                </button>
              </div>

              {/* TEXT */}
              <div>
                <p className="text-white font-semibold truncate">
                  {track.title}
                </p>
                <p className="text-white/60 text-sm truncate">{track.artist}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
