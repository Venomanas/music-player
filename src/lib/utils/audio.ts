// In src/lib/utils/audio.ts
import { AudioTracks } from "@/src/lib/store/playerStore";

export const createAudioTrack = (
  data: Partial<AudioTracks> & {
    id: string;
    title: string;
    artist: string;
    url: string;
  }
): AudioTracks => {
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
