"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";
import {
  MESH_TOPOLOGY,
  route,
  CLIENT_ID,
  GATEWAY_ID,
  type MeshNode,
} from "@/lib/mesh";

export function TopologyDemo() {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState<Set<string>>(() => new Set());

  const result = useMemo(() => route(MESH_TOPOLOGY, failed), [failed]);
  const pathSet = useMemo(() => {
    const s = new Set<string>();
    for (let i = 0; i < result.path.length - 1; i++) {
      s.add(edgeKey(result.path[i], result.path[i + 1]));
    }
    return s;
  }, [result]);
  const pathNodes = useMemo(() => new Set(result.path), [result]);

  const nodeById = useMemo(
    () => new Map(MESH_TOPOLOGY.nodes.map((n) => [n.id, n] as const)),
    [],
  );

  function toggle(id: string) {
    if (id === CLIENT_ID || id === GATEWAY_ID) return;
    setFailed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onKey(e: KeyboardEvent, id: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(id);
    }
  }

  const transition = reduce ? "none" : "opacity 240ms ease, stroke 240ms ease";

  return (
    <div
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="type-mono-sm">Interactive · multi-hop routing</span>
        <button
          type="button"
          onClick={() => setFailed(new Set())}
          className="type-mono-sm text-bone-3 transition-colors hover:text-accent disabled:opacity-40"
          disabled={failed.size === 0}
        >
          Reset ↺
        </button>
      </div>

      <div className="relative mt-5 border border-line-2" style={{ background: "rgba(9,9,11,0.55)" }}>
        <svg
          viewBox="0 0 100 72"
          className="block w-full"
          role="img"
          aria-label="Mesh topology. The client sits at the lower left, the gateway at the upper right. Tap any relay node to fail it and watch the route recompute."
        >
          {/* Links */}
          {MESH_TOPOLOGY.links.map((l) => {
            const a = nodeById.get(l.a)!;
            const b = nodeById.get(l.b)!;
            const dead = failed.has(l.a) || failed.has(l.b);
            const onPath = pathSet.has(edgeKey(l.a, l.b));
            return (
              <line
                key={`${l.a}-${l.b}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={
                  onPath
                    ? "var(--color-accent)"
                    : dead
                      ? "transparent"
                      : "rgba(236,232,222,0.12)"
                }
                strokeWidth={onPath ? 0.9 : 0.4}
                style={{ transition }}
              />
            );
          })}

          {/* Nodes */}
          {MESH_TOPOLOGY.nodes.map((n) => (
            <NodeMark
              key={n.id}
              node={n}
              failed={failed.has(n.id)}
              onPath={pathNodes.has(n.id)}
              fixed={n.id === CLIENT_ID || n.id === GATEWAY_ID}
              onToggle={() => toggle(n.id)}
              onKey={(e) => onKey(e, n.id)}
              transition={transition}
            />
          ))}
        </svg>

        {/* Endpoint captions */}
        <span className="pointer-events-none absolute bottom-1 left-2 type-mono-sm text-accent">
          Client
        </span>
        <span className="pointer-events-none absolute right-2 top-1 type-mono-sm text-accent">
          Gateway
        </span>
      </div>

      {/* Readout */}
      <div
        className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-3"
        aria-live="polite"
      >
        <div className="flex items-baseline gap-3">
          <span className="type-mono-sm shrink-0">Route</span>
          {result.reachable ? (
            <span className="font-sans text-sm text-bone-2">
              <span aria-hidden>● </span>
              Reachable
            </span>
          ) : (
            <span className="font-sans text-sm text-bone">
              <span aria-hidden>✕ </span>
              Unreachable — the gateway is cut off
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-3">
          <span className="type-mono-sm shrink-0">Hops</span>
          <span className="type-numeral text-[1.6rem] text-bone">
            {result.reachable ? result.hops : "—"}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="type-mono-sm shrink-0">Failed nodes</span>
          <span className="type-numeral text-[1.6rem] text-bone">
            {failed.size}
          </span>
        </div>
      </div>

      <p className="mt-5 type-mono-sm text-bone-3 max-w-2xl">
        Tap a relay to take it offline. The gold line is the shortest surviving
        path from client to gateway. Cut the right relays and the path reroutes;
        cut enough and it fails outright.
      </p>
    </div>
  );
}

function NodeMark({
  node,
  failed,
  onPath,
  fixed,
  onToggle,
  onKey,
  transition,
}: {
  node: MeshNode;
  failed: boolean;
  onPath: boolean;
  fixed: boolean;
  onToggle: () => void;
  onKey: (e: KeyboardEvent) => void;
  transition: string;
}) {
  const r = fixed ? 2.4 : 1.8;
  const fill = failed
    ? "transparent"
    : onPath || fixed
      ? "var(--color-accent)"
      : "var(--color-bone-3)";
  const stroke = failed ? "var(--color-muted)" : "var(--color-ink)";
  const stateWord = fixed
    ? node.role === "client"
      ? "client"
      : "gateway"
    : failed
      ? "failed — activate to restore"
      : "active — activate to fail";

  return (
    <g
      role={fixed ? "img" : "button"}
      aria-label={`${node.role ?? "Relay"} node ${node.id}, ${stateWord}`}
      aria-pressed={fixed ? undefined : failed}
      tabIndex={fixed ? -1 : 0}
      onClick={fixed ? undefined : onToggle}
      onKeyDown={fixed ? undefined : onKey}
      style={{ cursor: fixed ? "default" : "pointer", outline: "none" }}
      className="mesh-node"
    >
      {/* Enlarged invisible hit area for touch */}
      <circle cx={node.x} cy={node.y} r={4.5} fill="transparent" />
      <circle
        cx={node.x}
        cy={node.y}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.5}
        style={{ transition }}
      />
      {failed && (
        <text
          x={node.x}
          y={node.y + 0.9}
          textAnchor="middle"
          fontSize={3}
          fill="var(--color-muted)"
          aria-hidden
        >
          ✕
        </text>
      )}
      <style jsx>{`
        .mesh-node:focus-visible circle:nth-child(2) {
          stroke: var(--color-accent);
          stroke-width: 1;
        }
      `}</style>
    </g>
  );
}

function edgeKey(a: string, b: string) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}
