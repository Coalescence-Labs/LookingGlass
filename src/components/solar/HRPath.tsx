"use client";

import { useMemo } from "react";
import { HR_PATH, HR_RANGE, type StageId } from "@/lib/solar";

type Props = {
  activeStageId?: StageId;
};

const WIDTH = 640;
const HEIGHT = 420;
const PAD_L = 52;
const PAD_R = 24;
const PAD_T = 24;
const PAD_B = 40;

const logT = (k: number) => Math.log10(k);
const logL = (l: number) => Math.log10(l);

const T_MIN = logT(HR_RANGE.tempK.min);
const T_MAX = logT(HR_RANGE.tempK.max);
const L_MIN = logL(HR_RANGE.lumLSun.min);
const L_MAX = logL(HR_RANGE.lumLSun.max);

function xFor(tempK: number) {
  const t = (logT(tempK) - T_MIN) / (T_MAX - T_MIN);
  return PAD_L + (1 - t) * (WIDTH - PAD_L - PAD_R);
}
function yFor(lumLSun: number) {
  const l = (logL(lumLSun) - L_MIN) / (L_MAX - L_MIN);
  return PAD_T + (1 - l) * (HEIGHT - PAD_T - PAD_B);
}

const T_TICKS = [3000, 5000, 10000, 30000, 100000];
const L_TICKS = [0.0001, 0.01, 1, 100, 3000];

function formatL(l: number) {
  if (l >= 100) return `${l}`;
  if (l >= 1) return `${l}`;
  if (l >= 0.01) return `${l}`;
  return `10${exp(Math.log10(l))}`;
}
function exp(n: number) {
  const rounded = Math.round(n);
  const map: Record<string, string> = {
    "-4": "⁻⁴",
    "-3": "⁻³",
    "-2": "⁻²",
    "-1": "⁻¹",
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
  };
  return map[String(rounded)] ?? String(rounded);
}

export function HRPath({ activeStageId }: Props) {
  const pathD = useMemo(() => {
    return HR_PATH.map((p, i) => {
      const x = xFor(p.tempK);
      const y = yFor(p.lumLSun);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }, []);

  const activePoint = useMemo(() => {
    if (!activeStageId) return null;
    const p = HR_PATH.find((p) => p.stageId === activeStageId);
    if (!p) return null;
    return { x: xFor(p.tempK), y: yFor(p.lumLSun), label: p.label ?? "" };
  }, [activeStageId]);

  const nowPoint = useMemo(() => {
    const p = HR_PATH.find((p) => p.label === "Now");
    if (!p) return null;
    return { x: xFor(p.tempK), y: yFor(p.lumLSun) };
  }, []);

  return (
    <figure className="flex flex-col gap-4">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height="auto"
        className="block"
        role="img"
        aria-label="Hertzsprung–Russell diagram tracing the sun's evolutionary path from pre-main-sequence through main sequence, red giant branch, horizontal branch, asymptotic giant branch, planetary nebula, and white dwarf."
      >
        <rect
          x={PAD_L}
          y={PAD_T}
          width={WIDTH - PAD_L - PAD_R}
          height={HEIGHT - PAD_T - PAD_B}
          fill="rgba(15,15,18,0.5)"
          stroke="var(--color-line)"
        />

        {L_TICKS.map((l) => {
          const y = yFor(l);
          return (
            <g key={`l-${l}`}>
              <line
                x1={PAD_L}
                y1={y}
                x2={WIDTH - PAD_R}
                y2={y}
                stroke="var(--color-line)"
                strokeDasharray="2 4"
              />
              <text
                x={PAD_L - 8}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--color-muted)"
                letterSpacing="0.14em"
              >
                {formatL(l)}
              </text>
            </g>
          );
        })}

        {T_TICKS.map((t) => {
          const x = xFor(t);
          return (
            <g key={`t-${t}`}>
              <line
                x1={x}
                y1={PAD_T}
                x2={x}
                y2={HEIGHT - PAD_B}
                stroke="var(--color-line)"
                strokeDasharray="2 4"
              />
              <text
                x={x}
                y={HEIGHT - PAD_B + 14}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--color-muted)"
                letterSpacing="0.14em"
              >
                {t >= 1000 ? `${t / 1000}k` : t}
              </text>
            </g>
          );
        })}

        <text
          x={PAD_L - 40}
          y={(PAD_T + HEIGHT - PAD_B) / 2}
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-mono)"
          fill="var(--color-bone-3)"
          letterSpacing="0.18em"
          transform={`rotate(-90 ${PAD_L - 40} ${(PAD_T + HEIGHT - PAD_B) / 2})`}
        >
          L / L☉
        </text>
        <text
          x={(PAD_L + WIDTH - PAD_R) / 2}
          y={HEIGHT - 6}
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-mono)"
          fill="var(--color-bone-3)"
          letterSpacing="0.18em"
        >
          ← hotter · T_eff / K · cooler →
        </text>

        <path
          d={pathD}
          fill="none"
          stroke="var(--color-bone-3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />

        {HR_PATH.filter((p) => p.label).map((p) => (
          <g key={`${p.stageId}-${p.label}`}>
            <circle
              cx={xFor(p.tempK)}
              cy={yFor(p.lumLSun)}
              r="2.5"
              fill="var(--color-bone-3)"
            />
            <text
              x={xFor(p.tempK) + 6}
              y={yFor(p.lumLSun) - 6}
              fontSize="10"
              fontFamily="var(--font-mono)"
              fill="var(--color-bone-3)"
              letterSpacing="0.14em"
            >
              {p.label}
            </text>
          </g>
        ))}

        {nowPoint && (
          <circle
            cx={nowPoint.x}
            cy={nowPoint.y}
            r="6"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1"
            opacity="0.55"
          />
        )}

        {activePoint && (
          <g
            style={{
              transition: "transform 600ms var(--ease-expo)",
            }}
          >
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="14"
              fill="rgba(228,199,138,0.1)"
              stroke="var(--color-accent)"
              strokeWidth="1"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="5"
              fill="var(--color-accent)"
            />
          </g>
        )}
      </svg>

      <figcaption className="type-mono-sm text-bone-3 max-w-xl">
        Hot on the left, cool on the right; bright at the top, dim at the bottom
        — the convention astronomers have used since Hertzsprung and Russell
        independently drew the first version in 1911. The sun&rsquo;s path is
        the simplified trace of a single solar mass from contraction to cold
        white dwarf.
      </figcaption>
    </figure>
  );
}
