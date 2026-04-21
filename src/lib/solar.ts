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
  source: "nasa" | "cd" | "iben" | "schaller" | "iau";
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
      { label: "NASA Sun Fact Sheet", source: "nasa" },
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
    coreTempMK: "13 → 15",
    radiusRSun: "0.9 → 1.2",
    luminosityLSun: "0.7 → 1.3",
    coreState: "Core hydrogen fuses to helium via the pp chain; core is radiative.",
    surface: "Radius grows slightly; luminosity brightens ~30% over the phase — enough, eventually, to make Earth uninhabitable long before any red-giant engulfment.",
    blurb:
      "Ten billion years of hydrostatic equilibrium: pressure pushing out, gravity pushing in, fusion replacing the energy that leaks away as sunlight. The steady state we owe our existence to.",
    analogy: "A thermostat on its longest cycle.",
    citations: [
      { label: "NASA Sun Fact Sheet", source: "nasa" },
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
    radiusRSun: "1.2 → ~100",
    luminosityLSun: "1.3 → ~2,000",
    coreState: "Inert helium core compresses and becomes electron-degenerate; hydrogen continues to burn in a thin shell around it.",
    surface: "Envelope inflates by two orders of magnitude; convection zone deepens until it reaches nuclear-processed layers (first dredge-up).",
    blurb:
      "With core hydrogen exhausted, the core contracts and heats; the shell above it fuses faster and faster; the outer layers respond by ballooning outward and cooling. The sun swells past the orbit of Mercury.",
    analogy: "A dense knot at the middle while the rest puffs up around it.",
    citations: [
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
    luminosityLSun: "≈2,000 at tip",
    coreState: "Helium ignites in a degenerate core. Temperature spikes; pressure doesn't respond; fusion rate runs away until degeneracy is lifted.",
    surface: "Almost nothing visible. The outburst is absorbed internally — the envelope barely notices.",
    blurb:
      "A thermonuclear runaway buried at the centre, over in minutes. The core restructures itself; the surface carries on indifferent.",
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
    surface: "Largest radii the sun will ever reach; strong dust-driven mass loss — the superwind peels the envelope off altogether.",
    blurb:
      "Two shells take turns igniting; the star pulses outward and inward; a dense stellar wind carries mass away. By the end, most of the sun is no longer the sun.",
    analogy: "A long exhale that leaves the core exposed.",
    citations: [
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
    durationGyr: 100,
    coreTempMK: "cooling from ~100",
    radiusRSun: "~0.01",
    luminosityLSun: "10⁻² → 10⁻⁴",
    coreState: "No fusion. A degenerate carbon–oxygen core the size of Earth, supported by electron degeneracy pressure.",
    surface: "Starts white-hot; fades over billions of years to a dim, barely-visible object.",
    blurb:
      "What's left is the size of Earth and most of a solar mass. With no new energy source, it radiates what it has and slowly cools — a process that takes longer than the current age of the universe to complete.",
    analogy: "An ember from a dead fire, still warm to the touch for longer than anything else will last.",
    citations: [
      { label: "Iben (2012) §1.1", source: "iben" },
      { label: "Christensen-Dalsgaard §11.2", source: "cd" },
    ],
  },
];

export const SOURCES = {
  nasa: {
    label: "NASA Sun Fact Sheet",
    href: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html",
  },
  cd: {
    label: "Christensen-Dalsgaard, Stellar Structure and Evolution (Aarhus lecture notes, 2008)",
    href: "https://users-phys.au.dk/jcd/evolpub/",
  },
  iben: {
    label: "Iben, Stellar Evolution Physics (Cambridge Univ. Press, 2012)",
    href: "https://www.cambridge.org/core/books/stellar-evolution-physics/",
  },
  schaller: {
    label: "Schaller et al., New grids of stellar models (1992), A&AS 96, 269",
    href: "https://ui.adsabs.harvard.edu/abs/1992A&AS...96..269S/abstract",
  },
  iau: {
    label: "IAU — astronomical nomenclature",
    href: "https://www.iau.org/public/themes/naming/",
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

export type HRPoint = { tempK: number; lumLSun: number; stageId: StageId; label?: string };

export const HR_PATH: HRPoint[] = [
  { tempK: 4000, lumLSun: 10, stageId: "collapse", label: "Hayashi" },
  { tempK: 5500, lumLSun: 0.7, stageId: "main-sequence", label: "ZAMS" },
  { tempK: 5772, lumLSun: 1.0, stageId: "main-sequence", label: "Now" },
  { tempK: 5700, lumLSun: 1.6, stageId: "main-sequence", label: "Late MS" },
  { tempK: 4500, lumLSun: 40, stageId: "rgb", label: "RGB base" },
  { tempK: 3200, lumLSun: 2000, stageId: "rgb", label: "RGB tip" },
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
