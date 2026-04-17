import { concepts } from "@/lib/concepts";
import { ConceptCardLink } from "@/components/site/ConceptCard";
import { SplitWords } from "@/components/motion/SplitWords";
import { Reveal } from "@/components/motion/Reveal";
import { GlassLens } from "@/components/visuals/GlassLens";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden pb-28 pt-24 md:pb-40 md:pt-32">
        <GlassLens className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] opacity-90" />

        <div className="shell">
          <Reveal delay={0} y={0} duration={0.6}>
            <div className="flex items-center gap-3 type-mono-sm">
              <span className="inline-block h-px w-8 bg-line-2" />
              <span>Edition 01 · A field guide to modern AI</span>
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
              Looking Glass is a small, unhurried collection of visual explainers
              for the ideas that quietly shape modern AI. No jargon, no hype —
              just the thing itself, held up to the light.
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
                {concepts.filter((c) => c.status === "live").length} of{" "}
                {concepts.length} published
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="index" className="shell pb-16 md:pb-24">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="type-mono">The index</h2>
            <span className="type-mono-sm">April 2026</span>
          </div>
        </Reveal>

        <ol className="flex flex-col">
          {concepts.map((c, i) => (
            <li key={c.slug}>
              <ConceptCardLink concept={c} index={i} />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
