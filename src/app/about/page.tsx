import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { SubmissionForm } from "@/components/about/SubmissionForm";
import { SERIES, concepts } from "@/lib/concepts";

export const metadata: Metadata = {
  title: "About",
  description:
    "Looking Glass is a field guide to things worth understanding — the models that write for us, the machines that make our coffee, the stars we live by. A project by Coalescence Labs.",
};

export default function AboutPage() {
  const livePublished = concepts.filter((c) => c.status === "live").length;

  return (
    <>
      <PageHeader
        kicker="Colophon"
        title="About Looking Glass"
        lede="A field guide to things worth understanding. We take one idea at a time — a token, a context window, the life of a star, the hiss of an espresso wand — and try to make it legible without pretending anyone needs to be an engineer to follow along."
      />

      {/* ——— § I — What this is ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">What this is</h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <div className="flex flex-col gap-6 type-body max-w-xl">
              <p>
                Looking Glass is a small, editorial site of considered
                explainers — pieces about the mechanisms and systems most
                people live alongside without ever looking inside. The first
                series is about modern AI: what a token is, what a context
                window does, how the frontier models actually differ. The
                archive will wander from there — into physics, mechanical
                engineering, adaptive software, anything whose working parts
                reward a closer look.
              </p>
              <p>
                It is not a newsletter, a benchmark tracker, or a tutorial.
                It&rsquo;s a reading room. Each piece is researched from
                primary sources, written in long form, and paired with a
                visual that does work the prose can&rsquo;t. Every claim is
                cited. Nothing is scraped or re-heated from someone
                else&rsquo;s copy.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <span className="type-mono-sm">Currently published</span>
                <div className="mt-3">
                  <span className="type-numeral text-[3.25rem] leading-none text-bone md:text-[4rem]">
                    {String(livePublished).padStart(2, "0")}
                  </span>
                  <div className="type-mono">
                    pieces across {SERIES.length} series
                  </div>
                </div>
              </div>
              <div className="rule" />
              <p className="type-mono-sm text-bone-3 max-w-sm">
                Borrowed from the long magazine piece and the well-made
                diagram. Slow by design.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § II — The studio ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">The studio</h2>
            </div>
            <a
              href="https://coalescencelabs.app"
              target="_blank"
              rel="noreferrer"
              className="type-mono-sm text-bone-3 hover:text-accent transition-colors"
            >
              coalescencelabs.app ↗
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
            <div className="flex flex-col gap-6 type-body max-w-xl">
              <p>
                Looking Glass is made by{" "}
                <a
                  href="https://coalescencelabs.app"
                  target="_blank"
                  rel="noreferrer"
                  className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent transition-colors"
                >
                  Coalescence Labs
                </a>
                , a small studio interested in the space where careful
                writing, working code, and considered design overlap. We
                build the kind of things we&rsquo;d want to read — or use —
                ourselves.
              </p>
              <p>
                Our working principles are simple. Cite the primary source,
                always. Write our own prose. Ship a piece when it&rsquo;s
                ready, not when a calendar says so. Treat the reader as an
                adult with a little time and a lot of curiosity.
              </p>
              <p>
                <span className="type-mono-sm text-bone-3">Privacy · </span>
                We use Vercel Web Analytics for anonymized page views — no
                analytics cookies, no ad pixels, nothing that follows you
                across the web. We also log two coarse signals: when someone
                successfully sends the idea form, and when a reader opens an
                external citation from a piece (only the destination hostname,
                never query strings or page titles). If your browser sends{" "}
                <em>Do Not Track</em> or{" "}
                <em>Global Privacy Control</em> (the Sec-GPC header), we skip
                those tallies for your visit.
              </p>
              <p>
                If any of that resonates, we&rsquo;d love to hear from you —
                about a piece you&rsquo;d like us to write, a detail we got
                wrong, or work you think we might be useful for.
              </p>
            </div>

            <aside className="flex flex-col gap-4 border border-line p-6 md:p-8"
              style={{ background: "rgba(15, 15, 18, 0.6)" }}
            >
              <span className="type-mono-sm">House rules</span>
              <ul className="flex flex-col gap-3 type-body text-[0.95rem]">
                <li className="flex gap-3">
                  <span className="type-mono-sm mt-1 text-accent">01</span>
                  <span>Primary sources or nothing.</span>
                </li>
                <li className="flex gap-3">
                  <span className="type-mono-sm mt-1 text-accent">02</span>
                  <span>Original writing, first-party diagrams.</span>
                </li>
                <li className="flex gap-3">
                  <span className="type-mono-sm mt-1 text-accent">03</span>
                  <span>Ship when ready, not on a schedule.</span>
                </li>
                <li className="flex gap-3">
                  <span className="type-mono-sm mt-1 text-accent">04</span>
                  <span>Clarity over cleverness.</span>
                </li>
              </ul>
            </aside>
          </div>
        </Reveal>
      </section>

      {/* ——— § III — How to follow along ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">How to follow along</h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <div className="flex flex-col gap-6 type-body max-w-xl">
              <p>
                The archive is grouped into <em>series</em> — clusters of
                concepts that share a subject. The first series, <em>On
                language models</em>, collects the AI pieces. Each new series
                will open its own room.
              </p>
              <p>
                New pieces land when they&rsquo;re ready. There&rsquo;s no
                cadence to commit to, no newsletter sign-up nagging you in
                the corner. The{" "}
                <Link
                  href="/"
                  className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent transition-colors"
                >
                  index
                </Link>{" "}
                is the roadmap. Bookmark it; come back when you have time to
                read.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {SERIES.map((s) => {
                const count = concepts.filter(
                  (c) => c.seriesId === s.id && c.status === "live",
                ).length;
                return (
                  <div key={s.id} className="border-t border-line pt-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="type-mono-sm text-accent">
                        Series {s.roman}
                      </span>
                      <span className="type-mono-sm text-bone-3">
                        {count} live
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-[1.25rem] leading-tight text-bone">
                      {s.title}
                    </h3>
                    <p className="mt-1 type-mono-sm text-bone-3">{s.blurb}</p>
                  </div>
                );
              })}
              <div className="border-t border-line pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="type-mono-sm text-dim">Series III+</span>
                  <span className="type-mono-sm text-dim">In the kiln</span>
                </div>
                <p className="mt-2 type-mono-sm text-bone-3">
                  New rooms open when they&rsquo;re ready.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § IV — Submit an idea ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ IV</span>
              <h2 className="type-heading text-bone">Submit an idea</h2>
            </div>
            <span className="type-mono-sm">Open invitation</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            The best Looking Glass pieces tend to start with someone
            else&rsquo;s curiosity. If there&rsquo;s a mechanism, a system,
            or a phenomenon you&rsquo;ve always wondered about — tell us.
            We&rsquo;re after the idea, not a pitch.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <SubmissionForm />
          </div>
        </Reveal>
      </section>

      {/* ——— Contact + colophon ——— */}
      <section className="shell pb-28">
        <Reveal>
          <div className="flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-baseline md:justify-between">
            <div className="flex flex-col gap-2">
              <span className="type-mono-sm">Direct line</span>
              <p className="type-body">
                Questions, corrections, or commissions →{" "}
                <a
                  href="mailto:coalescencelabs@gmail.com"
                  className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent transition-colors"
                >
                  coalescencelabs@gmail.com
                </a>
              </p>
            </div>
            <p className="type-mono-sm text-bone-3 max-w-sm md:text-right">
              Built with care in 2026. Set in Instrument Serif and Geist.
              Verified and maintained by the studio.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
