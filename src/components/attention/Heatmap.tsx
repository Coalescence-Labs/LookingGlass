"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  ATTENTION_EXAMPLE,
  strongestTarget,
  weightColor,
} from "@/lib/attention";
import { HeadSelector } from "./HeadSelector";

const EXAMPLE = ATTENTION_EXAMPLE;
const SENTENCE = EXAMPLE.tokens.join(" ");

export function Heatmap() {
  const reduce = useReducedMotion();
  const [headId, setHeadId] = useState(0);
  // Default to "it" (index 7) so the first thing the reader sees is a real
  // relationship, not an empty grid.
  const [selected, setSelected] = useState<number>(7);

  const head =
    EXAMPLE.heads.find((h) => h.id === headId) ?? EXAMPLE.heads[0];
  const tokens = EXAMPLE.tokens;
  const transition = reduce ? "none" : "opacity 160ms linear";

  const targetIdx = strongestTarget(head.weights[selected]);
  const targetWeight = head.weights[selected][targetIdx];

  return (
    <div
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="type-mono-sm">Attention head</span>
        <span className="type-mono-sm text-bone-3">
          Rows: where a word looks
        </span>
      </div>

      <div className="mt-4">
        <HeadSelector
          heads={EXAMPLE.heads.map((h) => ({ id: h.id, label: h.label }))}
          activeId={headId}
          onSelect={setHeadId}
        />
      </div>

      <p className="mt-4 type-body text-bone-3 max-w-2xl">{head.caption}</p>

      {/* Matrix */}
      <div className="mt-6 overflow-x-auto">
        <div
          role="group"
          aria-label={`Attention matrix for the sentence: ${SENTENCE}`}
          className="min-w-[34rem]"
        >
          {/* Column header strip — the "to" tokens */}
          <div
            className="grid items-end gap-px"
            style={{ gridTemplateColumns: `5.5rem repeat(${tokens.length}, 1fr)` }}
          >
            <span className="type-mono-sm text-bone-3 pb-2">to →</span>
            {tokens.map((t, j) => (
              <span
                key={j}
                className={`pb-2 text-center font-mono text-[0.625rem] leading-tight ${
                  j === targetIdx ? "text-accent" : "text-bone-3"
                }`}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Rows — each "from" token */}
          {tokens.map((from, i) => {
            const isSel = i === selected;
            const rowOpacity = isSel ? 1 : 0.5;
            return (
              <div
                key={i}
                className="grid items-stretch gap-px"
                style={{
                  gridTemplateColumns: `5.5rem repeat(${tokens.length}, 1fr)`,
                }}
              >
                <button
                  type="button"
                  aria-pressed={isSel}
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setSelected(i)}
                  onFocus={() => setSelected(i)}
                  className={`flex items-center justify-end gap-1 pr-2 py-1 text-right font-mono text-[0.7rem] transition-colors ${
                    isSel ? "text-accent" : "text-bone-3 hover:text-bone"
                  }`}
                >
                  {i === selected && <span aria-hidden>→</span>}
                  {from}
                </button>
                {head.weights[i].map((w, j) => (
                  <div
                    key={j}
                    aria-label={`${from} attends to ${tokens[j]}: ${w.toFixed(2)}`}
                    title={`${from} → ${tokens[j]}: ${w.toFixed(2)}`}
                    className="flex aspect-square items-center justify-center"
                    style={{
                      background: weightColor(w),
                      opacity: rowOpacity,
                      transition,
                      outline:
                        isSel && j === targetIdx
                          ? "1px solid var(--color-accent)"
                          : "none",
                    }}
                  >
                    <span
                      className={`hidden font-mono text-[0.55rem] tabular-nums md:inline ${
                        w >= 0.5 ? "text-ink" : "text-bone-3"
                      }`}
                    >
                      {w >= 0.1 ? w.toFixed(1) : ""}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live caption */}
      <p className="mt-5 type-mono-sm text-bone-3" aria-live="polite">
        <span className="text-bone">{tokens[selected]}</span> attends most to{" "}
        <span className="text-accent">{tokens[targetIdx]}</span> (
        {targetWeight.toFixed(2)})
      </p>

      <p className="mt-3 type-mono-sm text-bone-3 max-w-2xl">
        Hover or tap a word on the left to see where it looks. Brighter cells
        carry more weight; each row adds up to one.
      </p>
    </div>
  );
}
