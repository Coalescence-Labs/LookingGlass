// Web Audio engine for the adaptive-music demo.
// Every sound is synthesised here — oscillators and filtered noise, no sample
// files (research chunk 07, claim C-14). The AudioContext is created and
// resumed only from a user gesture, so nothing autoplays (claim C-13).

import {
  BPM,
  padOpenness,
  stemGains,
  type Drivers,
} from "@/lib/adaptive-music";

type EngineOpts = {
  bpm?: number;
  onBeat?: (beat: number) => void;
};

type CtxCtor = typeof AudioContext;

// A C-minor pentatonic set, in Hz, for the lead arpeggio.
const PENTATONIC = [261.63, 311.13, 349.23, 392.0, 466.16, 523.25];
const BASS_ROOT = 65.41; // C2
const PAD_FREQS = [130.81, 196.0, 261.63]; // C3, G3, C4 — root + fifth + octave

export class AdaptiveEngine {
  private readonly bpm: number;
  private readonly onBeat?: (beat: number) => void;

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null; // ducked by stingers
  private padGain: GainNode | null = null;
  private padFilter: BiquadFilterNode | null = null;
  private padOscs: OscillatorNode[] = [];
  private noiseBuffer: AudioBuffer | null = null;

  private drivers: Drivers = { tension: 0.4, combat: 0, discovery: 0.3 };
  private muted = false;
  private disposed = false;

  private timer: ReturnType<typeof setInterval> | null = null;
  private nextNoteTime = 0;
  private beat = 0;
  private readonly lookahead = 25; // ms between scheduler ticks
  private readonly scheduleAhead = 0.14; // s scheduled into the future

  constructor(opts: EngineOpts = {}) {
    this.bpm = opts.bpm ?? BPM;
    this.onBeat = opts.onBeat;
  }

