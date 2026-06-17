// Data for Concept 04 — "How an espresso machine works".
// Every figure traces to a claim ID in research/espresso-machine/.
// Sources are listed in SOURCES and surfaced on /espresso-machine#sources.

export type Standard = {
  id: string;
  label: string;
  dose: string;
  temp: string;
  pressure: string;
  time: string;
  yield: string;
  source: string;
};

// SCA historical + INEI certified definitions. Claims C-01, C-02.
export const STANDARDS: Standard[] = [
  {
    id: "sca",
    label: "SCA (historical)",
    dose: "7–9 g",
    temp: "92–95 °C",
    pressure: "9–10 bar",
    time: "20–30 s",
    yield: "25–35 mL",
    source: "cameron-hendon-2020",
  },
  {
    id: "inei",
    label: "Istituto Espresso Italiano",
    dose: "7 g ±0.5",
    temp: "88 °C ±2 (at the group)",
    pressure: "9 bar ±1",
    time: "25 s ±2.5",
    yield: "25 mL ±2.5",
    source: "inei",
  },
];

// Modern café reference (C-10).
export const CAFE_REFERENCE = {
  dose: "18 g",
  beverage: "36 g",
  note: "a common modern recipe; doses run 15–22 g into 30–60 g drinks",
  source: "cameron-hendon-2020",
};

// Nine bar in familiar units (C-03).
export const PRESSURE_INTUITION = {
  bar: 9,
  psi: 130,
  atmospheres: 9,
};

export type FlowNode = {
  id: string;
  label: string;
  role: string;
  detail: string;
  claim: string;
};

// Ordered flow path for the cutaway (C-03, C-04, C-05, C-14).
export const FLOW_NODES: FlowNode[] = [
  {
    id: "reservoir",
    label: "Reservoir",
    role: "Cold water, waiting",
    detail:
      "Every shot begins here, at room temperature. From this tank the pump draws the few grams of water a single espresso needs.",
    claim: "C-14",
  },
  {
    id: "pump",
    label: "Pump",
    role: "Where pressure is made",
    detail:
      "A vibratory pump buzzes a piston roughly sixty times a second; a rotary pump spins a vaned rotor for a smoother push. Either way, it drives water toward the coffee at around nine bar.",
    claim: "C-04",
  },
  {
    id: "opv",
    label: "Over-pressure valve",
    role: "The pressure ceiling",
    detail:
      "A spring valve bleeds anything above its setpoint back to the tank, so brew pressure settles near nine to ten bar instead of climbing without limit.",
    claim: "C-03",
  },
  {
    id: "boiler",
    label: "Boiler",
    role: "Where heat is held",
    detail:
      "Brew water is held a few degrees off the boil — about 90 to 96 °C. The steam side, when there is one, runs far hotter, around 125 to 135 °C.",
    claim: "C-05",
  },
  {
    id: "group",
    label: "Grouphead",
    role: "The warm threshold",
    detail:
      "Water enters the heavy brass group, often kept warm by a passive thermosiphon loop, and spreads across the top of the coffee through a dispersion screen.",
    claim: "C-05",
  },
  {
    id: "puck",
    label: "Portafilter & puck",
    role: "The resistor",
    detail:
      "Grounds are tamped level into the basket. This bed is what the water has to fight through; its grind size, more than anything, sets how hard the push has to be.",
    claim: "C-14",
  },
  {
    id: "cup",
    label: "Cup",
    role: "The result",
    detail:
      "Out comes the shot, crowned with crema — the foam that forms only because the whole path before it was under pressure.",
    claim: "C-11",
  },
];

export type PullSample = {
  t: number;
  pressure: number; // bar
  flow: number; // mL/s
  temp: number; // °C
};

// Keyframes for an illustrative reference shot. Shapes from chunk 06
// (pre-infusion soak → ~9 bar plateau → decline; flow coupled to pressure
// through the bed; temperature held nearly flat). NOT a logged shot.
const PULL_KEYFRAMES: PullSample[] = [
  { t: 0, pressure: 0.0, flow: 0.0, temp: 93.0 },
  { t: 2, pressure: 2.8, flow: 0.0, temp: 91.4 },
  { t: 4, pressure: 3.1, flow: 0.2, temp: 91.2 },
  { t: 6, pressure: 3.2, flow: 0.5, temp: 92.0 },
  { t: 8, pressure: 6.4, flow: 1.2, temp: 92.8 },
  { t: 10, pressure: 9.0, flow: 1.9, temp: 93.2 },
  { t: 14, pressure: 9.1, flow: 2.3, temp: 93.4 },
  { t: 18, pressure: 9.0, flow: 2.4, temp: 93.3 },
  { t: 24, pressure: 8.9, flow: 2.2, temp: 93.2 },
  { t: 27, pressure: 7.2, flow: 1.9, temp: 93.0 },
  { t: 30, pressure: 5.6, flow: 1.6, temp: 92.8 },
  { t: 32, pressure: 4.8, flow: 1.4, temp: 92.7 },
];

