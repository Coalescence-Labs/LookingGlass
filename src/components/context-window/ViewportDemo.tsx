"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  VIEWPORT_TEXT,
  VIEWPORT_TEXT_TITLE,
} from "@/lib/viewport-text";

const TOKENS_PER_CHAR = 0.25; // ≈ 4 chars per English token

const BAND_MIN = 80;
const BAND_MAX = 440;

type Para = { text: string; chars: number };

export function ViewportDemo() {
  const paragraphs: Para[] = useMemo(
    () =>
      VIEWPORT_TEXT.split(/\n\n+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .map((text) => ({ text, chars: text.length })),
    [],
  );

  const totalTokens = useMemo(
    () => Math.round(paragraphs.reduce((s, p) => s + p.chars, 0) * TOKENS_PER_CHAR),
    [paragraphs],
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [bandHeight, setBandHeight] = useState(220);
  const [visibleTokens, setVisibleTokens] = useState(0);
  const [fractions, setFractions] = useState<number[]>(() =>
    paragraphs.map(() => 0),
  );

  const recalc = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const bandTop = cr.top + (cr.height - bandHeight) / 2;
    const bandBottom = bandTop + bandHeight;

    const next = new Array<number>(paragraphs.length);
    let chars = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      const el = paraRefs.current[i];
      if (!el) {
        next[i] = 0;
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.bottom <= bandTop || r.top >= bandBottom) {
        next[i] = 0;
        continue;
      }
      const top = Math.max(r.top, bandTop);
      const bottom = Math.min(r.bottom, bandBottom);
      const frac = Math.max(0, Math.min(1, (bottom - top) / r.height));
      next[i] = frac;
      chars += frac * paragraphs[i].chars;
    }
    setFractions(next);
    setVisibleTokens(Math.round(chars * TOKENS_PER_CHAR));
  }, [bandHeight, paragraphs]);

  useEffect(() => {
    recalc();
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => recalc();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [recalc]);

  const pct = Math.min(100, (visibleTokens / totalTokens) * 100);

  return (
    <div
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="type-mono-sm">Source text</span>
          <span className="font-serif text-bone text-[1.05rem] italic">
            {VIEWPORT_TEXT_TITLE}
          </span>
        </div>
        <span className="type-mono-sm text-bone-3">
          Full essay · {totalTokens.toLocaleString()} tokens
        </span>
      </div>

      <div className="relative mt-5 border border-line-2 overflow-hidden" style={{ background: "rgba(9,9,11,0.55)" }}>
        <div
          ref={scrollRef}
          className="viewport-scroll overflow-y-auto"
          style={{ height: 520 }}
        >
          <div style={{ paddingTop: 260, paddingBottom: 260 }} className="px-6 md:px-10">
            {paragraphs.map((p, i) => {
              const frac = fractions[i] ?? 0;
              const op = 0.12 + 0.88 * frac;
              const blur = (1 - frac) * 1.4;
              return (
                <p
                  key={i}
                  ref={(el) => {
                    paraRefs.current[i] = el;
                  }}
                  className="font-serif text-[1.05rem] leading-[1.7] text-bone mb-5 md:text-[1.125rem]"
                  style={{
                    opacity: op,
                    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none",
                    transition: "opacity 120ms linear, filter 120ms linear",
                  }}
                >
                  {p.text}
                </p>
              );
            })}
          </div>
        </div>

        {/* Band outline — marks the "in-context" region */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2"
          style={{
            height: bandHeight,
            borderTop: "1px solid rgba(228,199,138,0.5)",
            borderBottom: "1px solid rgba(228,199,138,0.5)",
            background:
              "linear-gradient(to bottom, rgba(228,199,138,0.06), rgba(228,199,138,0.02) 50%, rgba(228,199,138,0.06))",
            boxShadow:
              "0 0 40px rgba(228,199,138,0.08), inset 0 0 60px rgba(228,199,138,0.04)",
          }}
        >
          <BandCorner className="left-0 top-0" />
          <BandCorner className="right-0 top-0" flipX />
          <BandCorner className="left-0 bottom-0" flipY />
          <BandCorner className="right-0 bottom-0" flipX flipY />
          <span className="absolute -top-[1.5rem] left-2 type-mono-sm text-accent">
            In context
          </span>
          <span className="absolute -bottom-[1.5rem] right-2 type-mono-sm text-bone-3">
            {visibleTokens.toLocaleString()} tokens
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8">
        <div className="flex items-baseline gap-3">
          <span className="type-mono-sm shrink-0">Window size</span>
          <span className="type-numeral text-bone text-[1.6rem]">
            {visibleTokens.toLocaleString()}
          </span>
          <span className="type-mono-sm">tok</span>
        </div>
        <input
          type="range"
          min={BAND_MIN}
          max={BAND_MAX}
          step={4}
          value={bandHeight}
          onChange={(e) => setBandHeight(parseInt(e.target.value))}
          className="lg-range w-full"
          aria-label="Context window size"
        />
        <span className="type-mono-sm text-bone-3 text-right">
          {pct < 1 ? "<1" : pct.toFixed(0)}% of the text
        </span>
      </div>

      <p className="mt-5 type-mono-sm text-bone-3 max-w-2xl">
        Scroll the essay up and down. The gold band is the model&rsquo;s
        context window — everything inside it, the model sees clearly.
        Everything outside, it has forgotten, or has never seen yet.
      </p>

      <style jsx>{`
        .viewport-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--color-line-2) transparent;
        }
        .viewport-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .viewport-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .viewport-scroll::-webkit-scrollbar-thumb {
          background: var(--color-line-2);
          border-radius: 3px;
        }
        :global(.lg-range) {
          -webkit-appearance: none;
          appearance: none;
          height: 1px;
          background: var(--color-line-2);
          outline: none;
          cursor: pointer;
        }
        :global(.lg-range::-webkit-slider-thumb) {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid var(--color-ink);
          box-shadow: 0 0 0 1px var(--color-accent),
            0 0 20px rgba(228, 199, 138, 0.4);
          transition: transform 0.2s;
        }
        :global(.lg-range::-webkit-slider-thumb:hover) {
          transform: scale(1.15);
        }
        :global(.lg-range::-moz-range-thumb) {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid var(--color-ink);
          box-shadow: 0 0 20px rgba(228, 199, 138, 0.4);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function BandCorner({
  className,
  flipX,
  flipY,
}: {
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
}) {
  const size = 10;
  return (
    <span
      className={`absolute ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        borderTop: flipY ? "none" : "1px solid var(--color-accent)",
        borderBottom: flipY ? "1px solid var(--color-accent)" : "none",
        borderLeft: flipX ? "none" : "1px solid var(--color-accent)",
        borderRight: flipX ? "1px solid var(--color-accent)" : "none",
      }}
    />
  );
}
