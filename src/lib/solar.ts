export type StageId =
  | "collapse"
  | "main-sequence"
  | "rgb"
  | "helium-flash"
  | "horizontal-branch"
  | "agb"
  | "planetary-nebula"
  | "white-dwarf";

export type Citation = {
  label: string;
  source: "nasa" | "nasaFacts" | "cd" | "iben" | "schaller" | "sackmann" | "iau";
  note?: string;
};

export type Stage = {
  id: StageId;
  index: number;
  name: string;
  subtitle: string;
  order: number;
  startGyr: number;
  durationGyr: number;
  isEvent?: boolean;
  coreTempMK: string;
  radiusRSun: string;
  luminosityLSun: string;
  coreState: string;
  surface: string;
  blurb: string;
  analogy: string;
  citations: Citation[];
};

export const SUN_CURRENT_AGE_GYR = 4.6;

export const STAGES: Stage[] = [
  {
    id: "collapse",
    index: 0,
    name: "Nebular collapse",
    subtitle: "Before the main engine starts",
    order: 1,
    startGyr: 0,
    durationGyr: 0.05,
    coreTempMK: "0.03 → ~10",
    radiusRSun: "~100 → 1",
    luminosityLSun: "~1",
    coreState: "Infalling H–He plasma; gravity doing the work before fusion.",
    surface: "Radius shrinks while temperature climbs; luminosity stays roughly fixed through the Hayashi regime.",
    blurb:
      "A molecular cloud collapses under its own weight. Gravitational potential energy becomes heat; the gas ionises into plasma; the protostar follows the Hayashi track toward the zero-age main sequence.",
    analogy: "A gravity-powered battery charging before the engine turns over.",
    citations: [
      { label: "NASA Science — Sun facts", source: "nasaFacts" },
      { label: "Christensen-Dalsgaard §10.3", source: "cd" },
    ],
  },
  {
    id: "main-sequence",
    index: 1,
    name: "Main sequence",
    subtitle: "Where the sun is now",
    order: 2,
    startGyr: 0.05,
    durationGyr: 10,
    // L/R span: Sackmann et al. 1993 solar track (ZAMS ~0.7 L☉ → ~2.2 L☉ at ~11 Gyr).
    // Duration ~10 Gyr follows NASA public wording; detailed tracks are ~10–11 Gyr.
    coreTempMK: "~13 → ~16",
    radiusRSun: "0.9 → ~1.6",
    luminosityLSun: "0.7 → ~2",
    coreState: "Core hydrogen fuses to helium via the pp chain; core is radiative.",
    surface:
      "Radius grows slowly; luminosity roughly triples from ZAMS to turnoff (~30% brighter than today within a few Gyr) — enough to end surface habitability long before any giant-phase engulfment.",
    blurb:
      "About ten billion years of hydrostatic equilibrium: pressure pushing out, gravity pushing in, fusion replacing the energy that leaks away as sunlight. The steady state we owe our existence to.",
    analogy: "A thermostat on its longest cycle.",
    citations: [
      { label: "NASA Sun facts (age / ~10 Gyr lifetime)", source: "nasaFacts" },
      { label: "Sackmann et al. (1993) solar track", source: "sackmann" },
      { label: "Christensen-Dalsgaard §11.2", source: "cd" },
    ],
  },
  {
    id: "rgb",
    index: 2,
    name: "Red giant branch",
    subtitle: "The envelope swells",
    order: 3,
    startGyr: 10.05,
    durationGyr: 0.6,
    coreTempMK: "15 → ~100",
    // Tip R/L: Sackmann et al. 1993 (~170 R☉, ~2,300 L☉); model-dependent.
    radiusRSun: "~1.6 → ~170",
    luminosityLSun: "~2 → ~2,300",
    coreState: "Inert helium core compresses and becomes electron-degenerate; hydrogen continues to burn in a thin shell around it.",
    surface: "Envelope inflates by two orders of magnitude; convection zone deepens until it reaches nuclear-processed layers (first dredge-up).",
    blurb:
      "With core hydrogen exhausted, the core contracts and heats; the shell above it fuses faster and faster; the outer layers respond by ballooning outward and cooling. At the tip the sun reaches past Mercury's present orbit.",
    analogy: "A dense knot at the middle while the rest puffs up around it.",
    citations: [
      { label: "Sackmann et al. (1993) RGB tip", source: "sackmann" },
      { label: "Iben (2012) §1.1", source: "iben" },
      { label: "Christensen-Dalsgaard §10.2", source: "cd" },
    ],
  },
  {
    id: "helium-flash",
    index: 3,
    name: "Helium flash",
    subtitle: "An event, not a phase",
    order: 4,
    startGyr: 10.65,
    durationGyr: 1e-7,
    isEvent: true,
    coreTempMK: "≈100 (runaway)",
    radiusRSun: "unchanged at surface",
    luminosityLSun: "≈2,300 at tip",
    coreState: "Helium ignites in a degenerate core. Temperature spikes; pressure doesn't respond; fusion rate runs away until degeneracy is lifted.",
    surface: "Almost nothing visible. The outburst is absorbed internally — the envelope barely notices.",
    blurb:
      "A thermonuclear runaway buried at the centre, over in anywhere from seconds to minutes. The core restructures itself; the surface carries on indifferent.",
    analogy: "An internal surge that rebuilds the engine before the dashboard reacts.",
    citations: [
      { label: "Christensen-Dalsgaard §12.3", source: "cd" },
      { label: "Iben (2012) §2.4", source: "iben" },
    ],
  },
  {
    id: "horizontal-branch",
    index: 4,
    name: "Horizontal branch",
    subtitle: "A second steady gear",
    order: 5,
    startGyr: 10.65,
    durationGyr: 0.12,
    coreTempMK: "~100",
    radiusRSun: "~10",
    luminosityLSun: "~50",
    coreState: "Stable core helium burning (triple-alpha to carbon and oxygen); non-degenerate; hydrogen shell still contributes.",
    surface: "Smaller and hotter than the RGB tip; lives in the red-clump region of the HR diagram.",
    blurb:
      "After the flash, the sun settles. Helium burns steadily in a non-degenerate core for a hundred million years, producing carbon and oxygen that the next phase inherits.",
    analogy: "A second, hotter cruise after the reset.",
    citations: [
      { label: "Christensen-Dalsgaard §10.3", source: "cd" },
      { label: "Iben (2012) §1.1", source: "iben" },
    ],
  },
  {
    id: "agb",
    index: 5,
    name: "Asymptotic giant branch",
    subtitle: "A pulsing finale",
    order: 6,
    startGyr: 10.77,
    durationGyr: 0.02,
    coreTempMK: "100+",
    radiusRSun: "~200",
    luminosityLSun: "~3,000+",
    coreState: "Inert C–O core, degenerate; hydrogen and helium shells burn in alternating thermal pulses.",
    surface:
      "Largest radii the sun will ever reach (~200 R☉ ≈ 0.9 AU in solar tracks); strong dust-driven mass loss — the superwind peels the envelope off altogether.",
    blurb:
      "Two shells take turns igniting; the star pulses outward and inward; a dense stellar wind carries mass away. By the end, most of the sun is no longer the sun. Whether Earth's orbit survives depends on mass loss and tides — the tip radius alone is not a verdict.",
    analogy: "A long exhale that leaves the core exposed.",
    citations: [
      { label: "Sackmann et al. (1993) AGB tip", source: "sackmann" },
      { label: "Christensen-Dalsgaard §11.1", source: "cd" },
      { label: "Iben (2012) §1.1", source: "iben" },
    ],
  },
  {
    id: "planetary-nebula",
    index: 6,
    name: "Planetary nebula",
    subtitle: "A misnamed afterglow",
    order: 7,
    startGyr: 10.79,
    durationGyr: 0.00002,
    coreTempMK: "cooling bare core",
    radiusRSun: "~0.02 (core) / ejecta LY-scale",
    luminosityLSun: "~1,000 (central star)",
    coreState: "Nuclear burning ends. A hot, compact C–O core emerges.",
    surface: "The ejected envelope — ionised by the core's ultraviolet — glows for a few tens of thousands of years.",
    blurb:
      "The name is a historical mistake (William Herschel thought they looked like planets through an eyepiece); the object is an expanding shell of ejected gas lit from within by the dying core.",
    analogy: "The smoke ring, still glowing, after the fire goes out.",
    citations: [
      { label: "Iben (2012) §1.1", source: "iben" },
      { label: "Christensen-Dalsgaard §12.3", source: "cd" },
    ],
  },
  {
    id: "white-dwarf",
    index: 7,
    name: "White dwarf",
    subtitle: "A cooling ember",
    order: 8,
    startGyr: 10.8,
    // Schematic axis length: cooling continues for ~10¹¹–10¹² yr (order-of-magnitude).
    durationGyr: 100,
    coreTempMK: "cooling from ~100",
    radiusRSun: "~0.01",
    luminosityLSun: "10⁻² → 10⁻⁴",
    coreState: "No fusion. A degenerate carbon–oxygen core the size of Earth, supported by electron degeneracy pressure.",
    surface: "Starts white-hot; fades over hundreds of billions of years toward a cold remnant.",
    blurb:
      "What's left is the size of Earth and roughly half a solar mass after envelope loss. With no new energy source, it radiates what it has and slowly cools — a process that takes longer than the current age of the universe, and in detailed cooling models can stretch toward a trillion years.",
    analogy: "An ember from a dead fire, still warm to the touch for longer than anything else will last.",
    citations: [
      { label: "Sackmann et al. (1993) remnant mass", source: "sackmann" },
      { label: "Iben (2012) §1.1", source: "iben" },
      { label: "Christensen-Dalsgaard §11.2", source: "cd" },
    ],
  },
];

