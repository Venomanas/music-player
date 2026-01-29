/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/immutability */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import HindiMusicSection from "@/src/components/player/HindimusicSection";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Heart,
  Search,
  Loader2,
  Upload,
  Music2,
  Globe,
  Filter,
} from "lucide-react";
import MusicShelf from "@/src/components/Musicshelf";
import {
  usePlayerStore,
  convertToAudioTrack,
  type LibraryTrack,
} from "@/src/lib/store/playerStore";
import { audioPlayer } from "@/src/lib/audio/player";
import { createAudioTrack } from "@/src/lib/utils/audio";
import Image from "next/image";

/* -------- JioSaavn API TYPES -------- */

type SaavnArtist = {
  name: string;
};

type SaavnImage = {
  quality: string;
  url: string;
};

type SaavnDownloadUrl = {
  quality: string;
  url: string;
};

type SaavnSong = {
  id: string;
  name: string;
  duration?: number;
  language?: string;

  artists?: {
    primary?: SaavnArtist[];
  };

  album?: {
    name?: string;
  };

  image?: SaavnImage[];
  downloadUrl?: SaavnDownloadUrl[];
};

type SaavnSearchResponse = {
  data: {
    results: SaavnSong[];
  };
};

/* ---------------- COMPONENT ---------------- */

