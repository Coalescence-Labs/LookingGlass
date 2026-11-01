import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { Reveal } from "@/components/motion/Reveal";
import { ModelCard } from "@/components/model-comparison/ModelCard";
import { PriceChart } from "@/components/model-comparison/PriceChart";
import { TaskPicker } from "@/components/model-comparison/TaskPicker";
import { MODELS, VERIFIED_DATE } from "@/lib/model-compare";

export const metadata: Metadata = {
  title: "What the latest models actually do differently",
  description:
    "A field guide to the frontier models of April 2026 — Claude, GPT, Gemini, and the leading open-weight family — compared on price, context, and what they're actually for.",
};

const closed = MODELS.filter((m) => m.category === "closed");
const open = MODELS.filter((m) => m.category === "open");

const verifiedHuman = new Date(VERIFIED_DATE).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default function ModelComparisonPage() {
  const cheapest = [...MODELS].sort((a, b) => a.priceInput - b.priceInput)[0];
  const priciest = [...MODELS].sort((a, b) => b.priceInput - a.priceInput)[0];
  const spread = priciest.priceInput / cheapest.priceInput;

  return (
    <>
      <PageHeader
        index="02"
        kicker="On models"
        title="What the latest models actually do differently"
        lede="There is no single best model. The frontier is a small cluster of overlapping tools, each tuned for a purpose. This is a field guide — what each is for, what each costs, and how to choose between them without reading a spec sheet."
      />

      {/* ——— Short answer ——— */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                The frontier{" "}
                <span className="italic text-accent">
                  is not one model, it is a shelf.
                </span>{" "}
                Six closed ones, five open ones, with a price range of roughly{" "}
                <span className="italic text-accent">
                  {spread.toFixed(0)}×
                </span>{" "}
                between the cheapest and the priciest.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">Cheapest input</span>
                <div className="mt-3">
                  <span className="type-numeral text-[3rem] leading-none text-bone md:text-[4rem]">
                    ${cheapest.priceInput.toFixed(2)}
                  </span>
                  <div className="type-mono">per 1M tokens · {cheapest.name}</div>
                </div>
              </div>
              <div className="rule" />
              <div>
                <span className="type-mono-sm">Most expensive input</span>
                <div className="mt-3">
                  <span className="type-numeral text-[3rem] leading-none text-bone md:text-[4rem]">
                    ${priciest.priceInput.toFixed(2)}
                  </span>
                  <div className="type-mono">per 1M tokens · {priciest.name}</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § I Closed-weight ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">The closed frontier</h2>
            </div>
            <span className="type-mono-sm">{closed.length} models</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Anthropic, OpenAI, and Google each ship a tiered family — a
            flagship, a balanced middle, and a small/fast tier. Prices and
            windows cluster loosely within each tier.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {closed.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <ModelCard model={m} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— § II Open-weight ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">The open-weight frontier</h2>
            </div>
            <span className="type-mono-sm">{open.length} models</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            The open side of the frontier has caught up. For most tasks, a
            self-hosted or third-party-hosted open-weight model can do the job
            at a fraction of the price — at the cost of integration work and,
            in some cases, ecosystem maturity.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {open.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <ModelCard model={m} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— § III Price map ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">The price map</h2>
            </div>
            <span className="type-mono-sm">Log scale</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Input versus output price per million tokens, plotted on a log
            scale so the sub-dollar models don&rsquo;t disappear next to the
            frontier. Hover or tap a dot for details.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <PriceChart />
          </div>
        </Reveal>
      </section>

      {/* ——— § IV Picker ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ IV</span>
              <h2 className="type-heading text-bone">
                Which one should I use?
              </h2>
            </div>
            <span className="type-mono-sm">Interactive</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Pick the shape of your task. These are opinionated starting points,
            based on the state of the frontier as of {verifiedHuman} — not
            leaderboard rankings. Always evaluate two or three on your own
            prompts before committing.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <TaskPicker />
          </div>
        </Reveal>
      </section>

      {/* ——— Caveats + Sources ——— */}
      <section id="sources" className="shell pb-28">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="type-mono">Sources, methodology & caveats</h2>
            <span className="type-mono-sm">Verified {verifiedHuman}</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
            <div className="flex flex-col gap-5 type-body max-w-xl">
              <p>
                <span className="type-mono-sm text-bone">How to read this.</span>{" "}
                Pricing covers each provider&rsquo;s standard rate for
                pay-as-you-go API use. Batch and cached-token discounts are
                deliberately not shown — they can halve the bill, but they
                don&rsquo;t change the ranking.
              </p>
              <p>
                Context-window numbers match{" "}
                <a
                  href="/context-window#sources"
                  className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                >
                  Concept 03
                </a>
                &rsquo;s figures. Capability flags are a coarse summary — all
                frontier models handle tools and JSON output; we flag them when
                the support is first-class rather than retrofitted.
              </p>
              <p>
                &ldquo;Best for&rdquo; and &ldquo;watch for&rdquo; reflect the
                published benchmark picture and real-world use patterns as of{" "}
                {verifiedHuman}. These rotate faster than any static page can
                keep up with — treat them as an orientation, not a verdict.
              </p>
              <p className="text-bone-3">
                Grok is deliberately omitted from this comparison. Everything
                else the major providers ship is on this page.
              </p>
            </div>

            <div>
              <h3 className="type-mono">Per-model references</h3>
              <ul className="mt-5 flex flex-col gap-5 type-body">
                {MODELS.map((m) => (
                  <li key={m.name} className="flex flex-col">
                    <span className="font-serif text-bone text-[1.05rem]">
                      {m.name}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      {m.sources.map((s) => (
                        <SourceOutboundLink
                          key={s.url}
                          href={s.url}
                          className="type-mono-sm text-bone-3 hover:text-accent transition-colors"
                        >
                          {s.label} ↗
                        </SourceOutboundLink>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
