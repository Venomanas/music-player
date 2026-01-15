// src/lib/audio/effects.ts
import * as Tone from "tone";

export interface EffectConfig {
  wet?: number;
  decay?: number; // For Reverb
  delayTime?: number; // For Delay
  feedback?: number; // For Delay
  distortion?: number; // For Distortion
}

export class AudioEffectChain {
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  private distortion: Tone.Distortion | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initialize();
    }
  }

  private async initialize() {
    try {
      // Initialize effects
      this.reverb = new Tone.Reverb({ decay: 1.5, wet: 0.2 }).toDestination();
      this.delay = new Tone.FeedbackDelay({
        delayTime: "8n",
        feedback: 0.3,
        wet: 0,
      }).toDestination();
      this.distortion = new Tone.Distortion({
        distortion: 0.4,
        wet: 0,
      }).toDestination();

      await this.reverb.generate();
      this.isInitialized = true;
    } catch (e) {
      console.error("Failed to initialize effects", e);
    }
  }

  public getDestination() {
    if (!this.isInitialized || !this.reverb) return Tone.getDestination();
    // Return the entry point of the effect chain (simplified for now: parallel routing)
    return this.reverb;
  }

  public setReverb(amount: number) {
    if (this.reverb) this.reverb.wet.value = Math.max(0, Math.min(1, amount));
  }

  public setDelay(amount: number) {
    if (this.delay) this.delay.wet.value = Math.max(0, Math.min(1, amount));
  }

  public setDistortion(amount: number) {
    if (this.distortion)
      this.distortion.wet.value = Math.max(0, Math.min(1, amount));
  }
}

// Singleton instance
export const effectChain =
  typeof window !== "undefined" ? new AudioEffectChain() : null;
