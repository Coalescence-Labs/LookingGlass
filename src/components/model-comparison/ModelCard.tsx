import {
  CAPABILITY_GLYPH,
  CAPABILITY_LABEL,
  type ModelSpec,
  formatUSD,
} from "@/lib/model-compare";
import { FAMILY_LABEL, formatTokensShort } from "@/lib/context-window";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";

type Props = {
  model: ModelSpec;
};

export function ModelCard({ model: m }: Props) {
  const openBadge =
    m.category === "open" ? "Open-weight" : "Closed-weight";

  return (
    <article
      className="group flex h-full flex-col border border-line p-6 transition-colors hover:border-line-2 md:p-7"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <header className="flex items-baseline justify-between gap-3">
        <div className="flex flex-col">
          <span className="type-mono-sm">
            {FAMILY_LABEL[m.family]} · {openBadge}
          </span>
          <h3 className="mt-2 font-serif text-[1.5rem] leading-tight text-bone md:text-[1.75rem]">
            {m.name}
          </h3>
        </div>
        <span className="type-mono-sm text-dim shrink-0">
          {m.released}
        </span>
      </header>

      <p className="type-body mt-4">{m.blurb}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5">
        <div>
          <dt className="type-mono-sm">Input</dt>
          <dd className="mt-1">
            <span className="type-numeral text-[1.6rem] text-bone">
              {formatUSD(m.priceInput)}
            </span>
            <span className="type-mono-sm"> / 1M tok</span>
          </dd>
        </div>
        <div>
          <dt className="type-mono-sm">Output</dt>
          <dd className="mt-1">
            <span className="type-numeral text-[1.6rem] text-bone">
              {formatUSD(m.priceOutput)}
            </span>
            <span className="type-mono-sm"> / 1M tok</span>
          </dd>
        </div>
        <div>
          <dt className="type-mono-sm">Context</dt>
          <dd className="mt-1">
            <span className="type-numeral text-[1.6rem] text-bone">
              {formatTokensShort(m.contextTokens)}
            </span>
            {m.contextBetaTokens && (
              <span className="type-mono-sm text-bone-3">
                {" "}
                → {formatTokensShort(m.contextBetaTokens)} beta
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="type-mono-sm">Capabilities</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {m.capabilities.map((c) => (
              <span
                key={c}
                title={CAPABILITY_LABEL[c]}
                className="inline-flex items-center gap-1 border border-line px-2 py-0.5 text-[0.7rem] text-bone-2"
              >
                <span className="text-accent">{CAPABILITY_GLYPH[c]}</span>
                <span className="font-mono uppercase tracking-[0.1em]">
                  {CAPABILITY_LABEL[c]}
                </span>
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-col gap-3 type-body">
        <p>
          <span className="type-mono-sm text-accent">Best for · </span>
          {m.bestFor}
        </p>
        <p>
          <span className="type-mono-sm text-bone-3">Watch for · </span>
          {m.watchFor}
        </p>
        {m.benchmark && (
          <p className="type-mono-sm">
            <span className="text-bone-3">Notable · </span>
            {m.benchmark}
          </p>
        )}
        {m.priceNote && (
          <p className="type-mono-sm text-dim">{m.priceNote}</p>
        )}
      </div>

      <footer className="mt-auto pt-6 flex flex-wrap gap-x-4 gap-y-1">
        {m.sources.map((s) => (
          <SourceOutboundLink
            key={s.url}
            href={s.url}
            className="type-mono-sm text-bone-3 transition-colors hover:text-accent"
          >
            {s.label} ↗
          </SourceOutboundLink>
        ))}
      </footer>
    </article>
  );
}
