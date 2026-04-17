"use client";

import { useEffect, useRef, useState } from "react";
import {
  FAMILY_LABEL,
  MAX_TOKENS,
  MODELS,
  formatTokensShort,
  tokensToPages,
} from "@/lib/context-window";

export function ModelComparisonStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
        <span className="type-mono-sm">Context window · published size</span>
        <span className="type-mono-sm text-bone-3">
          Linear scale · 0 → {formatTokensShort(MAX_TOKENS)} tokens
        </span>
      </div>

      <ul className="mt-4 flex flex-col">
        {MODELS.map((m, i) => {
          const pct = (m.tokens / MAX_TOKENS) * 100;
          const pctBeta = m.tokensBeta
            ? (m.tokensBeta / MAX_TOKENS) * 100
            : null;
          const delay = i * 0.06;
          const pages = Math.round(tokensToPages(m.tokens));
          return (
            <li
              key={m.name}
              className="grid grid-cols-[1fr] gap-1 border-b border-line py-4 md:grid-cols-[minmax(180px,220px)_1fr_auto] md:items-center md:gap-6"
            >
              <div className="flex flex-col">
                <span className="font-serif text-[1.125rem] leading-tight text-bone md:text-[1.25rem]">
                  {m.name}
                </span>
                <span className="type-mono-sm">
                  {FAMILY_LABEL[m.family]} ·{" "}
                  <span className="text-bone-3">
                    {m.category === "open" ? "open-weight" : "closed"}
                  </span>
                </span>
              </div>

              <div
                className="relative h-[10px] w-full"
                style={{ background: "var(--color-line)" }}
                aria-label={`${m.name} context window`}
              >
                {/* Main bar */}
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: visible ? `${pct}%` : "0%",
                    background:
                      "linear-gradient(90deg, rgba(228,199,138,0.5), var(--color-accent))",
                    transition: `width 1400ms cubic-bezier(0.22,1,0.36,1) ${delay}s`,
                  }}
                />
                {/* Beta extension */}
                {pctBeta && (
                  <div
                    className="absolute inset-y-0"
                    style={{
                      left: `${pct}%`,
                      width: visible ? `${pctBeta - pct}%` : "0%",
                      background:
                        "repeating-linear-gradient(90deg, rgba(228,199,138,0.35) 0 4px, transparent 4px 7px)",
                      transition: `width 1400ms cubic-bezier(0.22,1,0.36,1) ${delay + 0.2}s`,
                    }}
                  />
                )}
              </div>

              <div className="flex items-baseline gap-2 justify-self-end text-right">
                <span className="type-numeral text-[1.5rem] text-bone md:text-[1.75rem]">
                  {formatTokensShort(m.tokens)}
                </span>
                {m.tokensBeta && (
                  <span className="type-mono-sm text-bone-3">
                    → {formatTokensShort(m.tokensBeta)} beta
                  </span>
                )}
                <span className="type-mono-sm hidden md:inline text-dim">
                  · ~{pages.toLocaleString()} pp
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 type-mono-sm text-bone-3 max-w-2xl">
        Solid bar is the published input window. Hatched extension marks an
        opt-in or beta size available to developers. Pages approximate at 275
        words to a paperback page.
      </p>
    </div>
  );
}