export const SOURCES = {
  nasa: {
    label: "NASA Sun Fact Sheet (Teff, luminosity, central T)",
    href: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html",
  },
  nasaFacts: {
    label: "NASA Science — Sun facts (age, ~10 Gyr lifetime)",
    href: "https://science.nasa.gov/sun/facts/",
  },
  cd: {
    label: "Christensen-Dalsgaard, Lecture Notes on Stellar Structure and Evolution (Aarhus; Wayback snapshot of 2023 PDF)",
    href: "https://web.archive.org/web/20240712030349/https://users-phys.au.dk/~jcd/evolnotes/LN_stellar_structure.pdf",
  },
  iben: {
    label: "Iben, Stellar Evolution Physics (Cambridge Univ. Press, 2012)",
    href: "https://www.cambridge.org/core/product/identifier/9781139061223/type/BOOK",
  },
  schaller: {
    label: "Schaller et al., New grids of stellar models (1992), A&AS 96, 269",
    href: "https://articles.adsabs.harvard.edu/pdf/1992A%26AS...96..269S",
  },
  sackmann: {
    label: "Sackmann, Boothroyd & Kraemer, Our Sun. III. Present and Future (1993), ApJ 418, 457",
    href: "https://articles.adsabs.harvard.edu/pdf/1993ApJ...418..457S",
  },
  iau: {
    label: "International Astronomical Union",
    href: "https://www.iau.org/",
  },
} as const;

