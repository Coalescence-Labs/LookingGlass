"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FLOW_NODES } from "@/lib/espresso";
import { easeExpo } from "@/lib/motion";

type Geo = { x: number; y: number; w: number; h: number };

// Hand-authored schematic geometry (stylised cross-section, not to scale).
const GEO: Record<string, Geo> = {
  reservoir: { x: 20, y: 60, w: 150, h: 100 },
  pump: { x: 190, y: 60, w: 150, h: 100 },
  opv: { x: 360, y: 60, w: 140, h: 100 },
  boiler: { x: 540, y: 40, w: 300, h: 200 },
  group: { x: 560, y: 300, w: 220, h: 90 },
  puck: { x: 560, y: 410, w: 220, h: 80 },
  cup: { x: 300, y: 400, w: 180, h: 120 },
};

const W = 880;
const H = 540;

// Flow path through the components (edge to edge), for the decorative dash.
const FLOW_PATH =
  "M170,110 L190,110 M340,110 L360,110 M500,110 L540,120 M690,240 L670,300 M670,390 L670,410 M560,450 L480,455";

function cx(g: Geo) {
  return g.x + g.w / 2;
}

export function Cutaway() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(FLOW_NODES[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = FLOW_NODES.find((n) => n.id === activeId) ?? FLOW_NODES[0];
  const activeIndex = FLOW_NODES.findIndex((n) => n.id === activeId);

  function move(delta: number) {
    const next =
      (activeIndex + delta + FLOW_NODES.length) % FLOW_NODES.length;
    setActiveId(FLOW_NODES[next].id);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:gap-8">
      <div
        ref={containerRef}
        className="border border-line p-4 md:p-6"
        style={{ background: "rgba(15, 15, 18, 0.6)" }}
        onKeyDown={onKeyDown}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: "auto" }}
          role="img"
          aria-label="Cutaway schematic of an espresso machine: water travels from the reservoir through the pump and over-pressure valve, into the boiler, down through the grouphead and the coffee puck, and out into the cup."
        >
          <title>Espresso machine flow path</title>

          {/* Connectors */}
          <path
            d={FLOW_PATH}
            fill="none"
            stroke="var(--color-line-2)"
            strokeWidth={2}
          />
          {!reduce && (
            <path
              d={FLOW_PATH}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={2}
              strokeDasharray="6 18"
              opacity={0.8}
              aria-hidden="true"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="48"
                to="0"
                dur="1.6s"
                repeatCount="indefinite"
              />
            </path>
          )}

          {FLOW_NODES.map((node, i) => {
            const g = GEO[node.id];
            const selected = node.id === activeId;
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-label={`${node.label}. ${node.role}.`}
                aria-current={selected ? "true" : undefined}
                onClick={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveId(node.id);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <NodeArt id={node.id} g={g} selected={selected} />
                {/* Boundary highlight */}
                <rect
                  x={g.x}
                  y={g.y}
                  width={g.w}
                  height={g.h}
                  rx={6}
                  fill="transparent"
                  stroke={selected ? "var(--color-accent)" : "var(--color-line)"}
                  strokeWidth={selected ? 2 : 1}
                />
                <text
                  x={cx(g)}
                  y={g.y + g.h - 12}
                  textAnchor="middle"
                  fill={selected ? "var(--color-accent)" : "var(--color-bone-3)"}
                  style={{
                    fontSize: "15px",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Stepper (touch + keyboard friendly) */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => move(-1)}
            className="type-mono-sm border border-line px-4 py-2 text-bone-3 transition-colors hover:border-accent hover:text-accent"
            aria-label="Previous component"
          >
            ← Prev
          </button>
          <span className="type-mono-sm">
            {String(activeIndex + 1).padStart(2, "0")} / {String(FLOW_NODES.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => move(1)}
            className="type-mono-sm border border-line px-4 py-2 text-bone-3 transition-colors hover:border-accent hover:text-accent"
            aria-label="Next component"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Explainer */}
      <motion.div
        key={reduce ? undefined : active.id}
        initial={reduce ? false : { opacity: 0.4, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: easeExpo }}
        className="flex flex-col justify-center border border-line p-6 md:p-8"
        style={{ background: "rgba(15, 15, 18, 0.6)" }}
        aria-live="polite"
      >
        <span className="type-mono-sm text-accent">{active.role}</span>
        <h3 className="type-heading mt-2 text-bone">{active.label}</h3>
        <p className="type-body mt-4">{active.detail}</p>
      </motion.div>
    </div>
  );
}

function NodeArt({
  id,
  g,
  selected,
}: {
  id: string;
  g: Geo;
  selected: boolean;
}) {
  const stroke = selected ? "var(--color-accent)" : "var(--color-bone-3)";
  const faint = "var(--color-line-2)";
  const fill = selected ? "rgba(228,199,138,0.06)" : "transparent";

  switch (id) {
    case "reservoir":
      return (
        <g>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={6} fill={fill} />
          <rect
            x={g.x + 16}
            y={g.y + g.h * 0.45}
            width={g.w - 32}
            height={g.h * 0.4}
            fill="rgba(120,170,200,0.12)"
            stroke={faint}
          />
          <path
            d={`M${g.x + 16},${g.y + g.h * 0.45} q ${(g.w - 32) / 4},10 ${(g.w - 32) / 2},0 t ${(g.w - 32) / 2},0`}
            fill="none"
            stroke={stroke}
            strokeWidth={1.5}
          />
        </g>
      );
    case "pump":
      return (
        <g>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={6} fill={fill} />
          <circle
            cx={cx(g)}
            cy={g.y + g.h * 0.42}
            r={26}
            fill="none"
            stroke={stroke}
            strokeWidth={2}
          />
          {[0, 1, 2, 3].map((n) => (
            <line
              key={n}
              x1={cx(g) - 26}
              y1={g.y + 18 + n * 6}
              x2={cx(g) + 26}
              y2={g.y + 18 + n * 6}
              stroke={faint}
              strokeWidth={1.5}
            />
          ))}
        </g>
      );
    case "opv":
      return (
        <g>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={6} fill={fill} />
          <path
            d={`M${cx(g)},${g.y + 24} l 18,30 l -36,0 z`}
            fill="none"
            stroke={stroke}
            strokeWidth={2}
          />
          <line
            x1={cx(g)}
            y1={g.y + 54}
            x2={cx(g)}
            y2={g.y + 70}
            stroke={stroke}
            strokeWidth={2}
          />
        </g>
      );
    case "boiler":
      return (
        <g>
          <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={10} fill={fill} />
          {/* water level */}
          <line
            x1={g.x + 16}
            y1={g.y + g.h * 0.4}
            x2={g.x + g.w - 16}
            y2={g.y + g.h * 0.4}
            stroke="rgba(120,170,200,0.4)"
            strokeWidth={1.5}
          />
          {/* heating coil */}
          <path
            d={`M${g.x + 30},${g.y + g.h - 36} q 20,-26 40,0 q 20,-26 40,0 q 20,-26 40,0`}
            fill="none"
            stroke={selected ? "var(--color-accent)" : "var(--color-bone-2)"}
            strokeWidth={2.5}
          />
          {/* HX tube */}
          <line
            x1={g.x + g.w - 60}
            y1={g.y + 20}
            x2={g.x + g.w - 60}
            y2={g.y + g.h - 20}
            stroke={faint}
            strokeWidth={3}
          />
        </g>
      );
    case "group":
      return (
        <g>
          <path
            d={`M${g.x + 20},${g.y} L${g.x + g.w - 20},${g.y} L${g.x + g.w - 50},${g.y + g.h - 24} L${g.x + 50},${g.y + g.h - 24} Z`}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
          {[0, 1, 2, 3, 4].map((n) => (
            <circle
              key={n}
              cx={g.x + 60 + n * ((g.w - 120) / 4)}
              cy={g.y + g.h - 16}
              r={2.5}
              fill={faint}
            />
          ))}
        </g>
      );
    case "puck":
      return (
        <g>
          <rect
            x={g.x + 40}
            y={g.y}
            width={g.w - 80}
            height={g.h - 24}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
          {/* puck hatching */}
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <line
              key={n}
              x1={g.x + 46 + n * 18}
              y1={g.y + 6}
              x2={g.x + 40 + n * 18}
              y2={g.y + g.h - 30}
              stroke={faint}
              strokeWidth={1}
            />
          ))}
          {/* spout */}
          <line
            x1={cx(g)}
            y1={g.y + g.h - 24}
            x2={cx(g)}
            y2={g.y + g.h - 6}
            stroke={stroke}
            strokeWidth={2}
          />
        </g>
      );
    case "cup":
      return (
        <g>
          <path
            d={`M${g.x + 30},${g.y + 30} L${g.x + g.w - 30},${g.y + 30} L${g.x + g.w - 50},${g.y + g.h - 16} L${g.x + 50},${g.y + g.h - 16} Z`}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.5}
          />
          {/* crema */}
          <ellipse
            cx={cx(g)}
            cy={g.y + 30}
            rx={g.w / 2 - 30}
            ry={8}
            fill="rgba(228,199,138,0.25)"
            stroke={selected ? "var(--color-accent)" : "var(--color-bone-3)"}
            strokeWidth={1.5}
          />
          {/* handle */}
          <path
            d={`M${g.x + g.w - 50},${g.y + 44} q 34,6 24,40`}
            fill="none"
            stroke={stroke}
            strokeWidth={2}
          />
        </g>
      );
    default:
      return null;
  }
}
