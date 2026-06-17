import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { Reveal } from "@/components/motion/Reveal";
import { Heatmap } from "@/components/attention/Heatmap";
import { Equation } from "@/components/attention/Equation";
import { MODEL_DIMS } from "@/lib/attention";

export const metadata: Metadata = {
  title: "How does attention actually work?",
  description:
    "Attention is the step where every word in a sentence reads every other word and keeps what's relevant. An interactive walk through queries, keys, values, the softmax, and the heads that make transformers work.",
};

export default function AttentionPage() {
  return (
    <>
      <PageHeader
        index="05"
        kicker="On attention"
        title="How does attention actually work?"
        lede="When people say a model 'attends' to a word, it sounds like a metaphor. It isn't. Attention is a precise, repeatable step: every token in a sentence quietly reads every other token, scores how much each one matters, and keeps a blend of what it found. Do that in parallel, many times over, and you have a transformer."
      />

      {/* ——— Short answer ——— */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                Attention lets each word{" "}
                <span className="italic text-accent">
                  read every other word
                </span>{" "}
                and{" "}
                <span className="italic text-accent">keep what&rsquo;s relevant</span>
                . If a{" "}
                <a
                  href="/one-million-tokens"
                  className="underline decoration-line-2 underline-offset-[6px] hover:decoration-accent"
                >
                  token is a three-quarter-word chunk
                </a>
                , attention is how the chunks compare notes.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">Three vectors per word</span>
                <p className="mt-3 type-body">
                  A <span className="text-bone">query</span> — what am I looking
                  for? A <span className="text-bone">key</span> — what do I
                  offer? A <span className="text-bone">value</span> — what I hand
                  over if I&rsquo;m chosen.
                </p>
              </div>
              <div className="rule" />
              <div>
                <span className="type-mono-sm">In the original model</span>
                <div className="mt-3">
                  <span className="type-numeral text-[3.5rem] leading-none text-bone md:text-[4.5rem]">
                    {MODEL_DIMS.heads}
                  </span>
                  <div className="type-mono">
                    heads, {MODEL_DIMS.dHead} dimensions each
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § I Query, key, value ——— */}
      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.4fr] md:gap-16">
          <Reveal>
            <h2 className="type-display-m text-bone">
              First, <span className="italic text-accent">three vectors.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-6 type-body max-w-xl">
              <p>
                Before any reading happens, each token&rsquo;s embedding is
                pushed through three learned matrices, producing three vectors: a
                query, a key, and a value. The names are worth keeping. The
                query is what a word is looking for. The key is what a word
                advertises about itself. The value is the content it will pass
                along if another word decides to listen.
              </p>
              <p>
                Picture a library where every book is also a reader. Each book
                holds up a label describing what it covers — that&rsquo;s its
                key. Each book also walks the shelves with a question in mind —
                its query. A book reads the labels, finds the ones that answer
                its question, and copies down what those books contain — their
                values. No card catalogue, no librarian; just everything
                comparing itself to everything at once.
              </p>
              <p>
                Because the queries, keys, and values all come from the same
                sentence, this is called <em>self-attention</em>: the words
                interrogate each other. The rest of the page is about how that
                comparison is scored and turned into an answer.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— § II The equation ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">The whole thing, in one line</h2>
            </div>
            <span className="type-mono-sm">For the curious</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            All of it fits in a single line of algebra. You don&rsquo;t need to
            solve it — just read it left to right, and each piece will tell you
            what it does.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <Equation />
          </div>
        </Reveal>
      </section>

      {/* ——— § III The attention matrix ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">The attention matrix</h2>
            </div>
            <span className="type-mono-sm">Interactive</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Here is one short sentence run through attention. Every row is a
            word; the colours along it show where that word looks and how
            strongly. Hover a word to light up its row — and switch heads to
            watch three different readers work the same line.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <Heatmap />
          </div>
        </Reveal>
      </section>

      {/* ——— § IV Many heads, many jobs ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">Many heads, many jobs</h2>
            </div>
            <span className="type-mono-sm">What the heads do</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Rather than run one big attention over the model&rsquo;s full width,
            a transformer splits that width into several <em>heads</em> and runs
            them in parallel. The original model used {MODEL_DIMS.heads} heads of{" "}
            {MODEL_DIMS.dHead} dimensions each — {MODEL_DIMS.heads} ×{" "}
            {MODEL_DIMS.dHead} = {MODEL_DIMS.dModel} — so the whole thing costs
            about the same as one full-width head, but each head is free to learn
            its own habit.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
            <HeadNote
              anchor="Concat, then mix"
              title="What multi-head really means"
            >
              Each head attends on its own narrow slice, the slices are
              concatenated back together, and a final projection blends them
              into one result. Eight quiet specialists, then a single answer.
            </HeadNote>
            <HeadNote
              anchor="Where vs. what"
              title="Two circuits inside every head"
            >
              Anthropic&rsquo;s interpretability work splits a head into two
              parts: a query–key circuit that decides <em>where</em> to look,
              and an output–value circuit that decides <em>what</em> to copy
              once it gets there. The two are independent — a head can change its
              aim without changing its cargo.
            </HeadNote>
            <HeadNote anchor="Heads specialise" title="Grammar, position, reference">
              Probe a trained model and the habits are legible. Some heads track
              the previous word, some link a verb to its subject or an article
              to its noun, some resolve what a pronoun points back to. Many heads
              turn out to be redundant and can be pruned; the ones that survive
              are usually the ones with a clear job.
            </HeadNote>
            <HeadNote anchor="The pattern-finishers" title="Induction heads">
              The most striking habit is the induction head. Having seen
              &ldquo;Mrs Potter&rdquo; once, it spots the next &ldquo;Mrs&rdquo;
              and bets the following word is &ldquo;Potter&rdquo; again. That
              copy-the-pattern reflex, built from a pair of heads working
              together, is now thought to do much of the heavy lifting behind
              in-context learning.
            </HeadNote>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 type-body text-bone-3 max-w-2xl">
            The three heads in the matrix above are toy versions of exactly
            this: a previous-token head, a grammar head, and a head that resolves
            &ldquo;it&rdquo; back to &ldquo;cat&rdquo;.
          </p>
        </Reveal>
      </section>

      {/* ——— § V Position and the quadratic price ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ IV</span>
              <h2 className="type-heading text-bone">
                Position, and the quadratic price
              </h2>
            </div>
            <span className="type-mono-sm">Two consequences</span>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.08}>
            <div className="flex flex-col gap-5">
              <h3 className="font-serif text-[1.5rem] leading-tight text-bone md:text-[1.75rem]">
                Attention is order-blind
              </h3>
              <p className="type-body">
                On its own, attention treats a sentence as a bag of words —
                shuffle them and the scores come out the same. So order has to be
                added by hand. The original transformer mixed in fixed
                sinusoids of different wavelengths; a learned version worked just
                about as well.
              </p>
              <p className="type-body">
                Most models today use rotary embeddings, or RoPE, which rotate
                each query and key by an angle set by its position. The neat
                trick: after the rotation, a query and key&rsquo;s dot product
                depends only on the <em>distance</em> between the two words, not
                on where they sit in the sentence.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col gap-5">
              <h3 className="font-serif text-[1.5rem] leading-tight text-bone md:text-[1.75rem]">
                Everything attends to everything
              </h3>
              <p className="type-body">
                That all-pairs comparison has a cost. The score grid holds one
                cell for every pair of tokens, so it grows with the{" "}
                <em>square</em> of the sequence length: double the words and you
                roughly quadruple the work. This is the wall behind finite{" "}
                <a
                  href="/context-window"
                  className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                >
                  context windows
                </a>
                .
              </p>
              <p className="type-body">
                Clever engineering softens it. FlashAttention computes the exact
                same result while never writing the full grid to memory, which
                cuts memory use to linear in the sequence length. It buys room,
                not a different scaling law — the square is still there.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Sources ——— */}
      <section id="sources" className="shell pb-28">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="type-mono">Sources & notes</h2>
            <span className="type-mono-sm">Verified June 2026</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h3 className="type-mono">Papers</h3>
              <ul className="mt-5 flex flex-col gap-4 type-body max-w-lg">
                <li>
                  The mechanism, the equation, multi-head attention, and the{" "}
                  {MODEL_DIMS.dModel}/{MODEL_DIMS.heads}/{MODEL_DIMS.dHead}{" "}
                  hyperparameters are all from{" "}
                  <SourceOutboundLink
                    href="https://arxiv.org/abs/1706.03762"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Vaswani et al., &ldquo;Attention Is All You Need&rdquo; (2017)
                  </SourceOutboundLink>
                  . The{" "}
                  <SourceOutboundLink
                    href="https://nlp.seas.harvard.edu/annotated-transformer/"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Annotated Transformer
                  </SourceOutboundLink>{" "}
                  reproduces the equation as runnable code.
                </li>
                <li>
                  Rotary position embedding (RoPE) is from{" "}
                  <SourceOutboundLink
                    href="https://arxiv.org/abs/2104.09864"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Su et al., &ldquo;RoFormer&rdquo; (2021)
                  </SourceOutboundLink>
                  . The linear-memory result is{" "}
                  <SourceOutboundLink
                    href="https://arxiv.org/abs/2205.14135"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Dao et al., &ldquo;FlashAttention&rdquo; (2022)
                  </SourceOutboundLink>
                  .
                </li>
                <li>
                  Head specialisation and the QK/OV split come from{" "}
                  <SourceOutboundLink
                    href="https://transformer-circuits.pub/2021/framework/"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Elhage et al., &ldquo;A Mathematical Framework for Transformer
                    Circuits&rdquo; (Anthropic, 2021)
                  </SourceOutboundLink>{" "}
                  and{" "}
                  <SourceOutboundLink
                    href="https://arxiv.org/abs/1906.04341"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Clark et al., &ldquo;What Does BERT Look At?&rdquo; (2019)
                  </SourceOutboundLink>
                  . Induction heads are detailed in{" "}
                  <SourceOutboundLink
                    href="https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Olsson et al. (2022)
                  </SourceOutboundLink>
                  .
                </li>
              </ul>
            </div>

            <div>
              <h3 className="type-mono">Notes</h3>
              <ul className="mt-5 flex flex-col gap-4 type-body max-w-lg">
                <li>
                  The weights in the interactive are <em>illustrative</em>:
                  hand-built matrices that depict the documented head types above
                  (previous-token, syntactic, coreference), not numbers pulled
                  from one specific model. Each row is a genuine probability
                  distribution that sums to one, so the heatmap behaves like real
                  attention — but treat it as a diagram, not a measurement.
                </li>
                <li>
                  The {MODEL_DIMS.dModel}-dimensional, {MODEL_DIMS.heads}-head
                  figures describe the original 2017 transformer. Modern models
                  vary widely; the shape of the mechanism is what carries over.
                </li>
                <li>
                  The example sentence and all prose here are written for Looking
                  Glass. No third-party text is embedded on this page.
                </li>
                <li>
                  The quadratic-cost discussion connects directly to{" "}
                  <a
                    href="/context-window#sources"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Concept 03
                  </a>
                  , where the same pressure sets the size of the context window.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function HeadNote({
  anchor,
  title,
  children,
}: {
  anchor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className="h-full border border-line p-6 md:p-7"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <span className="type-mono-sm text-accent">{anchor}</span>
      <h3 className="font-serif text-[1.35rem] leading-tight text-bone mt-3 md:text-[1.5rem]">
        {title}
      </h3>
      <p className="type-body mt-4">{children}</p>
    </article>
  );
}
