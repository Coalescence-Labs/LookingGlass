// Adaptive-music concept data + driver→stem mapping.
// Facts cite research/adaptive-music/ claim IDs. Audio is synthesised at
// runtime (see src/components/adaptive/audio-engine.ts) — no sample files.

export type Drivers = {
  tension: number; // 0..1
  combat: number; // 0..1
  discovery: number; // 0..1
};

export type StemId = "pad" | "bass" | "drums" | "lead";

export type Stem = {
  id: StemId;
  label: string;
  role: "tension" | "combat" | "discovery" | "bed";
  /** What the layer sounds like — read by muted/screen-reader users. */
  caption: string;
};

export type Scene = {
  id: string;
  label: string;
  caption: string;
  /** Left→right order in the state-tree diagram. */
  intensity: number;
};

export type TransitionRule = "immediate" | "next-beat" | "next-bar" | "exit-cue";

export type Transition = {
  from: string;
  to: string;
  rule: TransitionRule;
};

export type CaseStudy = {
  game: string;
  composer: string;
  engine: string;
  technique: string;
  note: string;
  source: string;
};

export type Middleware = {
  name: string;
  maker: string;
  character: string;
  features: string[];
};

// ——— Tempo ———

export const BPM = 100;

// ——— Stems (vertical layers) — research chunk 02, claim C-02 ———

export const STEMS: Stem[] = [
  {
    id: "pad",
    label: "Pad",
    role: "tension",
    caption: "A held chord that opens and brightens as tension rises.",
  },
  {
    id: "bass",
    label: "Bass",
    role: "bed",
    caption: "A low pulse on the beat — the floor everything else stands on.",
  },
  {
    id: "drums",
    label: "Drums",
    role: "combat",
    caption: "Percussion that kicks in for combat and drops out when it ends.",
  },
  {
    id: "lead",
    label: "Lead",
    role: "discovery",
    caption: "A bright arpeggio that arrives when you're exploring.",
  },
];

// ——— Scenes (states) — research chunk 03, claims C-03, C-04 ———

export const SCENES: Scene[] = [
  {
    id: "calm",
    label: "Calm",
    caption: "Almost silence — just the pad holding a single chord.",
    intensity: 0,
  },
  {
    id: "explore",
    label: "Explore",
    caption: "Pad and bass settle into a steady, unhurried groove.",
    intensity: 1,
  },
  {
    id: "discovery",
    label: "Discovery",
    caption: "A bright lead threads over the bed — the music leans forward.",
    intensity: 2,
  },
  {
    id: "combat",
    label: "Combat",
    caption: "Drums kick in and the bass digs harder.",
    intensity: 3,
  },
  {
    id: "boss",
    label: "Boss",
    caption: "Everything at once — full kit, driving bass, the pad wide open.",
    intensity: 4,
  },
];

export const TRANSITIONS: Transition[] = [
  { from: "calm", to: "explore", rule: "next-bar" },
  { from: "explore", to: "discovery", rule: "next-beat" },
  { from: "explore", to: "combat", rule: "next-beat" },
  { from: "discovery", to: "combat", rule: "next-beat" },
  { from: "combat", to: "boss", rule: "next-bar" },
  { from: "combat", to: "explore", rule: "exit-cue" },
  { from: "boss", to: "explore", rule: "exit-cue" },
];

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// Driver → stem gains (vertical layering) — claim C-02.
// Single source of truth: the engine, the meters, and the captions all read this.
export function stemGains(d: Drivers): Record<StemId, number> {
  const drumsThreshold = 0.15;
  return {
    pad: clamp01(0.22 + 0.55 * d.tension),
    bass: clamp01(0.3 + 0.5 * Math.max(d.tension, d.combat)),
    drums:
      d.combat <= drumsThreshold
        ? 0
        : clamp01((d.combat - drumsThreshold) / (1 - drumsThreshold)),
    lead: clamp01(0.9 * d.discovery),
  };
}