export type SourceId = keyof typeof SOURCES;

export const TOTAL_GYR = STAGES.reduce(
  (max, s) => Math.max(max, s.startGyr + s.durationGyr),
  0,
);

export const LOG_RANGE = { minGyr: 0.001, maxGyr: TOTAL_GYR };

export function stageAt(gyr: number): Stage {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    const s = STAGES[i];
    if (gyr >= s.startGyr) return s;
  }
  return STAGES[0];
}

export function formatGyr(gyr: number): string {
  if (gyr >= 1) return `${gyr.toFixed(gyr >= 10 ? 0 : 1)} Gyr`;
  if (gyr >= 0.001) return `${(gyr * 1000).toFixed(0)} Myr`;
  if (gyr >= 1e-6) return `${(gyr * 1e6).toFixed(0)} yr`;
  return "< 1 yr";
}

export const SECONDS_PER_YEAR = 3.155693e7;

export function stageDurationYears(stage: Stage): number {
  if (stage.isEvent) return 60; // helium-flash representative: ~1 minute
  return stage.durationGyr * 1e9;
}

export function formatDuration(years: number): string {
  if (years >= 1e9) return `${(years / 1e9).toFixed(years >= 10e9 ? 0 : 1)} Gyr`;
  if (years >= 1e6) return `${(years / 1e6).toFixed(0)} Myr`;
  if (years >= 1e3) return `${(years / 1e3).toFixed(0)} kyr`;
  if (years >= 1) return `${Math.round(years)} yr`;
  return `~${Math.round(years * SECONDS_PER_YEAR)} s`;
}

