export type Concept = {
  index: string;
  slug: string;
  title: string;
  subtitle: string;
  kicker: string;
  status: "live" | "coming";
  readingTime?: string;
};

export const concepts: Concept[] = [
  {
    index: "01",
    slug: "one-million-tokens",
    title: "How much is one million tokens?",
    subtitle:
      "Tokens are the currency models count in. One million of them is more — and less — than you'd expect.",
    kicker: "On scale",
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
    status: "live",
    readingTime: "7 min",
  },
];

export function getConcept(slug: string) {
  return concepts.find((c) => c.slug === slug);
}
