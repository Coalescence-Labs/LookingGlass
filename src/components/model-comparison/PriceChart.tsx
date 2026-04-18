"use client";

import { useEffect, useRef, useState } from "react";
import { MODELS, formatUSD } from "@/lib/model-compare";

// Log-scale scatter: input $ on X, output $ on Y.
// Each dot positioned on a log10 grid so cheap open-weight models don't
// collapse into the origin next to the frontier.

const MIN = 0.05;
const MAX = 40;
const L_MIN = Math.log10(MIN);
const L_MAX = Math.log10(MAX);

function toPct(v: number): number {
  const l = Math.log10(Math.max(MIN, v));
  return ((l - L_MIN) / (L_MAX - L_MIN)) * 100;
}

export function PriceChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

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
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const gridTicks = [0.1, 1, 10];

  return (
    <div
      ref={ref}
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
        <span className="type-mono-sm">Price map · input × output</span>
        <span className="type-mono-sm text-bone-3">
          Log scale · $0.05 → $40 per 1M tokens
        </span>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_260px] md:items-start">
        <div
          className="relative w-full"
          style={{ aspectRatio: "1 / 1", maxWidth: 640 }}
          aria-label="Price comparison chart"
        >
          {/* axes */}
          <div
            className="absolute inset-0"
            style={{
              borderLeft: "1px solid var(--color-line-2)",
              borderBottom: "1px solid var(--color-line-2)",
            }}
          />

          {/* gridlines */}
          {gridTicks.map((t) => {
            const pct = toPct(t);
            return (
              <div key={`gx-${t}`}>
                <div
                  className="absolute border-l border-line"
                  style={{
                    left: `${pct}%`,
                    top: 0,
                    bottom: 0,
                  }}
                />
                <span
                  className="absolute type-mono-sm text-dim"
                  style={{
                    left: `${pct}%`,
                    bottom: -22,
                    transform: "translateX(-50%)",
                  }}
                >
                  ${t}
                </span>
                <div
                  className="absolute border-b border-line"
                  style={{
                    bottom: `${pct}%`,
                    left: 0,
                    right: 0,
                  }}
                />
                <span
                  className="absolute type-mono-sm text-dim"
                  style={{
                    bottom: `${pct}%`,
                    left: -36,
                    transform: "translateY(50%)",
                  }}
                >
                  ${t}
                </span>
              </div>
            );
          })}

          {/* axis labels */}
          <span
            className="absolute type-mono-sm"
            style={{ left: "50%", bottom: -46, transform: "translateX(-50%)" }}
          >
            Input $ / 1M tokens
          </span>
          <span
            className="absolute type-mono-sm"
            style={{
              top: "50%",
              left: -70,
              transform: "translateY(-50%) rotate(-90deg)",
              transformOrigin: "center",
              whiteSpace: "nowrap",
            }}
          >
            Output $ / 1M tokens
          </span>

          {/* dots */}
          {MODELS.map((m, i) => {
            const x = toPct(m.priceInput);
            const y = toPct(m.priceOutput);
            const isOpen = m.category === "open";
            const isHover = hovered === i;
            const delay = i * 0.06;
            return (
              <button
                key={m.name}
                type="button"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="absolute cursor-pointer focus:outline-none"
                style={{
                  left: `${x}%`,
                  bottom: `${y}%`,
                  width: 14,
                  height: 14,
                  transform: "translate(-50%, 50%)",
                  opacity: visible ? 1 : 0,
                  transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}s`,
                }}
                aria-label={`${m.name}: input ${formatUSD(m.priceInput)}, output ${formatUSD(m.priceOutput)}`}
              >
                <span
                  className="block rounded-full transition-transform"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: isOpen
                      ? "transparent"
                      : "var(--color-accent)",
                    border: isOpen
                      ? "1.5px solid var(--color-accent)"
                      : "1.5px solid var(--color-ink)",
                    boxShadow: isHover
                      ? "0 0 0 4px rgba(228,199,138,0.25)"
                      : "0 0 0 1px rgba(228,199,138,0.4)",
                    transform: isHover ? "scale(1.35)" : "scale(1)",
                  }}
                />
                <span
                  className="pointer-events-none absolute type-mono-sm whitespace-nowrap"
                  style={{
                    left: 18,
                    top: -4,
                    color: isHover
                      ? "var(--color-bone)"
                      : "var(--color-bone-3)",
                    transition: "color 200ms",
                  }}
                >
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Side panel */}
        <aside className="flex flex-col gap-4">
          <div>
            <span className="type-mono-sm">How to read this</span>
            <p className="type-body mt-2 text-[0.95rem]">
              Models lower-left are cheaper per token. Output is usually 3–10×
              the input rate, which is why almost every model lives above the
              diagonal.
            </p>
          </div>
          <div className="rule" />
          <ul className="flex flex-col gap-2 type-mono-sm">
            <li className="flex items-center gap-2">
              <span
                className="inline-block rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  background: "var(--color-accent)",
                }}
              />
              Closed-weight
            </li>
            <li className="flex items-center gap-2">
              <span
                className="inline-block rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  border: "1.5px solid var(--color-accent)",
                }}
              />
              Open-weight
            </li>
          </ul>
          {hovered !== null && (
            <div className="mt-2 border-t border-line pt-4">
              <span className="type-mono-sm text-accent">
                {MODELS[hovered].name}
              </span>
              <p className="mt-2 type-body text-[0.95rem]">
                Input {formatUSD(MODELS[hovered].priceInput)} /{" "}
                Output {formatUSD(MODELS[hovered].priceOutput)} per 1M tokens.
              </p>
              <p className="mt-2 type-mono-sm text-bone-3">
                {MODELS[hovered].blurb}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
