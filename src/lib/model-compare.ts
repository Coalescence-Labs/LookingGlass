// Concept 02 data — frontier & leading open-weight models, April 2026.
// Every number here should be verifiable via the `sources` URLs on each record.
// Hedge language deliberately: prices and benchmarks shift monthly.
// Grok is intentionally excluded from this dataset per project direction.

import type { ModelFamily } from "./context-window";

export type Capability = "vision" | "audio" | "video" | "tools" | "reasoning";

export type ModelSpec = {
  name: string;
  family: ModelFamily;
  category: "closed" | "open";
  /** USD per 1M input tokens at the model's standard rate */
  priceInput: number;
  /** USD per 1M output tokens at the model's standard rate */
  priceOutput: number;
  /** ISO YYYY-MM; approximate GA release */
  released: string;
  contextTokens: number;
  contextBetaTokens?: number;
  capabilities: Capability[];
  /** One-sentence summary in our own voice — no marketing prose. */
  blurb: string;
  /** Where this model shines, in plain English. */
  bestFor: string;
  /** Honest caveat — the thing to watch out for. */
  watchFor: string;
  /** Quick notable benchmark, kept short. */
  benchmark?: string;
  /** Primary-source URLs for the numbers above. */
  sources: { label: string; url: string }[];
  /** For open-weight models, price can vary by provider. */
  priceNote?: string;
};

export const VERIFIED_DATE = "2026-04-18";

