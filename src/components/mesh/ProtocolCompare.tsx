import { TOPOLOGY_COMPARISON } from "@/lib/mesh";

type Diagram = { key: "centralised" | "star" | "mesh"; title: string; gloss: string };

const DIAGRAMS: Diagram[] = [
  {
    key: "centralised",
    title: "Centralised",
    gloss: "Everything routes through one point.",
  },
  {
    key: "star",
    title: "Star of hubs",
    gloss: "A few hubs, each with its own leaves.",
  },
  {
    key: "mesh",
    title: "Mesh",
    gloss: "Every node is also a relay.",
  },
];

export function ProtocolCompare() {
  return (
    <div
      className="border border-line p-6 md:p-10"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <div className="grid gap-6 sm:grid-cols-3 md:gap-8">
        {DIAGRAMS.map((d) => (
          <figure key={d.key} className="flex flex-col gap-3">
            <div className="border border-line-2" style={{ background: "rgba(9,9,11,0.55)" }}>
              <TopologyGlyph kind={d.key} />
            </div>
            <figcaption className="flex flex-col gap-1">
              <span className="type-mono-sm text-accent">{d.title}</span>
              <span className="type-mono-sm text-bone-3 normal-case tracking-normal">
                {d.gloss}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            How centralised, star, and mesh topologies compare on resilience and
            routing.
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-3 pr-4 type-mono-sm">
                Trait
              </th>
              <th scope="col" className="py-3 pr-4 type-mono-sm">
                Centralised
              </th>
              <th scope="col" className="py-3 pr-4 type-mono-sm">
                Star
              </th>
              <th scope="col" className="py-3 type-mono-sm text-accent">
                Mesh
              </th>
            </tr>
          </thead>
          <tbody>
            {TOPOLOGY_COMPARISON.map((row) => (
              <tr key={row.metric} className="border-b border-line">
                <th scope="row" className="py-4 pr-4 font-sans text-sm font-normal text-bone-2">
                  {row.metric}
                </th>
                <td className="py-4 pr-4 type-body">{row.centralised}</td>
                <td className="py-4 pr-4 type-body">{row.star}</td>
                <td className="py-4 type-body text-bone">{row.mesh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopologyGlyph({ kind }: { kind: Diagram["key"] }) {
  const line = "rgba(236,232,222,0.22)";
  const dot = "var(--color-bone-3)";
  const hub = "var(--color-accent)";
  return (
    <svg viewBox="0 0 100 80" className="block w-full" aria-hidden focusable="false">
      {kind === "centralised" && (
        <>
          {OUTER.map((p, i) => (
            <line key={i} x1={50} y1={40} x2={p[0]} y2={p[1]} stroke={line} strokeWidth={0.8} />
          ))}
          {OUTER.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={2.6} fill={dot} />
          ))}
          <circle cx={50} cy={40} r={4} fill={hub} />
        </>
      )}

      {kind === "star" && (
        <>
          {STARS.map((s, i) => (
            <g key={i}>
              {s.leaves.map((p, j) => (
                <line key={j} x1={s.hub[0]} y1={s.hub[1]} x2={p[0]} y2={p[1]} stroke={line} strokeWidth={0.8} />
              ))}
              {s.leaves.map((p, j) => (
                <circle key={j} cx={p[0]} cy={p[1]} r={2.2} fill={dot} />
              ))}
              <circle cx={s.hub[0]} cy={s.hub[1]} r={3.4} fill={hub} />
            </g>
          ))}
          <line x1={STARS[0].hub[0]} y1={STARS[0].hub[1]} x2={STARS[1].hub[0]} y2={STARS[1].hub[1]} stroke={line} strokeWidth={0.8} />
        </>
      )}

      {kind === "mesh" && (
        <>
          {MESH_EDGES.map(([i, j], k) => (
            <line key={k} x1={MESH_PTS[i][0]} y1={MESH_PTS[i][1]} x2={MESH_PTS[j][0]} y2={MESH_PTS[j][1]} stroke={line} strokeWidth={0.8} />
          ))}
          {MESH_PTS.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r={2.6} fill={i === 0 || i === MESH_PTS.length - 1 ? hub : dot} />
          ))}
        </>
      )}
    </svg>
  );
}

const OUTER: [number, number][] = [
  [50, 12],
  [82, 28],
  [82, 56],
  [50, 70],
  [18, 56],
  [18, 28],
];

const STARS = [
  {
    hub: [30, 40] as [number, number],
    leaves: [
      [12, 22],
      [12, 58],
      [30, 14],
    ] as [number, number][],
  },
  {
    hub: [70, 40] as [number, number],
    leaves: [
      [88, 22],
      [88, 58],
      [70, 66],
    ] as [number, number][],
  },
];

const MESH_PTS: [number, number][] = [
  [16, 60],
  [30, 30],
  [50, 52],
  [54, 22],
  [72, 44],
  [86, 22],
];

const MESH_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
];
