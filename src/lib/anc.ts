/** ANC concept data — claims from research/noise-cancellation/ */

export const DEMO_FREQ_HZ = 220;

/** Resultant amplitude for unit sines with phase difference φ (radians). */
export function resultantAmplitude(phaseRad: number, antiGain = 1): number {
  // |1 + g e^{iφ}| for unit noise + scaled anti
  const re = 1 + antiGain * Math.cos(phaseRad);
  const im = antiGain * Math.sin(phaseRad);
  return Math.hypot(re, im);
}

export function sampleWave(
  phaseRad: number,
  antiGain: number,
  points = 128,
): { noise: number[]; anti: number[]; sum: number[] } {
  const noise: number[] = [];
  const anti: number[] = [];
  const sum: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2;
    const n = Math.sin(t);
    const a = antiGain * Math.sin(t + phaseRad);
    noise.push(n);
    anti.push(a);
    sum.push(n + a);
  }
  return { noise, anti, sum };
}

/** Illustrative relative contribution — not a product measurement (C-22 hedge). */
export const BAND_SKETCH = [
  { band: "40–200 Hz", label: "Deep rumble", active: 0.9, passive: 0.25 },
  { band: "200–800 Hz", label: "Cabin / voice floor", active: 0.75, passive: 0.4 },
  { band: "0.8–2 kHz", label: "Presence", active: 0.35, passive: 0.65 },
  { band: "2–8 kHz", label: "Sibilance / detail", active: 0.1, passive: 0.85 },
] as const;

export const LOOP_BLOCKS = [
  {
    id: "ff",
    title: "Outside mic",
    role: "Feedforward",
    blurb: "Hears the world before it reaches the cup.",
    claim: "C-11",
  },
  {
    id: "fb",
    title: "Inside mic",
    role: "Feedback",
    blurb: "Hears what’s left next to the ear and driver.",
    claim: "C-10",
  },
  {
    id: "dsp",
    title: "DSP",
    role: "Filters",
    blurb: "Builds anti-noise; both paths can contribute.",
    claim: "C-12",
  },
  {
    id: "driver",
    title: "Driver",
    role: "Speaker",
    blurb: "Plays music and anti-noise into the cup.",
    claim: "C-10",
  },
] as const;

export const SOURCES = [
  {
    label: "US9445184B2 — Active noise reduction headphone (Bose)",
    href: "https://patents.google.com/patent/US9445184B2/en",
    note: "Feedback ANR; mic–speaker phase/bandwidth limits.",
  },
  {
    label: "US8693700 — Adaptive feed-forward noise reduction (Bose)",
    href: "https://www.freepatentsonline.com/8693700.html",
    note: "Feed-forward path with feedback; destructive interference.",
  },
  {
    label: "US9747887B2 — Systems and methods of ANR in headphones (Bose)",
    href: "https://patents.google.com/patent/US9747887B2/en",
    note: "Hybrid FF+FB; wearer acoustic profiles.",
  },
  {
    label:
      "Streeter, Ray, Collier — Hybrid feedforward-feedback ANR (JASA, 2004)",
    href: "https://doi.org/10.1121/1.4782959",
    note: "Lab circumaural hybrid performance and stability.",
  },
  {
    label: "IEC 60268-24:2023 — Noise cancelling headphones measurement",
    href: "https://webstore.iec.ch/publication/67654",
    note: "Active vs total insertion loss definitions.",
  },
  {
    label: "ETSI TS 103 640 — ANC headset test methods",
    href: "https://www.etsi.org/deliver/etsi_ts/103600_103699/103640/01.03.01_60/ts_103640v010301p.pdf",
    note: "Passive / active / total insertion loss.",
  },
] as const;

export function hostname(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}
