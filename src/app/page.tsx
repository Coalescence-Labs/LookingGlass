import { conceptsBySeries, concepts } from "@/lib/concepts";
import { ConceptCardLink } from "@/components/site/ConceptCard";
import { SplitWords } from "@/components/motion/SplitWords";
import { Reveal } from "@/components/motion/Reveal";
import { GlassLens } from "@/components/visuals/GlassLens";

export default function Home() {
  const grouped = conceptsBySeries();
  const livePublished = concepts.filter((c) => c.status === "live").length;
  let globalIndex = 0;

  return (
    <>
      <section className="relative overflow-hidden pb-28 pt-24 md:pb-40 md:pt-32">
        <GlassLens className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] opacity-90" />

        <div className="shell">
          <Reveal delay={0} y={0} duration={0.6}>
            <div className="flex items-center gap-3 type-mono-sm">
              <span className="inline-block h-px w-8 bg-line-2" />
              <span>A field guide to things worth understanding</span>
            </div>
          </Reveal>

          <h1 className="mt-10 type-display-xl text-bone">
            <SplitWords text="Making" />
            <br />
            <span className="italic text-accent">
              <SplitWords text="the invisible" delay={0.3} />
            </span>
            <br />
            <SplitWords text="legible." delay={0.55} />
          </h1>

          <Reveal delay={0.9} duration={0.8}>
            <p className="mt-10 max-w-xl type-lede">
              Looking Glass is an unhurried collection of considered explainers
              — the models that write for us, the machines that make our
              coffee, the stars we live by. One piece at a time, held up to
              the light.
            </p>
          </Reveal>

          <Reveal delay={1.1} duration={0.8}>
            <div className="mt-10 flex items-center gap-5">
              <a
                href="#index"
                className="group inline-flex items-center gap-3 border border-line-2 bg-glass px-5 py-3 font-sans text-sm text-bone transition-all hover:border-accent hover:text-accent"
              >
                <span>Begin reading</span>
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-y-[2px]"
                >
                  ↓
                </span>
              </a>
              <span className="type-mono-sm">
                {livePublished} of {concepts.length} published
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="index" className="shell pb-16 md:pb-24">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="type-mono">The archive</h2>
            <span className="type-mono-sm">April 2026</span>
          </div>
        </Reveal>

        <div className="flex flex-col gap-14 md:gap-20">
          {grouped.map(({ series, concepts: group }) => (
            <div key={series.id} className="mt-12 md:mt-16">
              <Reveal>
                <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-8">
                  <div className="flex items-baseline gap-4">
                    <span className="type-mono-sm text-accent">
                      Series {series.roman}
                    </span>
                    <h3 className="type-heading text-bone">{series.title}</h3>
                  </div>
                  <p className="type-mono-sm max-w-md md:text-right">
                    {series.blurb}
                  </p>
                </div>
              </Reveal>

              <ol className="mt-6 flex flex-col">
                {group.map((c) => {
                  const i = globalIndex++;
                  return (
                    <li key={c.slug}>
                      <ConceptCardLink concept={c} index={i} />
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}

          <Reveal>
            <div className="mt-8 border-t border-line pt-8">
              <p className="type-mono-sm text-bone-3">
                More series arrive when they&rsquo;re ready. The archive is the
                roadmap.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
