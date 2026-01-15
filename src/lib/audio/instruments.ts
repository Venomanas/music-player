import * as Tone from "tone";

// --- Types ---
type PolySynthType = Tone.PolySynth;
type ReverbType = Tone.Reverb;
type MembraneSynthType = Tone.MembraneSynth;
type NoiseSynthType = Tone.NoiseSynth;
type MetalSynthType = Tone.MetalSynth;

export type PianoType = "grand" | "electric" | "synth" | "organ";

export interface InstrumentConfig {
  volume?: number;
  attack?: number;
  release?: number;
  reverb?: number;
}

// --- Virtual Piano Class ---
export class VirtualPiano {
  private synth: PolySynthType | null = null;
  private reverb: ReverbType | null = null;
  private isInitialized = false;
  private config?: InstrumentConfig;

  constructor(config?: InstrumentConfig) {
    this.config = config;
    if (typeof window !== "undefined") {
      // Lazy init handled in methods
    }
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    try {
      await Tone.start();

      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" as const }, // Type assertion
        envelope: {
          attack: this.config?.attack || 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: this.config?.release || 1,
        },
        // maxPolyphony: 32,
      }).toDestination();

      this.reverb = new Tone.Reverb({
        decay: this.config?.reverb || 2,
        wet: 0.3,
      }).toDestination();

      this.synth.connect(this.reverb);
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize VirtualPiano:", error);
    }
  }

  // New Method: Switch Piano Sounds
  setInstrumentType(type: PianoType): void {
    if (!this.synth) return;

    switch (type) {
      case "grand":
        this.synth.set({ oscillator: { type: "triangle" as const } });
        this.synth.set({ envelope: { attack: 0.02, release: 1 } });
        break;
      case "electric":
        this.synth.set({ oscillator: { type: "sine" as const } });
        this.synth.set({ envelope: { attack: 0.05, release: 0.5 } });
        break;
      case "synth":
        this.synth.set({ oscillator: { type: "sawtooth" as const } });
        this.synth.set({ envelope: { attack: 0.01, release: 0.3 } });
        break;
      case "organ":
        this.synth.set({ oscillator: { type: "square" as const } });
        this.synth.set({ envelope: { attack: 0.2, release: 0.1 } });
        break;
    }
  }

  async playNote(note: string, duration: string = "8n"): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    this.synth?.triggerAttackRelease(note, duration);
  }
}

// --- Drum Machine Class ---
export class DrumMachine {
  // Added missing types for the new instruments
  private drumSynths: {
    kick: MembraneSynthType | null;
    snare: NoiseSynthType | null;
    hihat: MetalSynthType | null;
    tom: MembraneSynthType | null;
    clap: NoiseSynthType | null; // NEW
    crash: MetalSynthType | null; // NEW
    ride: MetalSynthType | null; // NEW
    cowbell: MetalSynthType | null; // NEW
  } = {
    kick: null,
    snare: null,
    hihat: null,
    tom: null,
    clap: null,
    crash: null,
    ride: null,
    cowbell: null,
  };

  private isInitialized = false;

  constructor() {
    if (typeof window === "undefined") return;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    try {
      await Tone.start();

      // Existing
      this.drumSynths.kick = new Tone.MembraneSynth().toDestination();
      this.drumSynths.snare = new Tone.NoiseSynth({
        noise: { type: "white" as const },
        envelope: { attack: 0.005, decay: 0.1 },
      }).toDestination();
      this.drumSynths.hihat = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.1 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).toDestination();
      this.drumSynths.tom = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: "sine" as const },
      }).toDestination();

      // NEW: Fix for missing sounds
      this.drumSynths.clap = new Tone.NoiseSynth({
        noise: { type: "pink" as const },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0 },
      }).toDestination();

      this.drumSynths.crash = new Tone.MetalSynth({
       
        envelope: { attack: 0.001, decay: 1, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 64,
        resonance: 4000,
        octaves: 1.5,
      }).toDestination();
      this.drumSynths.crash.volume.value = -10; // Lower volume for crash

      this.drumSynths.ride = new Tone.MetalSynth({
       
        envelope: { attack: 0.001, decay: 0.5, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).toDestination();

      this.drumSynths.cowbell = new Tone.MetalSynth({
        
        envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).toDestination();

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize DrumMachine:", error);
    }
  }

  async playSound(sound: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    // Map string ID to specific synth trigger
    switch (sound) {
      case "kick":
        this.drumSynths.kick?.triggerAttackRelease("C1", "8n");
        break;
      case "snare":
        this.drumSynths.snare?.triggerAttackRelease("8n");
        break;
      case "hihat":
        this.drumSynths.hihat?.triggerAttackRelease("C5", "32n"); // Added note
        break;
      case "tom":
        this.drumSynths.tom?.triggerAttackRelease("G2", "8n");
        break;
      // NEW CASES - Added frequencies for MetalSynth
      case "clap":
        this.drumSynths.clap?.triggerAttackRelease("8n");
        break;
      case "crash":
        this.drumSynths.crash?.triggerAttackRelease("C6", "1n"); // Added note
        break;
      case "ride":
        this.drumSynths.ride?.triggerAttackRelease("C5", "16n"); // Added note
        break;
      case "cowbell":
        this.drumSynths.cowbell?.triggerAttackRelease("C7", "16n"); // Added note
        break;
      default:
        console.warn(`Unknown drum sound: ${sound}`);
    }
  }
}

// Define a type for drum sounds
export type DrumSound =
  | "kick"
  | "snare"
  | "hihat"
  | "tom"
  | "clap"
  | "crash"
  | "ride"
  | "cowbell";

// --- Singleton Factories ---
let pianoInstance: VirtualPiano | null = null;
let drumsInstance: DrumMachine | null = null;

export const getPiano = (config?: InstrumentConfig): VirtualPiano => {
  if (typeof window === "undefined") {
    // Return a mock for SSR
    return {
      playNote: async () => { },
      setInstrumentType: () => { },
    } as unknown as VirtualPiano;
  }
  if (!pianoInstance) pianoInstance = new VirtualPiano(config);
  return pianoInstance;
};

export const getDrums = (): DrumMachine => {
  if (typeof window === "undefined") {
    // Return a mock for SSR
    return {
      playSound: async () => { },
    } as unknown as DrumMachine;
  }
  if (!drumsInstance) drumsInstance = new DrumMachine();
  return drumsInstance;
};
