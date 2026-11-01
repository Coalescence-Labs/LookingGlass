import { Reveal } from "@/components/motion/Reveal";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";

type Card = {
  anchor: string;
  title: string;
  body: React.ReactNode;
};

const CARDS: Card[] = [
  {
    anchor: "≈ 8 novels",
    title: "Long documents fit, all at once",
    body: (
      <>
        A million-token window holds roughly eight average novels, an entire
        codebase of moderate size, or a year&rsquo;s worth of a company&rsquo;s
        email threads. The practical upshot is that you can hand the model the
        whole of a thing and ask questions about it, without first chopping it
        into pieces.
      </>
    ),
  },
  {
    anchor: "Every message counts",
    title: "Multi-turn chat lives inside the window",
    body: (
      <>
        A conversation isn&rsquo;t stored somewhere clever. Every turn you and
        the model have exchanged is re-fed into the window at each step. When
        the total outgrows the budget, the oldest turns quietly fall off the
        back — which is why long chats sometimes forget what you told them in
        the morning.
      </>
    ),
  },
  {
    anchor: "Retrieval vs. long context",
    title: "Bigger windows don’t make retrieval obsolete",
    body: (
      <>
        A long window lets you paste a whole book in. Retrieval (RAG) lets you
        search a library of ten thousand books and only hand the model the
        relevant pages. For a single document, long context wins on fidelity.
        For a corpus, retrieval usually still wins on cost, latency, and
        accuracy.
      </>
    ),
  },
  {
    anchor: "Price ≈ tokens × rate",
    title: "Cost scales with what you put in",
    body: (
      <>
        Context windows are priced per token of input. Doubling the prompt
        usually doubles the input bill, and many long-context calls quietly
        dwarf the output cost. Using the whole window is always possible, but
        it is rarely free.
      </>
    ),
  },
  {
    anchor: "Attention is not uniform",
    title: "Lost in the middle",
    body: (
      <>
        Even with room to spare, models pay closer attention to what is at the
        very start and the very end of their window than to what is in the
        middle. Buried a key fact in the centre of a 500-page document and the
        model may miss it. The effect was first named by{" "}
        <SourceOutboundLink
          href="https://arxiv.org/abs/2307.03172"
          className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
        >
          Liu et al., 2023
        </SourceOutboundLink>
        , and has since softened but not vanished in frontier models.
      </>
    ),
  },
];

export function WhyItMatters() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
      {CARDS.map((c, i) => (
        <Reveal key={c.title} delay={i * 0.08}>
          <article
            className="h-full border border-line p-6 md:p-7"
            style={{ background: "rgba(15, 15, 18, 0.6)" }}
          >
            <span className="type-mono-sm text-accent">{c.anchor}</span>
            <h3 className="font-serif text-[1.35rem] leading-tight text-bone mt-3 md:text-[1.5rem]">
              {c.title}
            </h3>
            <p className="type-body mt-4">{c.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