export const MODELS: ModelSpec[] = [
  // ——— Anthropic ———
  {
    name: "Claude Opus 4.7",
    family: "anthropic",
    category: "closed",
    priceInput: 5,
    priceOutput: 25,
    released: "2026-04",
    contextTokens: 1_000_000,
    capabilities: ["vision", "tools", "reasoning"],
    blurb:
      "Anthropic's most capable model; tuned for long-horizon agentic work and serious reasoning.",
    bestFor:
      "Complex coding tasks, autonomous agents, long document analysis where accuracy matters more than cost.",
    watchFor:
      "New tokenizer can produce up to ~35% more tokens for the same input than Opus 4.6 — the bill grows even though the rate card didn't.",
    benchmark: "SWE-bench Verified: 87.6%",
    sources: [
      {
        label: "Anthropic — Introducing Claude Opus 4.7",
        url: "https://www.anthropic.com/news/claude-opus-4-7",
      },
      {
        label: "Claude API pricing",
        url: "https://platform.claude.com/docs/en/about-claude/pricing",
      },
    ],
  },
  {
    name: "Claude Sonnet 4.6",
    family: "anthropic",
    category: "closed",
    priceInput: 3,
    priceOutput: 15,
    released: "2026-01",
    contextTokens: 1_000_000,
    capabilities: ["vision", "tools", "reasoning"],
    blurb:
      "The balanced middle tier — near-frontier quality at roughly half the cost of Opus.",
    bestFor:
      "Day-to-day coding, writing, and reasoning where Opus feels like overkill and Haiku feels too thin.",
    watchFor:
      "Trails Opus on the hardest agentic benchmarks; for heavy tool-use workloads, test both.",
    sources: [
      {
        label: "Claude models overview",
        url: "https://docs.claude.com/en/docs/about-claude/models",
      },
      {
        label: "Claude API pricing",
        url: "https://platform.claude.com/docs/en/about-claude/pricing",
      },
    ],
  },
  {
    name: "Claude Haiku 4.5",
    family: "anthropic",
    category: "closed",
    priceInput: 1,
    priceOutput: 5,
    released: "2025-10",
    contextTokens: 200_000,
    capabilities: ["vision", "tools", "reasoning"],
    blurb:
      "Anthropic's small/fast tier — cheap enough to run on every user interaction.",
    bestFor:
      "Classification, routing, lightweight chat, and high-volume production pipelines.",
    watchFor:
      "Reasoning drops off quickly on hard multi-step problems; not a replacement for Sonnet or Opus there.",
    sources: [
      {
        label: "Claude API pricing",
        url: "https://platform.claude.com/docs/en/about-claude/pricing",
      },
    ],
  },

  // ——— OpenAI ———
  {
    name: "GPT-5.4",
    family: "openai",
    category: "closed",
    priceInput: 2.5,
    priceOutput: 15,
    released: "2026-02",
    contextTokens: 272_000,
    contextBetaTokens: 1_000_000,
    capabilities: ["vision", "audio", "tools", "reasoning"],
    blurb:
      "OpenAI's flagship with strong general reasoning; 1M-context opt-in available for Codex and long-doc work.",
    bestFor:
      "General-purpose agents, math-heavy work, and tasks that benefit from the Thinking mode.",
    watchFor:
      "Input cost doubles past the 272K-token standard window — pin context size to avoid silent surcharges.",
    benchmark: "SWE-bench Verified: ~75%",
    sources: [
      {
        label: "OpenAI API pricing",
        url: "https://openai.com/api/pricing/",
      },
      {
        label: "OpenAI Models docs",
        url: "https://platform.openai.com/docs/models",
      },
    ],
  },

  // ——— Google ———
  {
    name: "Gemini 2.5 Pro",
    family: "google",
    category: "closed",
    priceInput: 1.25,
    priceOutput: 10,
    released: "2025-11",
    contextTokens: 1_000_000,
    contextBetaTokens: 2_000_000,
    capabilities: ["vision", "audio", "video", "tools", "reasoning"],
    blurb:
      "Google's frontier — native multimodal input (image, audio, video) at one of the largest windows in production.",
    bestFor:
      "Long documents, mixed-media input, math and scientific reasoning, and anything audio- or video-shaped.",
    watchFor:
      "Prompts past 200K tokens are billed at 2× the base rate; the 2M beta is opt-in.",
    benchmark: "GPQA Diamond: ~94% (Deep Think)",
    sources: [
      {
        label: "Gemini API pricing",
        url: "https://ai.google.dev/gemini-api/docs/pricing",
      },
      {
        label: "Gemini long context",
        url: "https://ai.google.dev/gemini-api/docs/long-context",
      },
    ],
  },
  {
    name: "Gemini 2.5 Flash",
    family: "google",
    category: "closed",
    priceInput: 0.3,
    priceOutput: 2.5,
    released: "2025-11",
    contextTokens: 1_000_000,
    capabilities: ["vision", "audio", "video", "tools"],
    blurb:
      "The cheap workhorse of the Gemini family — fast, multimodal, and generous on context.",
    bestFor:
      "High-volume multimodal pipelines, transcription-shaped work, cost-sensitive chat apps.",
    watchFor:
      "Not tuned for the hardest reasoning; step up to Pro when accuracy matters.",
    sources: [
      {
        label: "Gemini API pricing",
        url: "https://ai.google.dev/gemini-api/docs/pricing",
      },
    ],
  },

  // ——— Open-weight ———
  {
    name: "DeepSeek V3.2",
    family: "deepseek",
    category: "open",
    priceInput: 0.28,
    priceOutput: 0.42,
    released: "2026-01",
    contextTokens: 128_000,
    capabilities: ["tools", "reasoning"],
    blurb:
      "DeepSeek's reasoning-first MoE (671B total / 37B active) — remarkable quality for the price.",
    bestFor:
      "Self-hosted reasoning and code generation where cost per token dominates the decision.",
    watchFor:
      "Text-first; not the right choice for vision or multimodal workloads.",
    priceNote:
      "API prices vary by third-party host; weights are freely downloadable.",
    sources: [
      { label: "DeepSeek", url: "https://www.deepseek.com" },
      {
        label: "DeepSeek API — models & pricing",
        url: "https://api-docs.deepseek.com/quick_start/pricing",
      },
    ],
  },
  {
    name: "Llama 4 Scout",
    family: "meta",
    category: "open",
    priceInput: 0.15,
    priceOutput: 0.6,
    released: "2025-04",
    contextTokens: 10_000_000,
    capabilities: ["vision", "tools"],
    blurb:
      "Meta's 10M-token context leader — the largest public window in an open-weight model.",
    bestFor:
      "Processing very long documents, codebases, or log files where retrieval isn't enough.",
    watchFor:
      "Ten million tokens is the ceiling, not the comfortable working range — quality in the middle of the window still degrades.",
    priceNote:
      "Self-hostable at no API cost; numbers here are representative third-party host rates.",
    sources: [
      {
        label: "Meta — Llama 4",
        url: "https://ai.meta.com/blog/llama-4",
      },
    ],
  },
  {
    name: "Qwen 3.5",
    family: "qwen",
    category: "open",
    priceInput: 0.1,
    priceOutput: 0.2,
    released: "2025-12",
    contextTokens: 256_000,
    capabilities: ["vision", "tools", "reasoning"],
    blurb:
      "Alibaba's open-weight frontier — a broad family from small dense models up to a trillion-scale MoE.",
    bestFor:
      "Multilingual work, self-hosted deployments, and anyone who wants a ladder of sizes from one vendor.",
    watchFor:
      "Quality varies sharply between sizes; the advertised headline numbers belong to the flagship MoE, not the small dense checkpoints.",
    priceNote:
      "API prices vary by host and by size; rates shown are representative of the flagship.",
    sources: [{ label: "Qwen", url: "https://qwen.ai" }],
  },
  {
    name: "Kimi K2.5",
    family: "moonshot",
    category: "open",
    priceInput: 0.6,
    priceOutput: 3,
    released: "2026-01",
    contextTokens: 256_000,
    capabilities: ["vision", "tools", "reasoning"],
    blurb:
      "Moonshot's agentic MoE (1T total / 32B active) — built around tool-use and long-running work.",
    bestFor:
      "Multi-agent pipelines, code-heavy agents, and cost-sensitive alternatives to Sonnet-class models.",
    watchFor:
      "Ecosystem and tooling are less mature than the US frontier players; plan for integration work.",
    benchmark: "HumanEval: ~99%",
    priceNote:
      "Rates are Moonshot's direct API; third-party hosts vary.",
    sources: [
      { label: "Moonshot AI", url: "https://www.moonshot.ai" },
      {
        label: "Kimi K2.5 API pricing",
        url: "https://platform.kimi.ai/docs/pricing/chat-k25",
      },
    ],
  },
  {
    name: "Mistral Large 3",
    family: "mistral",
    category: "open",
    priceInput: 0.5,
    priceOutput: 1.5,
    released: "2025-12",
    contextTokens: 256_000,
    capabilities: ["vision", "tools", "reasoning"],
    blurb:
      "Mistral's flagship sparse MoE — European provenance, open weights, GDPR-friendly hosting.",
    bestFor:
      "EU deployments with data-residency requirements and mixed open/closed stacks.",
    watchFor:
      "Sparse MoE at 675B total — latency and VRAM needs can bite on self-hosted runs despite the low token price.",
    priceNote:
      "Pricing on Mistral's own La Plateforme differs from some resellers; rates shown are the model-card listing.",
    sources: [
      {
        label: "Mistral Large 3 model card",
        url: "https://docs.mistral.ai/models/model-cards/mistral-large-3-25-12",
      },
      { label: "Mistral AI pricing", url: "https://mistral.ai/pricing" },
    ],
  },
];

export function totalCostPerMillionMixed(
  m: ModelSpec,
  inputShare = 0.7,
): number {
  // weighted-average cost assuming 70% input / 30% output by default
  return m.priceInput * inputShare + m.priceOutput * (1 - inputShare);
}

export function formatUSD(n: number): string {
  if (n >= 10) return `$${n.toFixed(0)}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(2)}`;
}

export const CAPABILITY_LABEL: Record<Capability, string> = {
  vision: "Vision",
  audio: "Audio",
  video: "Video",
  tools: "Tool use",
  reasoning: "Reasoning",
};

export const CAPABILITY_GLYPH: Record<Capability, string> = {
  vision: "◉",
  audio: "♪",
  video: "▸",
  tools: "⚙",
  reasoning: "∮",
};
