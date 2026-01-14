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
  private queue: AudioTrack[] = [];
  private currentIndex: number = -1;
  private isPlaying: boolean = false;
  private volume: number = 0.7;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    Howler.volume(this.volume);
  }

  async play(track: AudioTrack) {
    if (this.currentHowl) {
      this.currentHowl.stop();
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
        this.next();
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

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.volume);
    this.emit("volume", this.volume);
  }

  addToQueue(track: AudioTrack) {
    this.queue.push(track);
    this.emit("queue", this.queue);
  }

  clearQueue() {
    this.queue = [];
    this.emit("queue", this.queue);
  }

  next() {
    if (this.queue.length > 0) {
      const nextTrack = this.queue.shift();
      if (nextTrack) {
        this.play(nextTrack);
      }
    }
  }

  getCurrentTime(): number {
    return this.currentHowl?.seek() || 0;
  }

  getDuration(): number {
    return this.currentHowl?.duration() || 0;
  }

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
