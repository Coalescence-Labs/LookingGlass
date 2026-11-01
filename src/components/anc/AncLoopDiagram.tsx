import { LOOP_BLOCKS } from "@/lib/anc";

export function AncLoopDiagram() {
  return (
    <div
      className="border border-line p-6 md:p-10"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
      role="img"
      aria-label="Block diagram of hybrid active noise cancellation: outside feedforward mic, inside feedback mic, DSP, driver, and ear."
    >
      <div className="grid gap-4 md:grid-cols-4">
        {LOOP_BLOCKS.map((b) => (
          <div
            key={b.id}
            className="flex flex-col border border-line-2 p-4"
          >
            <span className="type-mono-sm text-accent">{b.role}</span>
            <span className="mt-2 type-heading text-bone">{b.title}</span>
            <p className="mt-3 type-body text-bone-2">{b.blurb}</p>
            <span className="mt-auto pt-4 type-mono-sm text-bone-3">
              {b.claim}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <p className="type-body max-w-2xl text-bone-2">
          Outside and inside mics feed the same driver. At the ear, noise and
          anti-noise meet. Path delay through air and DSP is why the loop cannot
          chase every frequency — the latency callout lives here, between sensing
          and playback.
        </p>
        <div className="shrink-0 border border-accent/40 bg-accent-soft px-4 py-3 type-mono-sm text-bone">
          Latency budget
          <div className="mt-1 text-bone-3">acoustic path + DSP ≪ period</div>
        </div>
      </div>
    </div>
  );
}
