"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BOILERS } from "@/lib/espresso";
import { easeExpo } from "@/lib/motion";

export function BoilerComparison() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(BOILERS[0].id);
  const active = BOILERS.find((b) => b.id === activeId) ?? BOILERS[0];

  return (
    <div>
      <div
        className="grid gap-4 md:grid-cols-3"
        role="group"
        aria-label="Boiler architectures"
      >
        {BOILERS.map((b) => {
          const selected = b.id === activeId;
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveId(b.id)}
              className={`flex flex-col gap-4 border p-5 text-left transition-colors md:p-6 ${
                selected
                  ? "border-accent"
                  : "border-line hover:border-line-2"
              }`}
              style={{ background: "rgba(15, 15, 18, 0.6)" }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={`font-serif text-[1.35rem] tracking-[-0.02em] transition-colors md:text-[1.5rem] ${
                    selected ? "text-accent" : "text-bone"
                  }`}
                >
                  {b.name}
                </span>
              </div>
              <span className="type-body text-bone-3">{b.essence}</span>

              <dl className="mt-1 flex flex-col gap-2 border-t border-line pt-4">
                <Attr label="Brew + steam at once">
                  {b.simultaneous ? (
                    <span className="text-bone">
                      <span aria-hidden>✓</span>
                      <span className="sr-only">yes</span>
                    </span>
                  ) : (
                    <span className="text-muted">
                      <span aria-hidden>✗</span>
                      <span className="sr-only">no</span>
                    </span>
                  )}
                </Attr>
                <Attr label="Brew stability">{b.stability}</Attr>
                <Attr label="Ritual">{b.ritual}</Attr>
              </dl>
            </button>
          );
        })}
      </div>

      <motion.div
        key={reduce ? undefined : active.id}
        initial={reduce ? false : { opacity: 0.4, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: easeExpo }}
        className="mt-4 border border-line p-6 md:p-8"
        style={{ background: "rgba(15, 15, 18, 0.6)" }}
        aria-live="polite"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <span className="type-mono-sm text-accent">{active.name}</span>
          <span className="type-mono-sm">
            brew {active.brewTemp} · steam {active.steamTemp}
          </span>
        </div>
        <p className="type-body mt-4 max-w-2xl">{active.detail}</p>
      </motion.div>
    </div>
  );
}

function Attr({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="type-mono-sm">{label}</dt>
      <dd className="text-right font-sans text-sm text-bone-2">{children}</dd>
    </div>
  );
}