export default function MusicLibrary() {
  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setIsPlaying,
    toggleLikeTrack,
    likedTracks,
    libraryTracks,
    searchSongs,
    getHindiSongs,
    getEnglishSongs,
    playTrack: storePlayTrack,
    toggleLike,
  } = usePlayerStore();

  const [view, setView] = useState<"all" | "hindi" | "english">("all");
  const [query, setQuery] = useState("");
  const [localTracks, setLocalTracks] = useState<LibraryTrack[]>([]);
  const [results, setResults] = useState<LibraryTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  /* ---------------- GET TRACKS BASED ON VIEW ---------------- */

  const getTracksByView = useCallback(() => {
    switch (view) {
      case "hindi":
        return getHindiSongs();
      case "english":
        return getEnglishSongs();
      default:
        return libraryTracks;
    }
  }, [view, getHindiSongs, getEnglishSongs, libraryTracks]);

  /* ---------------- DEBOUNCED SEARCH ---------------- */

  useEffect(() => {
    if (!query.trim()) {
      const tracks = getTracksByView();
      const filteredByGenre =
        selectedGenre === "all"
          ? tracks
          : tracks.filter(
              track =>
                track.genre?.toLowerCase() === selectedGenre.toLowerCase(),
            );

      setResults([...filteredByGenre, ...localTracks]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);

      // Search in local library first
      const localSearchResults = searchSongs(query);

      // Also search JioSaavn for online results
      const onlineResults = await searchJioSaavn(query);

      // Combine results, removing duplicates
      const combined = [...localSearchResults, ...onlineResults];
      const uniqueResults = Array.from(
        new Map(combined.map(track => [track.id, track])).values(),
      );

      // Apply genre filter if selected
      const filteredResults =
        selectedGenre === "all"
          ? uniqueResults
          : uniqueResults.filter(
              track =>
                track.genre?.toLowerCase() === selectedGenre.toLowerCase(),
            );

      setResults([...filteredResults, ...localTracks]);
      setLoading(false);
    }, 400);

    return () => clearTimeout(delay);
  }, [query, view, selectedGenre, localTracks, getTracksByView, searchSongs]);

  /* ---------------- SAAVN SEARCH ---------------- */

  async function searchJioSaavn(q: string): Promise<LibraryTrack[]> {
    try {
      const res = await fetch(
        `https://saavn.dev/api/search/songs?query=${encodeURIComponent(q)}&limit=20`,
      );

      if (!res.ok) return [];

      const json: SaavnSearchResponse = await res.json();

      return json.data.results.map((song: SaavnSong): LibraryTrack => {
        const artistNames =
          song.artists?.primary?.map((a: SaavnArtist) => a.name).join(", ") ??
          "Unknown";

        const audioUrl =
          song.downloadUrl?.find(
            (d: SaavnDownloadUrl) => d.quality === "320kbps",
          )?.url ??
          song.downloadUrl?.[0]?.url ??
          "";

        const coverUrl =
          song.image?.find((i: SaavnImage) => i.quality === "500x500")?.url ??
          song.image?.[0]?.url ??
          "";

        // Detect if it's Hindi based on artist or language
        const isHindi =
          song.language?.toLowerCase().includes("hindi") ||
          artistNames.toLowerCase().includes("singh") ||
          artistNames.toLowerCase().includes("kumar");

        return {
          id: `saavn-${song.id}`,
          title: song.name,
          artist: artistNames,
          album: song.album?.name,
          duration: song.duration ?? 0,
          url: audioUrl,
          coverUrl,
          genre: "Online",
          source: "online",
          language: isHindi ? "hindi" : "english",
        };
      });
    } catch {
      return [];
    }
  }

  /* ---------------- LOCAL UPLOAD ---------------- */

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;

    const tracks: LibraryTrack[] = Array.from(files).map((file: File) => ({
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      duration: 0,
      url: URL.createObjectURL(file),
      source: "local",
      genre: "Local",
      language: "other",
    }));

    setLocalTracks(prev => [...tracks, ...prev]);
    setResults(prev => [...tracks, ...prev]);
  };

  /* ---------------- PLAY HANDLER ---------------- */

  const handlePlayTrack = (track: LibraryTrack) => {
    if (!track.url) return alert("Audio unavailable");

    if (currentTrack?.id === track.id && isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
      return;
    }

    storePlayTrack(track);

    const audioTrack = createAudioTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      url: track.url,
      duration: track.duration,
      coverUrl: track.coverUrl || "",
      genre: track.genre || "unknown",
    });

    setCurrentTrack(audioTrack);
    audioPlayer.play(audioTrack);
    setIsPlaying(true);
  };

  /* ---------------- GET GENRES FROM TRACKS ---------------- */

  const getGenres = () => {
    const genres = new Set<string>();
    const tracks = getTracksByView();

    tracks.forEach((track: LibraryTrack) => {
      if (track.genre) {
        genres.add(track.genre);
      }
    });

    localTracks.forEach(track => {
      if (track.genre) {
        genres.add(track.genre);
      }
    });

    return ["all", ...Array.from(genres).sort()];
  };

  /* ---------------- FORMAT DURATION ---------------- */

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  /* ---------------- UI ---------------- */

  const genres = getGenres();

  return (
    <div className="min-h-screen bg-linear-to-br from-[#6420AA]/5 to-[#FF3EA5]/5 rounded-3xl p-4 md:p-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-semibold text-[#FF3EA5] mb-2 md:mb-3 tracking-tight">
                Music Library
              </h1>
              <p className="text-lg md:text-xl text-slate-100 font-light">
                Discover and enjoy your favorite sounds
              </p>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex gap-2">
              <button
                onClick={() => setView("all")}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  view === "all"
                    ? "bg-[#FF3EA5] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Globe size={18} />
                <span>All</span>
              </button>
              <button
                onClick={() => setView("hindi")}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  view === "hindi"
                    ? "bg-[#FF3EA5] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span>हिंदी</span>
              </button>
              <button
                onClick={() => setView("english")}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  view === "english"
                    ? "bg-[#FF3EA5] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span>English</span>
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative group">
            <Search
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#FF3EA5]"
              size={20}
            />

            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="w-full pl-12 md:pl-16 pr-12 md:pr-16 py-3 md:py-5 bg-white border border-gray-200 rounded-2xl text-gray-800 text-base md:text-lg placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#FF7ED4] focus:ring-4 focus:ring-[#FFB5DA]/30 shadow-sm hover:shadow-lg"
            />

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2"
                >
                  <Loader2 className="animate-spin text-[#FF3EA5]" size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* GENRE FILTER */}
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-gray-300 mr-4">
              <Filter size={16} />
              <span className="text-sm">Filter:</span>
            </div>
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === genre
                    ? "bg-[#FF3EA5] text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {genre === "all" ? "All Genres" : genre}
              </button>
            ))}
          </div>
        </motion.div>

        {/* HINDI MUSIC SECTION (Only when viewing all or hindi) */}
        {view === "all" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <HindiMusicSection />
          </motion.div>
        )}

        {/* UPLOAD SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 md:mb-16"
        >
          <label className="group cursor-pointer block">
            <motion.div
              whileHover={{ scale: 1.005, y: -2 }}
              whileTap={{ scale: 0.995 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-linear-to-br from-[#FFB5DA]/20 via-[#FF7ED4]/10 to-[#FF3EA5]/20 border-2 border-dashed border-[#FFB5DA] p-6 md:p-12 transition-all duration-300 hover:border-[#FF3EA5] hover:shadow-xl hover:shadow-[#FFB5DA]/20"
            >
              <div className="flex flex-col items-center justify-center gap-4 md:gap-6 text-center">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-linear-to-br from-[#FF7ED4] to-[#FF3EA5] text-white shadow-lg shadow-[#FF7ED4]/30"
                >
                  <Upload size={24} />
                </motion.div>

                <div>
                  <h3 className="text-xl md:text-2xl font-medium mb-2">
                    Upload Your Music
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base">
                    Drag and drop your audio files here, or click to browse
                  </p>
                </div>
              </div>
            </motion.div>

            <input
              type="file"
              accept="audio/*"
              multiple
              hidden
              onChange={handleUpload}
            />
          </label>
        </motion.div>

        {/* TRACKS HEADER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            {view === "hindi"
              ? "Hindi Songs"
              : view === "english"
                ? "English Songs"
                : "All Tracks"}
          </h2>
          <p className="text-gray-400">
            {results.length} {results.length === 1 ? "track" : "tracks"} found
          </p>
        </motion.div>

        {/* TRACK LIST */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="text-center py-16 md:py-32"
              >
                <div className="flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full bg-linear-to-br from-[#FFB5DA]/20 to-[#FF7ED4]/10 mx-auto mb-4 md:mb-6">
                  <Music2 className="w-10 h-10 md:w-14 md:h-14 text-[#FF3EA5]" />
                </div>
                <p className="text-gray-600 text-lg md:text-xl font-light mb-2">
                  No tracks found
                </p>
                <p className="text-gray-400 text-sm md:text-base">
                  {query
                    ? "Try a different search term"
                    : "Search or upload music to get started"}
                </p>
              </motion.div>
            ) : (
              results.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  layout
                >
                  <motion.div
                    whileHover={{ scale: 1.005, x: 4 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`
                      group relative overflow-hidden rounded-xl md:rounded-2xl transition-all duration-300
                      ${
                        currentTrack?.id === track.id
                          ? "bg-linear-to-br from-[#FFB5DA]/30 via-[#FF7ED4]/20 to-[#FF3EA5]/10 shadow-lg shadow-[#FFB5DA]/20 border border-[#FF7ED4]/30"
                          : "bg-white/80 hover:bg-white hover:shadow-md border border-gray-100"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6">
                      {/* ALBUM ART OR PLAY BUTTON */}
                      <div className="relative shrink-0">
                        {track.coverUrl ? (
                          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden shadow">
                            <Image
                              src={track.coverUrl}
                              alt={track.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handlePlayTrack(track)}
                              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                              {currentTrack?.id === track.id && isPlaying ? (
                                <Pause className="text-white" size={20} />
                              ) : (
                                <Play className="text-white ml-0.5" size={20} />
                              )}
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePlayTrack(track)}
                            className={`
                              flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl transition-all duration-300 shadow
                              ${
                                currentTrack?.id === track.id && isPlaying
                                  ? "bg-linear-to-br from-[#FF7ED4] to-[#FF3EA5] text-white shadow-lg shadow-[#FF7ED4]/40"
                                  : "bg-gray-100 text-gray-600 hover:bg-linear-to-br hover:from-[#FFB5DA] hover:to-[#FF7ED4] hover:text-white"
                              }
                            `}
                          >
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Pause size={16} />
                            ) : (
                              <Play size={16} className="ml-0.5" />
                            )}
                          </motion.button>
                        )}
                      </div>

                      {/* TRACK INFO */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                          <h4 className="text-[#6420AA] text-base md:text-lg font-medium truncate">
                            {track.title}
                          </h4>
                          {track.language === "hindi" && (
                            <span className="px-2 py-0.5 bg-[#FF3EA5]/10 text-[#FF3EA5] text-xs rounded-full shrink-0">
                              हिंदी
                            </span>
                          )}
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                          <p className="text-gray-500 text-sm md:text-base truncate">
                            {track.artist}
                          </p>
                          {track.album && (
                            <>
                              <span className="text-gray-300">•</span>
                              <p className="text-gray-500 text-sm truncate">
                                {track.album}
                              </p>
                            </>
                          )}
                          <span
                            className={`
                            px-2 py-0.5 rounded text-xs font-medium shrink-0
                            ${
                              track.source === "online"
                                ? "bg-linear-to-r from-[#FFB5DA] to-[#FF7ED4] text-white"
                                : track.source === "local"
                                  ? "bg-gray-200 text-gray-600"
                                  : "bg-purple-100 text-purple-600"
                            }
                          `}
                          >
                            {track.source === "online"
                              ? "Online"
                              : track.source === "local"
                                ? "Local"
                                : "Library"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          {track.duration > 0 && (
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              {formatDuration(track.duration)}
                            </span>
                          )}
                          {track.year && (
                            <span className="text-gray-400 text-xs">
                              • {track.year}
                            </span>
                          )}
                          {track.genre && track.genre !== "Local" && (
                            <span className="text-gray-400 text-xs">
                              • {track.genre}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* LIKE BUTTON */}
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                          toggleLike(track.id);
                        }}
                        className="shrink-0"
                      >
                        <Heart
                          className={`
                            transition-all duration-300
                            ${
                              likedTracks.some(t => t.id === track.id)
                                ? "fill-[#FF3EA5] text-[#FF3EA5]"
                                : "text-gray-400 hover:text-[#FF3EA5]"
                            }
                          `}
                          size={20}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
