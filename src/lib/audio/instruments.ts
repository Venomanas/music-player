// type ToneType = typeof import("tone");
type PolySynthType = import("tone").PolySynth;
type ReverbType = import("tone").Reverb;
type MembraneSynthType = import("tone").MembraneSynth;
type NoiseSynthType = import("tone").NoiseSynth;
type MetalSynthType = import("tone").MetalSynth;
type SamplerType = import("tone").Sampler;

// Define InstrumentConfig locally if needed
export interface InstrumentConfig {
  volume?: number;
  attack?: number;
  release?: number;
  reverb?: number;
}

// At the bottom of instruments.ts, add:

export class VirtualPiano {
  private synth: PolySynthType | null = null;
  private reverb: ReverbType | null = null;
  private isInitialized = false;
  private config?: InstrumentConfig;

  constructor(config?: InstrumentConfig) {
    this.config = config;
    // Don't initialize during SSR
    if (typeof window === "undefined") return;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === "undefined") return;

    try {
      const Tone = await import("tone");

      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: "sine" as const,
        },
        envelope: {
          attack: this.config?.attack || 0.05,
          decay: 0.1,
          sustain: 0.3,
          release: this.config?.release || 1,
        },
      }).toDestination();

      this.reverb = new Tone.Reverb({
        decay: this.config?.reverb || 3,
        wet: 0.4,
      });

      this.synth.connect(this.reverb);
      if (this.synth.volume && this.synth.volume.value !== undefined) {
        this.synth.volume.value = this.config?.volume || -10;
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize VirtualPiano:", error);
    }
  }

  async playNote(note: string, duration: string = "8n"): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.synth) {
      this.synth.triggerAttackRelease(note, duration);
    }
  }

  async playChord(notes: string[], duration: string = "8n"): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.synth) {
      this.synth.triggerAttackRelease(notes, duration);
    }
  }

  setVolume(volume: number): void {
    if (this.synth?.volume && this.synth.volume.value !== undefined) {
      this.synth.volume.value = volume;
    }
  }
}

export class DrumMachine {
  private drumSynths: {
    kick: MembraneSynthType | null;
    snare: NoiseSynthType | null;
    hihat: MetalSynthType | null;
    tom: MembraneSynthType | null;
  } = {
    kick: null,
    snare: null,
    hihat: null,
    tom: null,
  };

  private isInitialized = false;

  constructor() {
    if (typeof window === "undefined") return;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === "undefined") return;

    try {
      const Tone = await import("tone");

      this.drumSynths = {
        kick: new Tone.MembraneSynth().toDestination(),
        snare: new Tone.NoiseSynth({
          noise: { type: "white" as const },
          envelope: { attack: 0.005, decay: 0.1 },
        }).toDestination(),
        hihat: new Tone.MetalSynth({
          envelope: { attack: 0.001, decay: 0.1 },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5,
        }).toDestination(),
        tom: new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 4,
          oscillator: { type: "sine" as const },
        }).toDestination(),
      };

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize DrumMachine:", error);
    }
  }

  async playSound(sound: "kick" | "snare" | "hihat" | "tom"): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const synth = this.drumSynths[sound];
    if (!synth) return;

    switch (sound) {
      case "kick":
        (synth as MembraneSynthType).triggerAttackRelease("C1", "8n");
        break;
      case "snare":
        (synth as NoiseSynthType).triggerAttackRelease("8n");
        break;
      case "hihat":
        (synth as MetalSynthType).triggerAttackRelease("C5", "32n");
        break;
      case "tom":
        (synth as MembraneSynthType).triggerAttackRelease("G2", "8n");
        break;
    }
  }
}

export class Guitar {
  private synth: SamplerType | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window === "undefined") return;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === "undefined") return;

    try {
      const Tone = await import("tone");

      this.synth = new Tone.Sampler({
        urls: {
          C3: "C3.mp3",
          "D#3": "Ds3.mp3",
          "F#3": "Fs3.mp3",
          A3: "A3.mp3",
        },
        baseUrl: "/samples/guitar/",
        onload: () => {
          console.log("Guitar samples loaded");
        },
      }).toDestination();

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Guitar:", error);
    }
  }

  async playChord(chord: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const chordMap: Record<string, string[]> = {
      C: ["C3", "E3", "G3"],
      G: ["G3", "B3", "D4"],
      D: ["D3", "F#3", "A3"],
      A: ["A3", "C#4", "E4"],
      E: ["E3", "G#3", "B3"],
    };

    const notes = chordMap[chord] || ["C3", "E3", "G3"];

    if (this.synth) {
      this.synth.triggerAttackRelease(notes, "1n");
    }
  }

  async playNote(note: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.synth) {
      this.synth.triggerAttackRelease(note, "8n");
    }
  }
}

// Factory functions to get instrument instances (singleton pattern)
let pianoInstance: VirtualPiano | null = null;
let drumsInstance: DrumMachine | null = null;
let guitarInstance: Guitar | null = null;

export const getPiano = (config?: InstrumentConfig): VirtualPiano => {
  if (typeof window === "undefined") {
    // Return a dummy instance for SSR
    return {
      playNote: async () => {},
      playChord: async () => {},
      setVolume: () => {},
    } as unknown as VirtualPiano;
  }

  if (!pianoInstance) {
    pianoInstance = new VirtualPiano(config);
  }
  return pianoInstance;
};

export const getDrums = (): DrumMachine => {
  if (typeof window === "undefined") {
    // Return a dummy instance for SSR
    return {
      playSound: async () => {},
    } as unknown as DrumMachine;
  }

  if (!drumsInstance) {
    drumsInstance = new DrumMachine();
  }
  return drumsInstance;
};

export const getGuitar = (): Guitar => {
  if (typeof window === "undefined") {
    // Return a dummy instance for SSR
    return {
      playChord: async () => {},
      playNote: async () => {},
    } as unknown as Guitar;
  }

  if (!guitarInstance) {
    guitarInstance = new Guitar();
  }
  return guitarInstance;
};