function lerp(a: number, b: number, f: number) {
  return a + (b - a) * f;
}

// Resample keyframes to 1-second spacing for smooth scrubbing. Pure and
// deterministic — computed once at module load, no runtime inference.
function buildPullCurve(): PullSample[] {
  const out: PullSample[] = [];
  const last = PULL_KEYFRAMES[PULL_KEYFRAMES.length - 1].t;
  let k = 0;
  for (let t = 0; t <= last; t++) {
    while (k < PULL_KEYFRAMES.length - 2 && PULL_KEYFRAMES[k + 1].t < t) k++;
    const a = PULL_KEYFRAMES[k];
    const b = PULL_KEYFRAMES[k + 1];
    const f = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
    out.push({
      t,
      pressure: Math.round(lerp(a.pressure, b.pressure, f) * 10) / 10,
      flow: Math.round(lerp(a.flow, b.flow, f) * 10) / 10,
      temp: Math.round(lerp(a.temp, b.temp, f) * 10) / 10,
    });
  }
  return out;
}

export const PULL_CURVE: PullSample[] = buildPullCurve();

export type PullPhase = {
  id: string;
  label: string;
  tStart: number;
  tEnd: number;
  note: string;
};

// Three phases of the shot (C-14, C-03).
export const PULL_PHASES: PullPhase[] = [
  {
    id: "pre-infusion",
    label: "Pre-infusion",
    tStart: 0,
    tEnd: 6,
    note: "Low-pressure water wets the whole puck so the coming pressure flows evenly instead of carving channels.",
  },
  {
    id: "plateau",
    label: "The nine-bar window",
    tStart: 6,
    tEnd: 24,
    note: "Full pressure. This plateau is the part the textbooks mean by “9 bar for 25 seconds.”",
  },
  {
    id: "decline",
    label: "Decline",
    tStart: 24,
    tEnd: 32,
    note: "On a profiling machine the pressure tapers off, easing back the late, harsher end of extraction.",
  },
];

export const PULL_AXES = {
  tMax: 32,
  pressureMax: 10,
  flowMax: 3,
  tempMin: 88,
  tempMax: 96,
};

export type BoilerClass = {
  id: string;
  name: string;
  essence: string;
  brewTemp: string;
  steamTemp: string;
  simultaneous: boolean;
  stability: string;
  ritual: string;
  detail: string;
  source: string;
};

// Single / HX / dual (C-05, C-06).
export const BOILERS: BoilerClass[] = [
  {
    id: "single",
    name: "Single boiler",
    essence: "One vessel, one job at a time",
    brewTemp: "~90–96 °C",
    steamTemp: "raise & wait",
    simultaneous: false,
    stability: "Swings; surf the cycle",
    ritual: "Temperature surfing",
    detail:
      "One boiler heats brew water, then is cranked up for steam and cooled down again. Cheapest and most frugal, but you cannot brew and steam at once, and without a PID you time the shot against the thermostat's cycle.",
    source: "coffee-scholars",
  },
  {
    id: "hx",
    name: "Heat exchanger",
    essence: "Borrow steam heat for the brew",
    brewTemp: "flash-heated",
    steamTemp: "~125 °C",
    simultaneous: true,
    stability: "Good, with a flush",
    ritual: "Cooling flush",
    detail:
      "A tube runs through a steam-temperature boiler; cold water flashes to brew temperature as it passes. You can brew and steam together — but water idling in the tube overheats, so you run a brief cooling flush before pulling.",
    source: "coffee-scholars",
  },
  {
    id: "dual",
    name: "Dual boiler",
    essence: "Two boilers, kept apart",
    brewTemp: "~93 °C (PID)",
    steamTemp: "~125–135 °C",
    simultaneous: true,
    stability: "≈ ±1 °C",
    ritual: "None",
    detail:
      "Two independent boilers, each with its own controller. The brew boiler is never disturbed by steaming, so a PID can hold it within about a degree — the steadiest, and the most expensive, answer.",
    source: "brew-precision",
  },
];