  /** Must be called inside a user gesture (synchronous resume for Safari). */
  start(): void {
    if (this.ctx || this.disposed) return;

    const Ctor: CtxCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: CtxCtor }).webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    this.ctx = ctx;
    // Resume in the same tick as the gesture; ignore the returned promise.
    void ctx.resume();

    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 0.85;
    master.connect(ctx.destination);
    this.master = master;

    const musicBus = ctx.createGain();
    musicBus.gain.value = 1;
    musicBus.connect(master);
    this.musicBus = musicBus;

    // Persistent pad (the always-on bed — "muted, not stopped", claim C-02a).
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 600;
    padFilter.Q.value = 0.7;
    const padGain = ctx.createGain();
    padGain.gain.value = 0;
    padFilter.connect(padGain);
    padGain.connect(musicBus);
    this.padFilter = padFilter;
    this.padGain = padGain;

    for (const f of PAD_FREQS) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = f;
      osc.detune.value = (Math.random() - 0.5) * 8;
      osc.connect(padFilter);
      osc.start();
      this.padOscs.push(osc);
    }

    this.noiseBuffer = this.makeNoise(ctx);

    // Apply the initial driver state, then start the clock.
    this.applyContinuous(0.05);
    this.nextNoteTime = ctx.currentTime + 0.12;
    this.beat = 0;
    this.timer = setInterval(() => this.scheduler(), this.lookahead);
  }

  setDrivers(d: Drivers): void {
    this.drivers = d;
    // Continuous layers (pad) ramp now; scheduled layers pick up the new gains
    // on their next beat, so a change "lands on the beat" (claims C-02, C-05).
    this.applyContinuous(0.25);
  }

  setMuted(m: boolean): void {
    this.muted = m;
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(m ? 0 : 0.85, t + 0.08);
  }

  /** A one-shot accent on the next beat that briefly ducks the bed (C-06/C-07). */
  fireStinger(): void {
    const ctx = this.ctx;
    const musicBus = this.musicBus;
    const master = this.master;
    if (!ctx || !musicBus || !master) return;

    const at = Math.max(this.nextNoteTime, ctx.currentTime + 0.03);

    // Duck the music bed: fast in, slow out (asymmetric, claim C-07b).
    musicBus.gain.cancelScheduledValues(at);
    musicBus.gain.setValueAtTime(musicBus.gain.value, at);
    musicBus.gain.linearRampToValueAtTime(0.4, at + 0.12);
    musicBus.gain.linearRampToValueAtTime(1, at + 0.9);

    // The accent itself routes straight to master so it cuts through the duck.
    const accent = ctx.createGain();
    accent.gain.value = 0;
    accent.connect(master);
    const bell = ctx.createOscillator();
    bell.type = "triangle";
    bell.frequency.value = 880;
    bell.connect(accent);
    accent.gain.setValueAtTime(0, at);
    accent.gain.linearRampToValueAtTime(0.5, at + 0.01);
    accent.gain.exponentialRampToValueAtTime(0.0008, at + 0.7);
    bell.start(at);
    bell.stop(at + 0.75);

    if (this.noiseBuffer) {
      const crash = ctx.createBufferSource();
      crash.buffer = this.noiseBuffer;
      const cf = ctx.createBiquadFilter();
      cf.type = "highpass";
      cf.frequency.value = 6000;
      const cg = ctx.createGain();
      cg.gain.value = 0;
      crash.connect(cf);
      cf.connect(cg);
      cg.connect(master);
      cg.gain.setValueAtTime(0, at);
      cg.gain.linearRampToValueAtTime(0.25, at + 0.005);
      cg.gain.exponentialRampToValueAtTime(0.0008, at + 0.6);
      crash.start(at);
      crash.stop(at + 0.65);
    }
  }

  dispose(): void {
    this.disposed = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    for (const osc of this.padOscs) {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    }
    this.padOscs = [];
    const ctx = this.ctx;
    this.ctx = null;
    if (ctx) void ctx.close().catch(() => {});
  }

  // ——— internals ———

  private applyContinuous(ramp: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.padGain || !this.padFilter) return;
    const t = ctx.currentTime;
    const gains = stemGains(this.drivers);
    const open = padOpenness(this.drivers);

    this.padGain.gain.cancelScheduledValues(t);
    this.padGain.gain.setValueAtTime(this.padGain.gain.value, t);
    this.padGain.gain.linearRampToValueAtTime(gains.pad * 0.22, t + ramp);

    const cutoff = 350 + open * 3200;
    this.padFilter.frequency.cancelScheduledValues(t);
    this.padFilter.frequency.setValueAtTime(this.padFilter.frequency.value, t);
    this.padFilter.frequency.linearRampToValueAtTime(cutoff, t + ramp);
  }

  private scheduler(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const secondsPerBeat = 60 / this.bpm;
    while (this.nextNoteTime < ctx.currentTime + this.scheduleAhead) {
      this.scheduleBeat(this.beat, this.nextNoteTime);
      this.nextNoteTime += secondsPerBeat;
      this.beat += 1;
    }
  }

  private scheduleBeat(beat: number, time: number): void {
    const ctx = this.ctx;
    const musicBus = this.musicBus;
    if (!ctx || !musicBus) return;

    // Read the latest driver-derived gains at schedule time → new layers enter
    // on the beat (claims C-02, C-05).
    const gains = stemGains(this.drivers);
    const beatInBar = beat % 4;

    // Bass — root pulse on each beat.
    if (gains.bass > 0.01) {
      const freq = beatInBar === 2 ? BASS_ROOT * 1.5 : BASS_ROOT;
      this.scheduleTone(time, {
        freq,
        type: "triangle",
        peak: gains.bass * 0.4,
        attack: 0.005,
        release: 0.28,
        dest: musicBus,
      });
    }

    // Drums — kick on 0 and 2, hat on every beat; gated by combat.
    if (gains.drums > 0.01) {
      if (beatInBar === 0 || beatInBar === 2) {
        this.scheduleKick(time, gains.drums * 0.9, musicBus);
      }
      this.scheduleHat(time, gains.drums * 0.32, musicBus);
      if (beatInBar === 3 && gains.drums > 0.6) {
        this.scheduleHat(time + (60 / this.bpm) / 2, gains.drums * 0.28, musicBus);
      }
    }

    // Lead — pentatonic arpeggio, eighth notes; gated by discovery.
    if (gains.lead > 0.01) {
      const step = (60 / this.bpm) / 2;
      for (let i = 0; i < 2; i++) {
        const note = PENTATONIC[(beat * 2 + i) % PENTATONIC.length];
        this.scheduleTone(time + i * step, {
          freq: note,
          type: "sine",
          peak: gains.lead * 0.18,
          attack: 0.005,
          release: 0.22,
          dest: musicBus,
        });
      }
    }

    if (this.onBeat) {
      const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);
      window.setTimeout(() => {
        if (!this.disposed) this.onBeat?.(beat);
      }, delayMs);
    }
  }

  private scheduleTone(
    time: number,
    o: {
      freq: number;
      type: OscillatorType;
      peak: number;
      attack: number;
      release: number;
      dest: AudioNode;
    },
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = o.type;
    osc.frequency.value = o.freq;
    const g = ctx.createGain();
    g.gain.value = 0;
    osc.connect(g);
    g.connect(o.dest);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(o.peak, time + o.attack);
    g.gain.exponentialRampToValueAtTime(0.0008, time + o.attack + o.release);
    osc.start(time);
    osc.stop(time + o.attack + o.release + 0.02);
  }

  private scheduleKick(time: number, peak: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(dest);
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(peak, time + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0008, time + 0.22);
    osc.start(time);
    osc.stop(time + 0.24);
  }

  private scheduleHat(time: number, peak: number, dest: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuffer) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    src.connect(hp);
    hp.connect(g);
    g.connect(dest);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(peak, time + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0008, time + 0.06);
    src.start(time);
    src.stop(time + 0.08);
  }

  private makeNoise(ctx: AudioContext): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * 0.4);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}
