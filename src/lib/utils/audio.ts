// In src/lib/utils/audio.ts
import { AudioTrack } from "@/src/lib/audio/player";

export const createAudioTrack = (
  data: Partial<AudioTrack> & {
    id: string;
    title: string;
    artist: string;
    url: string;
  },
): AudioTrack => {
  return {
    id: data.id,
    title: data.title,
    artist: data.artist,
    url: data.url,
    duration: data.duration || 0,
    coverUrl: data.coverUrl || "/default-cover.jpg",
    genre: data.genre || "unknown",
    bpm: data.bpm,
  };
};