const SUPERSCRIPTS: Record<string, string> = {
  "-": "⁻",
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

export function toSuperscript(n: number): string {
  return String(n)
    .split("")
    .map((c) => SUPERSCRIPTS[c] ?? c)
    .join("");
}

export function formatLogYears(years: number): string {
  const exp = Math.round(Math.log10(years));
  return `10${toSuperscript(exp)} yr`;
}

export function formatDurationPlain(years: number): string {
  if (years >= 1e9) {
    const v = years / 1e9;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)} billion years`;
  }
  if (years >= 1e6) {
    return `${Math.round(years / 1e6)} million years`;
  }
  if (years >= 1e3) {
    return `${Math.round(years / 1e3)},000 years`;
  }
  if (years >= 1) {
    return `${Math.round(years)} years`;
  }
  return `~${Math.round(years * SECONDS_PER_YEAR)} seconds`;
}

export type HRPoint = { tempK: number; lumLSun: number; stageId: StageId; label?: string };

/** Simplified schematic track. Teff "Now" = IAU/NASA 5772 K; L/R waypoints follow Sackmann et al. 1993 order of magnitude. */
export const HR_PATH: HRPoint[] = [
  { tempK: 4000, lumLSun: 10, stageId: "collapse", label: "Hayashi" },
  { tempK: 5500, lumLSun: 0.7, stageId: "main-sequence", label: "ZAMS" },
  { tempK: 5772, lumLSun: 1.0, stageId: "main-sequence", label: "Now" },
  { tempK: 5800, lumLSun: 2.2, stageId: "main-sequence", label: "Late MS" },
  { tempK: 4500, lumLSun: 40, stageId: "rgb", label: "RGB base" },
  { tempK: 3100, lumLSun: 2300, stageId: "rgb", label: "RGB tip" },
  { tempK: 4800, lumLSun: 50, stageId: "horizontal-branch", label: "Red clump" },
  { tempK: 3000, lumLSun: 3500, stageId: "agb", label: "AGB tip" },
  { tempK: 30000, lumLSun: 1000, stageId: "planetary-nebula", label: "PN central star" },
  { tempK: 100000, lumLSun: 100, stageId: "planetary-nebula" },
  { tempK: 40000, lumLSun: 0.1, stageId: "white-dwarf", label: "WD" },
  { tempK: 5000, lumLSun: 0.0001, stageId: "white-dwarf", label: "Cold WD" },
];

export const HR_RANGE = {
  tempK: { min: 2500, max: 120000 },
  lumLSun: { min: 1e-4, max: 4000 },
};
