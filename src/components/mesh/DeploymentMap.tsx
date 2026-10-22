"use client";

import { useState } from "react";
import { DEPLOYMENTS } from "@/lib/mesh";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";

export function DeploymentMap() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <span className="type-mono-sm">Where meshes run today</span>

      <div className="relative mt-4 border border-line-2" style={{ background: "rgba(9,9,11,0.55)" }}>
        <svg
          viewBox="0 0 100 56"
          className="block w-full"
          role="img"
          aria-label="A stylised, non-geographic world map marking four mesh-network deployments: NYC Mesh in the United States, Guifi.net in Spain, Freifunk in Germany, and Meshtastic worldwide."
        >
          {/* Abstract landmasses — decorative */}
          <g aria-hidden fill="rgba(236,232,222,0.05)" stroke="rgba(236,232,222,0.16)" strokeWidth={0.4}>
            {LANDMASSES.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>

          {/* Pins */}
          {DEPLOYMENTS.map((dep) => {
            const isActive = active === dep.name;
            return (
              <g key={dep.name}>
                <SourceOutboundLink
                  href={dep.url}
                  aria-label={`${dep.name} — ${dep.country}. ${dep.scale}. Opens project site.`}
                  onMouseEnter={() => setActive(dep.name)}
                  onMouseLeave={() => setActive((a) => (a === dep.name ? null : a))}
                  onFocus={() => setActive(dep.name)}
                  onBlur={() => setActive((a) => (a === dep.name ? null : a))}
                >
                  {/* enlarged hit area */}
                  <circle cx={dep.x} cy={dep.y} r={4} fill="transparent" />
                  <circle
                    cx={dep.x}
                    cy={dep.y}
                    r={isActive ? 2.4 : 1.8}
                    fill="var(--color-accent)"
                    stroke="var(--color-ink)"
                    strokeWidth={0.5}
                  />
                  <circle
                    cx={dep.x}
                    cy={dep.y}
                    r={isActive ? 5 : 3.4}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth={0.4}
                    opacity={isActive ? 0.8 : 0.35}
                  />
                </SourceOutboundLink>
                {isActive && (
                  <text
                    x={dep.x}
                    y={dep.y - 4}
                    textAnchor="middle"
                    fontSize={3.2}
                    fill="var(--color-bone)"
                    aria-hidden
                  >
                    {dep.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <span className="pointer-events-none absolute bottom-1 right-2 type-mono-sm text-bone-3">
          Illustrative — not to scale
        </span>
      </div>

      {/* Text list mirrors the pins for screen readers and no-JS */}
      <ul className="mt-6 grid gap-5 md:grid-cols-2 md:gap-x-10">
        {DEPLOYMENTS.map((dep) => (
          <li
            key={dep.name}
            className="flex flex-col gap-1 border-t border-line pt-4"
            onMouseEnter={() => setActive(dep.name)}
            onMouseLeave={() => setActive((a) => (a === dep.name ? null : a))}
          >
            <div className="flex items-baseline justify-between gap-3">
              <SourceOutboundLink
                href={dep.url}
                className="font-serif text-[1.1rem] text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                onFocus={() => setActive(dep.name)}
                onBlur={() => setActive((a) => (a === dep.name ? null : a))}
              >
                {dep.name}
              </SourceOutboundLink>
              <span className="type-mono-sm shrink-0">
                {dep.yearFounded ?? "—"}
              </span>
            </div>
            <span className="type-mono-sm text-bone-3 normal-case tracking-normal">
              {dep.country} · {dep.protocol}
            </span>
            <span className="type-body text-bone-3">{dep.scale}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Abstract continent blobs — viewBox 0 0 100 56. Decorative only.
const LANDMASSES: string[] = [
  // North America
  "M14 8 Q26 4 30 14 Q32 22 24 26 Q16 28 12 20 Q10 12 14 8 Z",
  // South America
  "M27 30 Q34 30 33 40 Q31 50 26 49 Q23 44 25 36 Q25 31 27 30 Z",
  // Europe
  "M45 10 Q54 8 55 15 Q54 21 48 22 Q43 20 43 15 Q43 11 45 10 Z",
  // Africa
  "M48 24 Q58 24 58 34 Q56 46 50 45 Q45 40 46 32 Q46 26 48 24 Z",
  // Asia
  "M60 8 Q82 4 86 16 Q86 26 74 28 Q63 28 60 20 Q58 12 60 8 Z",
  // Oceania
  "M80 36 Q90 34 91 42 Q90 49 83 48 Q77 46 78 40 Q78 37 80 36 Z",
];
