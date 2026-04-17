import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { Concept } from "@/lib/concepts";

type Props = {
  concept: Concept;
  index: number;
};

function Card({ concept, index }: Props) {
  const live = concept.status === "live";
  return (
    <Reveal delay={index * 0.08}>
      <article className="group relative flex flex-col gap-6 border-t border-line py-10 md:grid md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-12">
        <div className="flex items-baseline gap-4 md:block">
          <span className="type-numeral text-5xl text-bone-3 transition-colors group-hover:text-accent md:text-6xl">
            {concept.index}
          </span>
        </div>

        <div className="flex max-w-2xl flex-col gap-3">
          <span className="type-mono-sm">{concept.kicker}</span>
          <h2 className="type-display-m text-bone transition-colors group-hover:text-accent">
            {concept.title}
          </h2>
          <p className="type-body max-w-xl">{concept.subtitle}</p>
        </div>

        <div className="flex items-center gap-3 md:justify-self-end">
          {live ? (
            <>
              {concept.readingTime && (
                <span className="type-mono-sm">{concept.readingTime}</span>
              )}
              <span
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone-2 transition-all group-hover:border-accent group-hover:text-accent group-hover:[transform:translateX(2px)]"
              >
                →
              </span>
            </>
          ) : (
            <span className="type-mono-sm text-dim">In development</span>
          )}
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        />
      </article>
    </Reveal>
  );
}

export function ConceptCardLink(props: Props) {
  const { concept } = props;
  if (concept.status !== "live") {
    return (
      <div aria-disabled className="cursor-not-allowed opacity-80">
        <Card {...props} />
      </div>
    );
  }
  return (
    <Link href={`/${concept.slug}`} className="block">
      <Card {...props} />
    </Link>
  );
}