export type ScienceStat = {
  id: string;
  value: number;
  suffix: string;
  caption: string;
  claim: string;
};

// Extraction-science callouts (C-07, C-09).
export const SCIENCE_STATS: ScienceStat[] = [
  {
    id: "ceiling",
    value: 30,
    suffix: "%",
    caption: "of the bean is all that will ever dissolve — the rest is structure.",
    claim: "C-07",
  },
  {
    id: "downdose",
    value: 25,
    suffix: "%",
    caption: "less coffee per shot, at the same yield, by grinding coarser.",
    claim: "C-09",
  },
];

export type Myth = {
  myth: string;
  truth: string;
  claim: string;
};

// Folklore vs mechanism (C-08, C-09, C-11c, C-13).
export const MYTHS: Myth[] = [
  {
    myth: "More crema means better coffee.",
    truth:
      "Crema tracks freshness and trapped CO₂, not flavour. Stale beans foam less; robusta foams more than prized arabica.",
    claim: "C-11c",
  },
  {
    myth: "Tamp as hard as you can.",
    truth:
      "Within the range tested, tamp force barely moved yield or shot time. Its real job is to level the bed.",
    claim: "C-13",
  },
  {
    myth: "Finer grind always extracts more.",
    truth:
      "Past a point, fine beds channel: yield peaks, then falls, as water carves preferential paths.",
    claim: "C-08",
  },
  {
    myth: "Chase the 25-second shot.",
    truth:
      "Time is an outcome, not a dial. Steer by coffee mass and water mass; some good shots finish in under fifteen seconds.",
    claim: "C-09",
  },
];

// Crema facts for § V (C-11, C-12).
export const CREMA = {
  fractionOfCup: "at least 10%",
  persistence: "two minutes or more",
  dropletFineness: "90% of the oil droplets under 10 µm",
};

export type Source = {
  id: string;
  cite: string;
  href: string;
  tier: "primary" | "secondary";
  note: string;
};

export const SOURCES: Source[] = [
  {
    id: "cameron-hendon-2020",
    cite: "Cameron, Hendon, et al. — “Systematically Improving Espresso” (Matter, 2020)",
    href: "https://doi.org/10.1016/j.matt.2019.12.019",
    tier: "primary",
    note: "Extraction model and café experiment: the SCA definition, the grind/yield peak, channeling, downdosing, the tamp-force and pre-infusion findings.",
  },
  {
    id: "inei",
    cite: "Istituto Espresso Italiano — Espresso Italiano Certificato",
    href: "https://iei.coffee/espresso-italiano-certificato/",
    tier: "primary",
    note: "The body that certifies Italian espresso; its specification sets 7 g, 88 °C at the group, 9 bar, 25 s, and ~25 mL in the cup.",
  },
  {
    id: "illy-navarini-2011",
    cite: "Illy & Navarini — “Neglected Food Bubbles: The Espresso Coffee Foam” (Food Biophysics, 2011)",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3140933/",
    tier: "primary",
    note: "Crema as a CO₂-in-emulsion foam; volume fraction, droplet size, and persistence figures.",
  },
  {
    id: "crema-fri-2018",
    cite: "“Factors that affect the volume and stability of espresso crema” (Food Research International, 2018)",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S0963996918307105",
    tier: "secondary",
    note: "Surfactant roles: proteins and melanoidins form crema, polysaccharides make it persist, lipids firm the films.",
  },
  {
    id: "coffee-scholars",
    cite: "Coffee Scholars — boiler architectures",
    href: "https://coffeescholars.com/single-boiler-vs-heat-exchanger-vs-dual-boiler/",
    tier: "secondary",
    note: "Single / heat-exchanger / dual boiler mechanism, corroborated across vendors.",
  },
  {
    id: "brew-precision",
    cite: "Brew Precision — single vs dual boiler vs heat exchanger",
    href: "https://brewprecision.com/articles/single-boiler-vs-dual-boiler-vs-heat-exchanger",
    tier: "secondary",
    note: "Temperature-stability bands, including ≈ ±1 °C for dual-boiler PID brew circuits.",
  },
  {
    id: "clive-pumps",
    cite: "Clive Coffee — vibratory vs rotary pumps",
    href: "https://clivecoffee.com/blogs/learn/the-pump-the-heart-of-your-espresso-machine",
    tier: "secondary",
    note: "Pump mechanism and the 9 bar ≈ 130 psi intuition.",
  },
];

export function getSource(id: string) {
  return SOURCES.find((s) => s.id === id);
}

export function hostname(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}
