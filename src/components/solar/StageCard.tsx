import type { Stage } from "@/lib/solar";
import { formatGyr, SOURCES } from "@/lib/solar";

type Props = {
  stage: Stage;
};

export function StageCard({ stage }: Props) {
  return (
    <article
      id={`stage-${stage.id}`}
      className="flex flex-col gap-6 border-t border-line pt-8 md:pt-12"
    >
      <header className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
        <div className="flex items-baseline gap-4">
          <span className="type-mono-sm text-accent">
            {String(stage.order).padStart(2, "0")}
          </span>
          <h3 className="type-heading text-bone">{stage.name}</h3>
        </div>
        <span className="type-mono-sm text-bone-3">{stage.subtitle}</span>
      </header>

      <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
        <div className="flex flex-col gap-5 type-body max-w-xl">
          <p className="type-lede">{stage.blurb}</p>
          <p>
            <span className="type-mono-sm text-bone-3">Core · </span>
            {stage.coreState}
          </p>
          <p>
            <span className="type-mono-sm text-bone-3">Surface · </span>
            {stage.surface}
          </p>
          <p className="type-mono-sm text-bone-3">{stage.analogy}</p>
        </div>

        <dl className="flex flex-col gap-4">
          <Row label="Starts at">
            {stage.isEvent
              ? `${formatGyr(stage.startGyr)} (instant)`
              : formatGyr(stage.startGyr)}
          </Row>
          <Row label="Duration">
            {stage.isEvent ? "Minutes" : formatGyr(stage.durationGyr)}
          </Row>
          <Row label="Core temp">{stage.coreTempMK} MK</Row>
          <Row label="Radius">{stage.radiusRSun} R☉</Row>
          <Row label="Luminosity">{stage.luminosityLSun} L☉</Row>
          <div className="mt-2 flex flex-col gap-1">
            <span className="type-mono-sm">Sources</span>
            <ul className="flex flex-col gap-1">
              {stage.citations.map((c, i) => {
                const src = SOURCES[c.source];
                return (
                  <li key={i} className="type-mono-sm text-bone-3">
                    {c.label}
                    {src && (
                      <>
                        {" · "}
                        <a
                          href={src.href}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-line-2 underline-offset-4 hover:decoration-accent hover:text-accent"
                        >
                          {src.label.split(",")[0]}
                        </a>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </dl>
      </div>
    </article>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line pb-2">
      <dt className="type-mono-sm">{label}</dt>
      <dd className="type-body text-right text-bone">{children}</dd>
    </div>
  );
}
