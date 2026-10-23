import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { Reveal } from "@/components/motion/Reveal";
import { Calculator } from "@/components/token-cost/Calculator";
import { PRICING_SNAPSHOT } from "@/lib/token-cost";

export const metadata: Metadata = {
  title: "What does a token actually cost?",
  description:
    "An interactive calculator for model pricing — input, cached input, and output — with modalities and monthly budgets for AI apps you're building.",
};

const verifiedHuman = new Date(PRICING_SNAPSHOT.verifiedDate).toLocaleDateString(
  "en-US",
  { month: "long", day: "numeric", year: "numeric" },
);

export default function TokenCostPage() {
  return (
    <>
      <PageHeader
        index="08"
        kicker="On cost"
        title="What does a token actually cost?"
        lede="A rate card tells you the price of a million tokens. It does not tell you what your app will spend. This calculator turns a request shape — text, images, audio, video, cache hits, output budget — into dollars per call and per month."
      />

      {/* ——— Short answer ——— */}
      <section className="shell pb-16 md:pb-20">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                Tokens are the bill.{" "}
                <span className="italic text-accent">Input</span>,{" "}
                <span className="italic text-accent">cache hits</span>, and{" "}
                <span className="italic text-accent">output</span> price
                differently — and modalities spend tokens before the chat even
                starts.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">Why cache matters</span>
                <p className="mt-3 type-body">
                  A stable system prompt or retrieved corpus can land at a
                  fraction of the standard input rate when the provider supports
                  prompt caching. The calculator splits text by cache-hit
                  percent.
                </p>
              </div>
              <div className="rule" />
              <div>
                <span className="type-mono-sm">Pricing snapshot</span>
                <div className="mt-3 type-mono text-bone-3">
                  Verified {verifiedHuman}
                </div>
                <p className="mt-2 text-[0.85rem] text-muted">
                  Rates are a dated snapshot, not live scrape. Refresh on the
                  same cadence as the{" "}
                  <Link
                    href="/model-comparison"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    model field guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— Calculator ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">Work the numbers</h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Start from a preset that looks like the app you are building, then
            nudge input and output until the monthly line feels honest. For a
            sense of how big a million tokens <em>is</em>, see{" "}
            <Link
              href="/one-million-tokens"
              className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
            >
              Concept 01
            </Link>
            .
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-8">
            <Calculator />
          </div>
        </Reveal>
      </section>

      {/* ——— How to budget ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">Budgets, not vibes</h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
            <div>
              <span className="type-mono-sm">Input</span>
              <p className="mt-4 type-body">
                Most apps over-spend here: fat system prompts, whole documents
                pasted every turn, retrieval that dumps more than the model can
                use. Cap what you send; measure what you actually need.
              </p>
            </div>
            <div>
              <span className="type-mono-sm">Output</span>
              <p className="mt-4 type-body">
                Output is usually the expensive side of the rate card. If your
                product wants essays when a paragraph would do, you are buying
                verbosity. Set max tokens and teach the prompt to be short.
              </p>
            </div>
            <div>
              <span className="type-mono-sm">Modalities</span>
              <p className="mt-4 type-body">
                A minute of video can cost more than a long memo. Prefer
                transcripts and keyframes when you can; treat native media as a
                deliberate choice, not a default.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— Sources ——— */}
      <section id="sources" className="shell pb-28">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="type-mono">Sources & caveats</h2>
            <span className="type-mono-sm">Verified {verifiedHuman}</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
            <div className="flex flex-col gap-5 type-body max-w-xl">
              <p>
                <span className="type-mono-sm text-bone">How to read this.</span>{" "}
                Prices are standard pay-as-you-go USD per million tokens.
                Cached-input figures are{" "}
                <em>cache hits</em> (reads), not cache writes. Batch and
                provisioned tiers are out of scope.
              </p>
              <p>
                Image, audio, and video token counts use published
                approximations (including Gemini&rsquo;s audio/video rates also
                used on{" "}
                <Link
                  href="/one-million-tokens#sources"
                  className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                >
                  Concept 01
                </Link>
                ). They will not match a provider tokenizer exactly.
              </p>
              <p className="text-bone-3">
                Grok is omitted, matching the rest of Series I. Open-weight
                rates are representative host prices where noted. Choose
                Custom in the model picker to plug in your own input, cache,
                and output rates.
              </p>
            </div>

            <div>
              <h3 className="type-mono">Per-model references</h3>
              <ul className="mt-5 flex flex-col gap-5 type-body">
                {PRICING_SNAPSHOT.models.map((m) => (
                  <li key={m.id} className="flex flex-col">
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
