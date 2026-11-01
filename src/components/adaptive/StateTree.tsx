"use client";

import type { Scene, Transition } from "@/lib/adaptive-music";

type Props = {
  scenes: Scene[];
  transitions: Transition[];
  activeId: string;
  reducedMotion: boolean;
};

const W = 520;
const H = 150;
const PAD_X = 40;

export function StateTree({ scenes, transitions, activeId, reducedMotion }: Props) {
  const ordered = [...scenes].sort((a, b) => a.intensity - b.intensity);
  const n = ordered.length;
  const step = (W - PAD_X * 2) / (n - 1);
  const x = (i: number) => PAD_X + i * step;
  const yNode = 64;
  const active = scenes.find((s) => s.id === activeId);

  // Forward rule labels between consecutive scenes, when such a transition exists.
  const forwardRule = (fromIdx: number) => {
    const from = ordered[fromIdx]?.id;
    const to = ordered[fromIdx + 1]?.id;
    return transitions.find((t) => t.from === from && t.to === to)?.rule;
  };

  const transition = reducedMotion
    ? "none"
    : "fill 280ms cubic-bezier(0.22,1,0.36,1), r 280ms cubic-bezier(0.22,1,0.36,1)";

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={`State map. Active scene: ${active?.label ?? "explore"}.`}
        style={{ display: "block" }}
      >
        {/* Base path */}
        <line
          x1={x(0)}
          y1={yNode}
          x2={x(n - 1)}
          y2={yNode}
          stroke="var(--color-line-2)"
          strokeWidth={1}
          aria-hidden
        />

        {/* Forward arrows + rule labels */}
        {ordered.slice(0, -1).map((s, i) => {
          const rule = forwardRule(i);
          const midX = (x(i) + x(i + 1)) / 2;
          return (
            <g key={`edge-${s.id}`} aria-hidden>
              <polygon
                points={`${x(i + 1) - 16},${yNode - 3} ${x(i + 1) - 16},${yNode + 3} ${x(i + 1) - 10},${yNode}`}
                fill="var(--color-line-2)"
              />
              {rule && (
                <text
                  x={midX}
                  y={yNode - 12}
                  textAnchor="middle"
                  fill="var(--color-muted)"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 8.5,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {rule.replace("-", " ")}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {ordered.map((s, i) => {
          const isActive = s.id === activeId;
          return (
            <g key={s.id}>
              <circle
                cx={x(i)}
                cy={yNode}
                r={isActive ? 12 : 6}
                fill={isActive ? "var(--color-accent)" : "var(--color-ink-4)"}
                stroke={isActive ? "var(--color-accent)" : "var(--color-line-2)"}
                strokeWidth={1}
                style={{ transition }}
              />
              <text
                x={x(i)}
                y={yNode + 34}
                textAnchor="middle"
                fill={isActive ? "var(--color-bone)" : "var(--color-bone-3)"}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-3 type-mono-sm text-bone-3">
        Active state:{" "}
        <span className="text-accent">{active?.label ?? "Explore"}</span> —
        decided by the drivers, the way an engine reads game variables.
      </p>
    </div>
  );
}
