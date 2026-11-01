import { MODEL_DIMS } from "@/lib/attention";

const PIECES: { glyph: string; gloss: string }[] = [
  {
    glyph: "QKᵀ",
    gloss:
      "Every query, dotted with every key — a grid of raw match scores, one for each pair of words.",
  },
  {
    glyph: "÷ \u221Ad\u2096",
    gloss: `Shrink those scores so the softmax keeps learning. In the original model \u221Ad\u2096 is ${MODEL_DIMS.scale}.`,
  },
  {
    glyph: "softmax",
    gloss: "Turn each row of scores into weights that are positive and sum to one.",
  },
  {
    glyph: "\u00D7 V",
    gloss: "Use those weights to blend the value vectors into the word's new meaning.",
  },
];

const SPOKEN =
  "Attention of Q, K and V equals softmax of Q times K transpose, divided by the square root of d sub k, times V.";

export function Equation() {
  return (
    <div
      className="border border-line p-6 md:p-10"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <p className="sr-only">{SPOKEN}</p>
      <div
        aria-hidden
        className="type-display-m text-bone text-center leading-tight"
      >
        Attention(Q, K, V) ={" "}
        <span className="text-accent">softmax</span>
        <span className="text-bone-3">(</span>
        <span className="italic">QK</span>
        <sup>T</sup>
        <span className="text-bone-3"> / </span>
        <span aria-hidden>&#8730;</span>
        <span className="italic">
          d<sub>k</sub>
        </span>
        <span className="text-bone-3">)</span>
        <span className="italic"> V</span>
      </div>

      <ul className="mt-8 flex flex-col">
        {PIECES.map((p) => (
          <li
            key={p.glyph}
            className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-t border-line py-4 md:grid-cols-[7rem_1fr] md:gap-6"
          >
            <span className="font-serif text-[1.35rem] text-bone md:text-[1.6rem]">
              {p.glyph}
            </span>
            <span className="type-body">{p.gloss}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
