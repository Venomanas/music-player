/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Howl, Howler } from "howler";

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl: string;
  genre: string;
  bpm?: number;
}

export class AudioPlayer {
  private currentHowl: Howl | null = null;
  private manualQueue: AudioTrack[] = [];
  private playbackList: AudioTrack[] = [];
  private currentIndex: number = -1;
  private isPlaying: boolean = false;
  private volume: number = 0.7;
  private repeatMode: "none" | "one" | "all" = "none";
  private shuffleMode: boolean = false;
  private shuffledIndices: number[] = [];
  private shuffledPosition: number = -1;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    Howler.volume(this.volume);
  }

  /* ───────────── Playback list management ───────────── */

  setPlaybackList(tracks: AudioTrack[], startIndex: number = 0) {
    this.playbackList = [...tracks];
    this.currentIndex = startIndex;

    if (this.shuffleMode) {
      this.buildShuffledIndices(startIndex);
    }
  }

  getPlaybackList(): AudioTrack[] {
    return this.playbackList;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /* ───────────── Repeat / Shuffle ───────────── */

  setRepeatMode(mode: "none" | "one" | "all") {
    this.repeatMode = mode;
  }

  getRepeatMode(): "none" | "one" | "all" {
    return this.repeatMode;
  }

  setShuffleMode(enabled: boolean) {
    this.shuffleMode = enabled;
    if (enabled && this.playbackList.length > 0) {
      this.buildShuffledIndices(this.currentIndex);
    }
  }

  getShuffleMode(): boolean {
    return this.shuffleMode;
  }

  private buildShuffledIndices(currentIdx: number) {
    const indices = this.playbackList
      .map((_, i) => i)
      .filter(i => i !== currentIdx);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // Current track is always first in shuffled order
    this.shuffledIndices = [currentIdx, ...indices];
    this.shuffledPosition = 0;
  }

  /* ───────────── Core playback ───────────── */

  async play(track: AudioTrack) {
    if (this.currentHowl) {
      this.currentHowl.stop();
      this.currentHowl.unload();
    }

    this.currentHowl = new Howl({
      src: [track.url],
      html5: true,
      format: ["mp3", "ogg", "wav"],
      volume: this.volume,
      onload: () => {
        this.emit("loaded", track);
      },
      onplay: () => {
        this.isPlaying = true;
        this.emit("play", track);
      },
      onpause: () => {
        this.isPlaying = false;
        this.emit("pause", track);
      },
      onstop: () => {
        this.isPlaying = false;
        this.emit("stop", track);
      },
      onend: () => {
        this.isPlaying = false;
        this.emit("end", track);
        this.handleTrackEnd();
      },
      onseek: () => {
        this.emit("seek", this.currentHowl?.seek());
      },
    });

    this.currentHowl.play();
  }

  pause() {
    if (this.currentHowl && this.isPlaying) {
      this.currentHowl.pause();
      this.isPlaying = false;
    }
  }

  resume() {
    if (this.currentHowl && !this.isPlaying) {
      this.currentHowl.play();
      this.isPlaying = true;
    }
  }

  stop() {
    if (this.currentHowl) {
      this.currentHowl.stop();
      this.isPlaying = false;
    }
  }

  seek(time: number) {
    if (this.currentHowl) {
      this.currentHowl.seek(time);
    }
  }

  seekForward(seconds: number = 10) {
    if (this.currentHowl) {
      const current = this.currentHowl.seek() as number;
      const duration = this.currentHowl.duration();
      this.currentHowl.seek(Math.min(current + seconds, duration));
    }
  }

  seekBackward(seconds: number = 10) {
    if (this.currentHowl) {
      const current = this.currentHowl.seek() as number;
      this.currentHowl.seek(Math.max(current - seconds, 0));
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.volume);
    this.emit("volume", this.volume);
  }

  /* ───────────── Manual queue (user-added) ───────────── */

  addToQueue(track: AudioTrack) {
    this.manualQueue.push(track);
    this.emit("queue", this.manualQueue);
  }

  clearQueue() {
    this.manualQueue = [];
    this.emit("queue", this.manualQueue);
  }

  /* ───────────── Next / Previous ───────────── */

  next(): AudioTrack | null {
    // 1. Manual queue takes priority
    if (this.manualQueue.length > 0) {
      const nextTrack = this.manualQueue.shift()!;
      this.emit("queue", this.manualQueue);
      // Try to find this track in the playback list to update index
      const idx = this.playbackList.findIndex(t => t.id === nextTrack.id);
      if (idx !== -1) this.currentIndex = idx;
      this.play(nextTrack);
      this.emit("trackChange", nextTrack);
      return nextTrack;
    }

    // 2. Playback list navigation
    if (this.playbackList.length === 0) return null;

    let nextIndex: number;

    if (this.shuffleMode) {
      this.shuffledPosition++;
      if (this.shuffledPosition >= this.shuffledIndices.length) {
        if (this.repeatMode === "all") {
          this.buildShuffledIndices(this.currentIndex);
          this.shuffledPosition = 0;
        } else {
          this.emit("listEnd", null);
          return null;
        }
      }
      nextIndex = this.shuffledIndices[this.shuffledPosition];
    } else {
      nextIndex = this.currentIndex + 1;
      if (nextIndex >= this.playbackList.length) {
        if (this.repeatMode === "all") {
          nextIndex = 0;
        } else {
          this.emit("listEnd", null);
          return null;
        }
      }
    }

    this.currentIndex = nextIndex;
    const nextTrack = this.playbackList[nextIndex];
    this.play(nextTrack);
    this.emit("trackChange", nextTrack);
    return nextTrack;
  }

  previous(): AudioTrack | null {
    // If more than 3 seconds in, restart the current track
    const currentTime = this.getCurrentTime();
    if (currentTime > 3 && this.playbackList.length > 0) {
      this.seek(0);
      return this.playbackList[this.currentIndex] || null;
    }

    if (this.playbackList.length === 0) return null;

    let prevIndex: number;

    if (this.shuffleMode) {
      this.shuffledPosition--;
      if (this.shuffledPosition < 0) {
        if (this.repeatMode === "all") {
          this.shuffledPosition = this.shuffledIndices.length - 1;
        } else {
          this.shuffledPosition = 0;
          this.seek(0);
          return this.playbackList[this.shuffledIndices[0]] || null;
        }
      }
      prevIndex = this.shuffledIndices[this.shuffledPosition];
    } else {
      prevIndex = this.currentIndex - 1;
      if (prevIndex < 0) {
        if (this.repeatMode === "all") {
          prevIndex = this.playbackList.length - 1;
        } else {
          this.seek(0);
          return this.playbackList[this.currentIndex] || null;
        }
      }
    }

    this.currentIndex = prevIndex;
    const prevTrack = this.playbackList[prevIndex];
    this.play(prevTrack);
    this.emit("trackChange", prevTrack);
    return prevTrack;
  }

  /* ───────────── Auto-advance on track end ───────────── */

  private handleTrackEnd() {
    if (this.repeatMode === "one") {
      // Replay the same track
      const current = this.playbackList[this.currentIndex];
      if (current) {
        this.play(current);
        this.emit("trackChange", current);
      }
      return;
    }

    // For "all" or "none", try to go next
    this.next();
  }

  /* ───────────── Time helpers ───────────── */

  getCurrentTime(): number {
    if (!this.currentHowl) return 0;
    const seek = this.currentHowl.seek();
    return typeof seek === "number" ? seek : 0;
  }

  getDuration(): number {
    return this.currentHowl?.duration() || 0;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /* ───────────── Event system ───────────── */

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: unknown) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
}

export const audioPlayer = new AudioPlayer();
