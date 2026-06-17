// Mesh-network data layer for /mesh-networks.
// All page-worthy numbers trace to research/mesh-networks/numbers-and-units.md.
// The topology is generated deterministically (seeded) so server and client
// renders agree without any runtime randomness.

export type MeshNode = {
  id: string;
  x: number;
  y: number;
  role?: "client" | "gateway";
};

export type MeshLink = { a: string; b: string };

export type MeshTopology = { nodes: MeshNode[]; links: MeshLink[] };

// ——— Deterministic topology ———

// mulberry32 — tiny seeded PRNG, identical output on server and client.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLS = 6;
const ROWS = 6;
const VIEW_W = 100;
const VIEW_H = 72;
// Nodes are placed on a jittered grid; links connect nodes within LINK_RADIUS.
const LINK_RADIUS = 23;

function buildTopology(seed: number): MeshTopology {
  const rand = mulberry32(seed);
  const nodes: MeshNode[] = [];
  const marginX = VIEW_W / (COLS + 1);
  const marginY = VIEW_H / (ROWS + 1);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const jitterX = (rand() - 0.5) * marginX * 0.7;
      const jitterY = (rand() - 0.5) * marginY * 0.7;
      const x = marginX * (c + 1) + jitterX;
      const y = marginY * (r + 1) + jitterY;
      nodes.push({ id: `n${r}-${c}`, x: round(x), y: round(y) });
    }
  }

  // Client lower-left, gateway upper-right (y grows downward in SVG space).
  const client = nodes.find((n) => n.id === `n${ROWS - 1}-0`)!;
  const gateway = nodes.find((n) => n.id === `n0-${COLS - 1}`)!;
  client.role = "client";
  gateway.role = "gateway";

  const links: MeshLink[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (dist(nodes[i], nodes[j]) <= LINK_RADIUS) {
        links.push({ a: nodes[i].id, b: nodes[j].id });
      }
    }
  }

  return { nodes, links };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Seed chosen for a topology that is well-connected but has rerouting interest.
export const MESH_TOPOLOGY: MeshTopology = buildTopology(20260617);

export const CLIENT_ID = MESH_TOPOLOGY.nodes.find((n) => n.role === "client")!.id;
export const GATEWAY_ID = MESH_TOPOLOGY.nodes.find((n) => n.role === "gateway")!.id;

// ——— Routing: Dijkstra over the active links ———

export type RouteResult = {
  path: string[];
  hops: number;
  reachable: boolean;
};

export function route(
  topology: MeshTopology,
  failed: ReadonlySet<string>,
): RouteResult {
  const source = CLIENT_ID;
  const target = GATEWAY_ID;

  if (failed.has(source) || failed.has(target)) {
    return { path: [], hops: 0, reachable: false };
  }

  const pos = new Map(topology.nodes.map((n) => [n.id, n] as const));
  const adj = new Map<string, { id: string; w: number }[]>();
  for (const n of topology.nodes) {
    if (!failed.has(n.id)) adj.set(n.id, []);
  }
  for (const l of topology.links) {
    if (failed.has(l.a) || failed.has(l.b)) continue;
    const w = dist(pos.get(l.a)!, pos.get(l.b)!);
    adj.get(l.a)!.push({ id: l.b, w });
    adj.get(l.b)!.push({ id: l.a, w });
  }

  // Dijkstra with a simple linear-scan frontier (graph is tiny).
  const distTo = new Map<string, number>();
  const prev = new Map<string, string>();
  const visited = new Set<string>();
  for (const id of adj.keys()) distTo.set(id, Infinity);
  distTo.set(source, 0);

  while (true) {
    let u: string | null = null;
    let best = Infinity;
    for (const [id, d] of distTo) {
      if (!visited.has(id) && d < best) {
        best = d;
        u = id;
      }
    }
    if (u === null || u === target) break;
    visited.add(u);
    for (const edge of adj.get(u) ?? []) {
      if (visited.has(edge.id)) continue;
      const nd = best + edge.w;
      if (nd < (distTo.get(edge.id) ?? Infinity)) {
        distTo.set(edge.id, nd);
        prev.set(edge.id, u);
      }
    }
  }

  if ((distTo.get(target) ?? Infinity) === Infinity) {
    return { path: [], hops: 0, reachable: false };
  }

  const path: string[] = [];
  let cur: string | undefined = target;
  while (cur !== undefined) {
    path.unshift(cur);
    cur = prev.get(cur);
  }
  return { path, hops: path.length - 1, reachable: true };
}

// ——— Physical-layer trade (chunk 01: C-01..C-05) ———

export type PhyRow = {
  name: string;
  rate: string;
  range: string;
  buys: string;
  pays: string;
};

export const PHY_LAYERS: PhyRow[] = [
  {
    name: "LoRa",
    rate: "0.3–50 kbps",
    range: "≈ 15 km line-of-sight",
    buys: "range",
    pays: "bandwidth",
  },
  {
    name: "802.15.4",
    rate: "250 kbit/s",
    range: "≈ 10–100 m",
    buys: "battery life",
    pays: "range",
  },
  {
    name: "Wi-Fi mesh",
    rate: "tens–hundreds Mbps",
    range: "rooftop line-of-sight",
    buys: "throughput",
    pays: "reach & power",
  },
];

// ——— Topology comparison (chunk 02: C-10..C-13) ———

export type CompareRow = {
  metric: string;
  centralised: string;
  star: string;
  mesh: string;
};

export const TOPOLOGY_COMPARISON: CompareRow[] = [
  {
    metric: "Single point of failure",
    centralised: "The centre",
    star: "Each hub",
    mesh: "None inherent",
  },
  {
    metric: "Path diversity",
    centralised: "One",
    star: "Few",
    mesh: "Many",
  },
  {
    metric: "Adding a node",
    centralised: "Provision at centre",
    star: "Attach to a hub",
    mesh: "Just join",
  },
  {
    metric: "Partition tolerance",
    centralised: "Poor",
    star: "Limited",
    mesh: "Degrades gracefully",
  },
];

// ——— Real deployments (chunk 04: C-30..C-33) ———

export type Deployment = {
  name: string;
  country: string;
  scale: string;
  protocol: string;
  yearFounded: number | null;
  url: string;
  // Illustrative SVG coords (viewBox 0 0 100 56) on a stylised world
  // projection — not geodetic.
  x: number;
  y: number;
};

export const DEPLOYMENTS: Deployment[] = [
  {
    name: "NYC Mesh",
    country: "New York, USA",
    scale: "≈ 70 hubs into data-centre supernodes",
    protocol: "Wi-Fi (OSPF + BGP)",
    yearFounded: 2014,
    url: "https://www.nycmesh.net/",
    x: 24,
    y: 20,
  },
  {
    name: "Guifi.net",
    country: "Catalonia, Spain",
    scale: "≈ 37,600 working nodes · ≈ 73,000 km of links",
    protocol: "Wi-Fi + fibre",
    yearFounded: 2004,
    url: "https://guifi.net/",
    x: 46,
    y: 21,
  },
  {
    name: "Freifunk",
    country: "Germany",
    scale: "Federation of community networks",
    protocol: "B.A.T.M.A.N.-adv",
    yearFounded: 2002,
    url: "https://freifunk.net/",
    x: 50,
    y: 15,
  },
  {
    name: "Meshtastic",
    country: "Global / distributed",
    scale: "Hobbyist LoRa mesh, no internet required",
    protocol: "LoRa (managed flooding)",
    yearFounded: 2020,
    url: "https://meshtastic.org/",
    x: 80,
    y: 30,
  },
];
