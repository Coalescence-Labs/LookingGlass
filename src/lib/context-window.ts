// Model context windows verified April 2026.
// Sources referenced on /context-window#sources.

export type ModelFamily =
  | "anthropic"
  | "openai"
  | "google"
  | "meta"
  | "deepseek"
  | "qwen"
  | "mistral"
  | "moonshot";

export type ContextWindowModel = {
  name: string;
  family: ModelFamily;
  category: "closed" | "open";
  tokens: number;
  /** optional beta/opt-in size, shown dimmer */
  tokensBeta?: number;
  note?: string;
  source: string;
};

// Ordered smallest to largest within each category for visual rhythm.
export const MODELS: ContextWindowModel[] = [
  // Closed-weight
  {
    name: "DeepSeek V3.2",
    family: "deepseek",
    category: "open",
    tokens: 128_000,
    note: "Open-weight reasoning & code model.",
    source: "https://www.deepseek.com",
  },
  {
    name: "Claude Haiku 4.5",
    family: "anthropic",
    category: "closed",
    tokens: 200_000,
    note: "Anthropic's small/fast tier.",
    source: "https://docs.claude.com/en/docs/about-claude/models",
  },
  {
    name: "Mistral Large 3",
    family: "mistral",
    category: "open",
    tokens: 256_000,
    note: "Sparse MoE flagship, 41B active.",
    source: "https://mistral.ai",
  },
  {
    name: "Qwen 3.5",
    family: "qwen",
    category: "open",
    tokens: 256_000,
    note: "Alibaba's MoE frontier.",
    source: "https://qwen.ai",
  },
  {
    name: "Kimi K2.5",
    family: "moonshot",
    category: "open",
    tokens: 256_000,
    note: "Moonshot's agentic MoE.",
    source: "https://moonshot.ai",
  },
  {
    name: "GPT-5.4",
    family: "openai",
    category: "closed",
    tokens: 272_000,
    tokensBeta: 1_000_000,
    note: "1M opt-in for Codex and long-doc work.",
    source: "https://platform.openai.com/docs/models",
  },
  {
    name: "Claude Opus 4.7",
    family: "anthropic",
    category: "closed",
    tokens: 1_000_000,
    note: "Frontier reasoning, multimodal.",
    source: "https://docs.claude.com/en/docs/about-claude/models",
  },
  {
    name: "Claude Sonnet 4.6",
    family: "anthropic",
    category: "closed",
    tokens: 1_000_000,
    note: "Balanced frontier model.",
    source: "https://docs.claude.com/en/docs/about-claude/models",
  },
  {
    name: "Gemini 2.5 Flash",
    family: "google",
    category: "closed",
    tokens: 1_000_000,
    note: "Fast, multimodal, cost-efficient.",
    source: "https://ai.google.dev/gemini-api/docs/long-context",
  },
  {
    name: "Gemini 2.5 Pro",
    family: "google",
    category: "closed",
    tokens: 1_000_000,
    tokensBeta: 2_000_000,
    note: "2M beta; native video and audio in context.",
    source: "https://ai.google.dev/gemini-api/docs/long-context",
  },
  {
    name: "Llama 4 Scout",
    family: "meta",
    category: "open",
    tokens: 10_000_000,
    note: "Meta's 10M-token research frontier.",
    source: "https://ai.meta.com/blog/llama-4",
  },
];

export const MAX_TOKENS = Math.max(
  ...MODELS.map((m) => m.tokensBeta ?? m.tokens),
);

// ——— Equivalents ———

export const WORDS_PER_TOKEN = 0.75;
export const WORDS_PER_PAGE = 275; // trade paperback

export function tokensToPages(tokens: number) {
  return (tokens * WORDS_PER_TOKEN) / WORDS_PER_PAGE;
}

export function tokensToWords(tokens: number) {
  return tokens * WORDS_PER_TOKEN;
}

export function formatTokensShort(n: number) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m >= 10 ? `${Math.round(m)}M` : m === Math.round(m) ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

export function formatPages(n: number) {
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K pages`;
  if (n >= 1_000) return `${Math.round(n).toLocaleString()} pages`;
  return `${Math.round(n)} pages`;
}

export const FAMILY_LABEL: Record<ModelFamily, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Google",
  meta: "Meta",
  deepseek: "DeepSeek",
  qwen: "Alibaba",
  mistral: "Mistral",
  moonshot: "Moonshot",
};
