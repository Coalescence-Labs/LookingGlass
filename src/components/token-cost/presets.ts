import type { CostScenario } from "@/lib/token-cost";

export type ScenarioPreset = {
  id: string;
  label: string;
  blurb: string;
  scenario: Omit<CostScenario, "modelId"> & { modelId?: string };
};

/** Opinionated starting points for AI-app budgeting. */
export const PRESETS: ScenarioPreset[] = [
  {
    id: "support-bot",
    label: "Support bot",
    blurb:
      "Short user message + system prompt, modest reply. High volume, low per-turn cost.",
    scenario: {
      modelId: "claude-haiku-5.5",
      text: { mode: "tokens", tokens: 1_200 },
      outputTokens: 400,
      cacheHitPercent: 70,
      requestsPerDay: 5_000,
      users: 1,
    },
  },
  {
    id: "rag-chat",
    label: "RAG chat",
    blurb:
      "Retrieved chunks plus a question; mid-length answer. Cache the corpus prefix.",
    scenario: {
      modelId: "claude-sonnet-5.5",
      text: { mode: "tokens", tokens: 8_000 },
      outputTokens: 1_200,
      cacheHitPercent: 60,
      requestsPerDay: 800,
      users: 1,
    },
  },
  {
    id: "coding-agent",
    label: "Coding agent",
    blurb:
      "Large context (files + tools), longer reasoning-shaped output. Few requests, expensive each.",
    scenario: {
      modelId: "claude-opus-5.5",
      text: { mode: "tokens", tokens: 40_000 },
      outputTokens: 6_000,
      cacheHitPercent: 40,
      requestsPerDay: 50,
      users: 1,
    },
  },
  {
    id: "multimodal-ingest",
    label: "Multimodal ingest",
    blurb:
      "A short clip, a voiceover, and a couple of frames — modalities dominate the bill.",
    scenario: {
      modelId: "gemini-4-argon",
      text: { mode: "tokens", tokens: 500 },
      images: { count: 4, size: "medium" },
      audioSeconds: 90,
      video: { seconds: 30, format: "default" },
      outputTokens: 800,
      cacheHitPercent: 0,
      requestsPerDay: 200,
      users: 1,
    },
  },
];
