"use client";

import { useState } from "react";
import { MODELS, type ModelSpec, formatUSD } from "@/lib/model-compare";
import { FAMILY_LABEL, formatTokensShort } from "@/lib/context-window";

type Task = {
  id: string;
  label: string;
  blurb: string;
  picks: { name: string; why: string }[];
};

const TASKS: Task[] = [
  {
    id: "write",
    label: "Write a memo or email",
    blurb:
      "Short-form drafting where quality matters more than depth. Any frontier model handles this well.",
    picks: [
      {
        name: "Claude Sonnet 4.6",
        why: "Consistently the strongest on tone and short-form prose at a reasonable rate.",
      },
      {
        name: "Gemini 2.5 Flash",
        why: "If cost is the priority, this is the cheapest option that still reads well.",
      },
    ],
  },
  {
    id: "code",
    label: "Write code or run a coding agent",
    blurb:
      "Serious software work — fixing bugs, shipping features, running autonomous agents.",
    picks: [
      {
        name: "Claude Opus 4.7",
        why: "Currently the strongest published score on SWE-bench Verified and the default choice for long-running coding agents.",
      },
      {
        name: "GPT-5.4",
        why: "Near-equal on coding, stronger on general reasoning — test both on your own workload.",
      },
      {
        name: "Kimi K2.5",
        why: "The open-weight alternative when your workload is coding-heavy and cost-sensitive.",
      },
    ],
  },
  {
    id: "long",
    label: "Read a long document or codebase",
    blurb:
      "Feeding a whole thing in at once, asking questions about it, summarising it.",
    picks: [
      {
        name: "Gemini 2.5 Pro",
        why: "Native multimodal ingestion at 1M tokens, with a 2M beta — remains the most practical long-context model in production.",
      },
      {
        name: "Claude Sonnet 4.6",
        why: "1M-token window at standard pricing; strong recall across the full window.",
      },
      {
        name: "Llama 4 Scout",
        why: "If self-hosting is required, the 10M-token window is unmatched in open-weight.",
      },
    ],
  },
  {
    id: "vision",
    label: "Handle images, audio, or video",
    blurb:
      "Describing a screenshot, transcribing an audio file, asking about a scene in a video.",
    picks: [
      {
        name: "Gemini 2.5 Pro",
        why: "The only frontier model that takes native video and audio directly into context.",
      },
      {
        name: "GPT-5.4",
        why: "Strong vision and audio pipeline; good fallback when you need OpenAI tooling.",
      },
      {
        name: "Claude Opus 4.7",
        why: "Higher-resolution image understanding than prior Claude versions; no native video.",
      },
    ],
  },
  {
    id: "cheap",
    label: "Run cheaply at scale",
    blurb:
      "High-volume classification, routing, support, or ingestion pipelines where every 1M tokens counts.",
    picks: [
      {
        name: "Gemini 2.5 Flash",
        why: "$0.30 in / $2.50 out — the cheapest closed model that still behaves like a frontier one.",
      },
      {
        name: "Claude Haiku 4.5",
        why: "Fast, reliable, strong tool use; the Anthropic default for production pipelines.",
      },
      {
        name: "DeepSeek V3.2",
        why: "Open-weight; $0.14 in / $0.28 out on third-party hosts, or free if you host it yourself.",
      },
    ],
  },
  {
    id: "selfhost",
    label: "Self-host (no API)",
    blurb:
      "Regulated data, EU residency, on-premise deployment, or simply wanting full control.",
    picks: [
      {
        name: "Llama 4 Scout",
        why: "Permissive license, 10M context, well-supported by inference stacks.",
      },
      {
        name: "Qwen 3.5",
        why: "Broad size ladder from small dense models to trillion-scale MoE — pick your compute.",
      },
      {
        name: "Mistral Large 3",
        why: "European provenance, GDPR-aligned, strong reasoning; worth paying for support contracts.",
      },
    ],
  },
];

function findModel(name: string): ModelSpec | undefined {
  return MODELS.find((m) => m.name === name);
}

export function TaskPicker() {
  const [activeId, setActiveId] = useState(TASKS[1].id);
  const active = TASKS.find((t) => t.id === activeId)!;

  return (
    <div
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <span className="type-mono-sm">What are you trying to do?</span>

      <div className="mt-4 flex flex-wrap gap-2">
        {TASKS.map((t) => {
          const on = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className="type-mono-sm px-3 py-1.5 transition-colors"
              style={{
                border: `1px solid ${on ? "var(--color-accent)" : "var(--color-line)"}`,
                color: on ? "var(--color-accent)" : "var(--color-bone-3)",
                background: on ? "rgba(228,199,138,0.06)" : "var(--color-glass)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <p className="type-lede mt-8 max-w-2xl">{active.blurb}</p>

      <ul className="mt-6 flex flex-col border-t border-line">
        {active.picks.map((p, i) => {
          const m = findModel(p.name);
          if (!m) return null;
          return (
            <li
              key={p.name}
              className="grid grid-cols-[auto_1fr] gap-5 border-b border-line py-6 md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-8"
            >
              <span className="type-mono text-bone-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-[1.35rem] leading-tight text-bone md:text-[1.5rem]">
                  {m.name}
                </h3>
                <span className="type-mono-sm">
                  {FAMILY_LABEL[m.family]} ·{" "}
                  {m.category === "open" ? "open-weight" : "closed"}
                </span>
                <p className="type-body mt-3 max-w-2xl">{p.why}</p>
              </div>
              <div className="type-mono-sm text-bone-3 md:text-right">
                {formatUSD(m.priceInput)} / {formatUSD(m.priceOutput)}
                <div className="text-dim">per 1M input / output</div>
                <div className="mt-1">
                  {formatTokensShort(m.contextTokens)} context
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 type-mono-sm text-bone-3 max-w-2xl">
        These are opinionated starting points, not rankings. Always evaluate
        two or three candidates on your own prompts before committing.
      </p>
    </div>
  );
}
