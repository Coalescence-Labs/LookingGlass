export type Series = {
  id: string;
  roman: string;
  title: string;
  blurb: string;
};

export type Concept = {
  index: string;
  slug: string;
  title: string;
  subtitle: string;
  kicker: string;
  seriesId: string;
  status: "live" | "coming";
  readingTime?: string;
};

export const SERIES: Series[] = [
  {
    id: "language-models",
    roman: "I",
    title: "On language models",
    blurb:
      "How modern AI systems read, remember, and differ — the first concepts in the archive.",
  },
  {
    id: "everyday-machines",
    roman: "III",
    title: "Everyday machines",
    blurb:
      "The ordinary objects and systems we live inside — infrastructure, machines, and media, taken apart and held to the light.",
  },
];

export const concepts: Concept[] = [
  {
    index: "01",
    slug: "one-million-tokens",
    title: "How much is one million tokens?",
    subtitle:
      "Tokens are the currency models count in. One million of them is more — and less — than you'd expect.",
    kicker: "On scale",
    seriesId: "language-models",
    status: "live",
    readingTime: "5 min",
  },
  {
    index: "02",
    slug: "model-comparison",
    title: "What the latest models actually do differently",
    subtitle:
      "Opus, Sonnet, Haiku, GPT-5, Gemini, and the open-weight frontier — compared on what matters.",
    kicker: "On models",
    seriesId: "language-models",
    status: "live",
    readingTime: "8 min",
  },
  {
    index: "03",
    slug: "context-window",
    title: "What is a context window?",
    subtitle:
      "A model reads through a sliding viewport. What's inside it, it sees. What falls out, it forgets.",
    kicker: "On memory",
    seriesId: "language-models",
    status: "live",
    readingTime: "7 min",
  },
  {
    index: "04",
    slug: "mesh-networks",
    title: "How does a mesh network actually work?",
    subtitle:
      "A network with no centre, relaying every message hop by hop — how it routes today, and what we'd rebuild from the rubble if the stack fell.",
    kicker: "On infrastructure",
    seriesId: "everyday-machines",
    status: "live",
    readingTime: "9 min",
  },
  {
    index: "05",
    slug: "attention",
    title: "How does attention actually work?",
    subtitle:
      "Every word in a sentence quietly reads every other one, then keeps what's relevant. That reading step is attention — the engine inside every transformer.",
    kicker: "On attention",
    seriesId: "language-models",
    status: "live",
    readingTime: "9 min",
  },
  {
    index: "06",
    slug: "espresso-machine",
    title: "How an espresso machine works",
    subtitle:
      "Nine bars of pressure, water a few degrees off boiling, and seven grams of coffee — a contained thermodynamic event that resolves in under half a minute.",
    kicker: "On machines",
    seriesId: "everyday-machines",
    status: "live",
    readingTime: "9 min",
  },
];

export function getConcept(slug: string) {
  return concepts.find((c) => c.slug === slug);
}

export function getSeries(id: string) {
  return SERIES.find((s) => s.id === id);
}

export function conceptsBySeries() {
  return SERIES.map((series) => ({
    series,
    concepts: concepts.filter((c) => c.seriesId === series.id),
  }));
}
