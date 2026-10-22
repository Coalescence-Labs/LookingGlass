// Attention worked-example data for /attention (Concept 05).
//
// The weights are *illustrative*: hand-authored matrices that depict the
// documented attention-head taxonomies from Clark et al. 2019, Voita et al.
// 2019, and Anthropic's transformer-circuits work (Elhage et al. 2021). They
// are not extracted from a specific model run — the page discloses this in
// #sources. Each row is a valid probability distribution (sums to 1), so the
// heatmap behaves exactly like real attention. No runtime inference: the data
// is precomputed in public/data/attention-weights.json and bundled here.
//
// Construction rules: research/attention-mechanism/visuals-and-data.md.

import weightsData from "../../public/data/attention-weights.json";

export type AttentionHead = {
  id: number;
  label: string;
  /** Editorial caption grounded in interpretability literature. */
  caption: string;
  /** Row-stochastic matrix: weights[from][to], each row sums to 1. */
  weights: number[][];
};

export type AttentionExample = {
  tokens: string[];
  note: string;
  heads: AttentionHead[];
};

export const ATTENTION_EXAMPLE: AttentionExample = weightsData as AttentionExample;

// Original transformer hyperparameters (Vaswani et al. 2017, §3.2.2 + Table 3).
// research/attention-mechanism/numbers-and-units.md — C-06, C-03.
export const MODEL_DIMS = {
  dModel: 512,
  heads: 8,
  dHead: 64,
  /** √d_k scaling divisor in the base model: √64 = 8. */
  scale: 8,
} as const;

/**
 * Map an attention weight in [0, 1] to a background colour on the
 * ink → accent (gold) ramp. Used by the heatmap cells.
 */
export function weightColor(w: number): string {
  const t = Math.max(0, Math.min(1, w));
  // Accent gold rgb(228,199,138) over a near-ink base; alpha tracks weight.
  const alpha = 0.06 + 0.94 * t;
  return `rgba(228, 199, 138, ${alpha.toFixed(3)})`;
}

/** Index of the strongest target in a weight row (argmax). */
export function strongestTarget(row: number[]): number {
  let mi = 0;
  for (let i = 1; i < row.length; i++) if (row[i] > row[mi]) mi = i;
  return mi;
}