// Pad filter openness (0..1) rides tension — claim C-02 (continuous remixing).
export function padOpenness(d: Drivers): number {
  return clamp01(0.15 + 0.85 * d.tension);
}

// Driver → scene (state) — single source of truth for label, tree, caption.
export function sceneFor(d: Drivers): Scene {
  const id = sceneIdFor(d);
  return SCENES.find((s) => s.id === id) ?? SCENES[1];
}

function sceneIdFor(d: Drivers): string {
  if (d.combat >= 0.6 && d.tension >= 0.55) return "boss";
  if (d.combat >= 0.4) return "combat";
  if (d.discovery >= 0.5 && d.combat < 0.4) return "discovery";
  if (d.tension < 0.25 && d.combat < 0.2 && d.discovery < 0.3) return "calm";
  return "explore";
}

// Build a plain-language description of what is currently audible (C-02a).
export function captionFor(
  scene: Scene,
  gains: Record<StemId, number>,
): string {
  const audible = STEMS.filter((s) => gains[s.id] > 0.15).map((s) =>
    s.label.toLowerCase(),
  );
  if (audible.length === 0) {
    return "Near silence — every layer is faded down.";
  }
  const list =
    audible.length === 1
      ? audible[0]
      : `${audible.slice(0, -1).join(", ")} and ${audible[audible.length - 1]}`;
  return `${scene.caption} You can hear: ${list}.`;
}

// ——— Case studies — research chunk 06, claims C-10..C-12 ———

export const CASE_STUDIES: CaseStudy[] = [
  {
    game: "Hades",
    composer: "Darren Korb",
    engine: "FMOD",
    technique:
      "Vertical layering: the drum stem kicks in during combat and turns off when the room is cleared, while a semi-random pick of guitar and bass stems keeps each chamber fresh.",
    note: "Four pieces for Tartarus, three each for Asphodel and Elysium; bosses advance to a harder section.",
    source:
      "https://gameplay.co/hades-game-music-sound-design-darren-korb-supergiant-games/",
  },
  {
    game: "Red Dead Redemption 2",
    composer: "Woody Jackson",
    engine: "Custom (Rockstar)",
    technique:
      "An open-world score built from eleven stems in four-to-five-minute loops, no longer locked to one key or tempo — steered in real time by an internal AI Rockstar calls the Gunfight Conductor.",
    note: "The first Red Dead managed five stems, all sharing key and tempo.",
    source:
      "https://www.hollywoodreporter.com/news/general-news/red-dead-redemption-2-official-score-launches-digital-platforms-1230363/",
  },
  {
    game: "Destiny · Halo",
    composer: "M. O'Donnell & M. Salvatori",
    engine: "Bungie custom",
    technique:
      "Compose a piece that stands on its own, then take it apart into intro, loop, and outro chunks the game recombines — adaptive scoring built before off-the-shelf middleware existed.",
    note: "Bungie wrote their own tools; no system in 1996 could do what they wanted.",
    source:
      "https://www.nicholassinger.com/blog/halo-and-the-birth-of-cinematic-adaptive-music",
  },
];

// ——— Middleware — research chunk 05, claims C-09a/b ———

export const MIDDLEWARE: Middleware[] = [
  {
    name: "Wwise",
    maker: "Audiokinetic",
    character: "The most elaborate music system in the field.",
    features: [
      "Segments, playlists, and switch containers",
      "A transition matrix for every state-to-state move",
      "Stingers and MIDI-driven instruments",
      "Beat callbacks so gameplay can sync to the music",
    ],
  },
  {
    name: "FMOD",
    maker: "Firelight",
    character: "A DAW-like timeline that composers take to quickly.",
    features: [
      "Multi-track timeline with per-track volume",
      "Transition and loop regions",
      "Quantisation that snaps changes to the beat or bar",
      "A parameter that layers instruments in as intensity climbs",
    ],
  },
];
