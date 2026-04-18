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
