import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ViewportDemo } from "@/components/context-window/ViewportDemo";
import { ModelComparisonStrip } from "@/components/context-window/ModelComparisonStrip";
import { ChatFallout } from "@/components/context-window/ChatFallout";
import { WhyItMatters } from "@/components/context-window/WhyItMatters";
import { MODELS } from "@/lib/context-window";

export const metadata: Metadata = {
  title: "What is a context window?",
  description:
    "A context window is the sliding viewport a language model reads through. What's inside it, the model sees. What falls out, it forgets. An interactive explainer.",
};

export default function ContextWindowPage() {
  return (
    <>
      <PageHeader
        index="03"
        kicker="On memory"
        title="What is a context window?"
        lede="A language model reads through a window, not a book. At any moment, only a slice of text is visible to it — everything else is either out of view ahead, or already fallen off the back. The window is the model's working memory, and its size is the single number that decides what the model can hold in mind at once."
      />

      {/* ——— Short answer ——— */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                A context window is{" "}
                <span className="italic text-accent">
                  how many tokens a model can hold in its head at once
                </span>
                . If a{" "}
                <a
                  href="/one-million-tokens"
                  className="underline decoration-line-2 underline-offset-[6px] hover:decoration-accent"
                >
                  token is a three-quarter-word chunk
                </a>
                , the window is the jar you pour them into.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">Today&rsquo;s frontier</span>
                <div className="mt-3">
                  <span className="type-numeral text-[3.5rem] leading-none text-bone md:text-[4.5rem]">
                    1–10M
                  </span>
                  <div className="type-mono">tokens, depending on the model</div>
                </div>
              </div>
              <div className="rule" />
              <div>
                <span className="type-mono-sm">In everyday terms</span>
                <p className="type-body mt-2">
                  Enough room for eight novels at the low end,{" "}
                  <span className="text-bone-3">
                    or eighty at the high one.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § I Viewport demo ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">The viewport</h2>
            </div>
            <span className="type-mono-sm">Interactive</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Below is a short essay — a little over two thousand words. Scroll
            through it. The gold band is the window. Adjust its size, and watch
            how much of the text the model can see at once.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <ViewportDemo />
          </div>
        </Reveal>
      </section>

      {/* ——— § II Model comparison ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">How the frontier compares</h2>
            </div>
            <span className="type-mono-sm">April 2026</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Windows vary by more than an order of magnitude. A hundred
            thousand tokens is already a long novel; a million is a small
            library; ten million is an entire research archive. The numbers
            below are the providers&rsquo; own published figures.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <ModelComparisonStrip />
          </div>
        </Reveal>
      </section>

      {/* ——— § III What falls out ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">What falls out</h2>
            </div>
            <span className="type-mono-sm">Simulated</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            A conversation doesn&rsquo;t persist somewhere behind the scenes.
            Every turn is re-fed into the window at each step. When the total
            overflows, the earliest messages are dropped. Walk to the end of
            this exchange and see what happens when the model is asked about
            something it can no longer see.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <ChatFallout />
          </div>
        </Reveal>
      </section>

      {/* ——— § IV Why it matters ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ IV</span>
              <h2 className="type-heading text-bone">Why it matters</h2>
            </div>
            <span className="type-mono-sm">Five short notes</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8">
            <WhyItMatters />
          </div>
        </Reveal>
      </section>

      {/* ——— Sources ——— */}
      <section id="sources" className="shell pb-28">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="type-mono">Sources & notes</h2>
            <span className="type-mono-sm">Verified April 2026</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h3 className="type-mono">Model context windows</h3>
              <ul className="mt-5 flex flex-col gap-3 type-body">
                {MODELS.map((m) => (
                  <li key={m.name} className="flex flex-col">
                    <span className="font-serif text-bone text-[1.05rem]">
                      {m.name}
                      <span className="text-bone-3">
                        {" "}
                        — {m.tokens.toLocaleString()}
                        {m.tokensBeta
                          ? ` (→ ${m.tokensBeta.toLocaleString()} beta)`
                          : ""}{" "}
                        tokens
                      </span>
                    </span>
                    <a
                      href={m.source}
                      target="_blank"
                      rel="noreferrer"
                      className="type-mono-sm text-bone-3 hover:text-accent transition-colors"
                    >
                      {new URL(m.source).hostname} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="type-mono">Methodology & references</h3>
              <ul className="mt-5 flex flex-col gap-4 type-body max-w-lg">
                <li>
                  Token-to-word and token-to-character ratios follow the same
                  conventions as{" "}
                  <a
                    href="/one-million-tokens#sources"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Concept 01
                  </a>
                  : about 0.75 English words per token and 4 characters per
                  token.
                </li>
                <li>
                  Page-count equivalents assume 275 words per paperback page,
                  the standard trade-paperback rate used throughout this site.
                </li>
                <li>
                  &ldquo;Lost in the middle&rdquo; originates in{" "}
                  <a
                    href="https://arxiv.org/abs/2307.03172"
                    target="_blank"
                    rel="noreferrer"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Liu et al., 2023 (arXiv 2307.03172)
                  </a>
                  . Subsequent long-context models have reduced but not
                  eliminated the effect.
                </li>
                <li>
                  The essay displayed in the viewport demo is original prose
                  written for Looking Glass. No third-party text is embedded
                  anywhere on this page.
                </li>
                <li>
                  Grok is deliberately omitted from the comparison. All other
                  figures come directly from each provider&rsquo;s own
                  documentation, linked above.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
