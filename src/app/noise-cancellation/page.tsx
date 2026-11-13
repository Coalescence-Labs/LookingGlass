import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { Reveal } from "@/components/motion/Reveal";
import { WaveSuperposition } from "@/components/anc/WaveSuperposition";
import { AncLoopDiagram } from "@/components/anc/AncLoopDiagram";
import { BandSketch } from "@/components/anc/BandSketch";
import { SOURCES, hostname } from "@/lib/anc";

export const metadata: Metadata = {
  title: "How noise-cancelling headphones work",
  description:
    "Active noise cancellation invents an anti-noise wave so that, at your eardrum, pressure cancels by destructive interference — feedforward, feedback, and why bass yields first.",
};

export default function NoiseCancellationPage() {
  return (
    <>
      <PageHeader
        index="10"
        kicker="On machines"
        title="How noise-cancelling headphones work"
        lede="They do not swallow sound into a void. They invent a second pressure wave — carefully timed — so that, where your eardrum sits, the noisy world and the headphone’s reply add up to almost nothing."
      />

      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                ANC is{" "}
                <span className="italic text-accent">
                  destructive interference on purpose
                </span>
                : sense the noise, synthesise its opposite, play both into the
                same small room that is your earcup.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">Passive</span>
                <p className="type-body mt-2">
                  Foam, seals, mass — blocking without electronics.
                </p>
              </div>
              <div className="rule" />
              <div>
                <span className="type-mono-sm">Active</span>
                <p className="type-body mt-2">
                  Microphones and DSP invent anti-noise for the bands where
                  geometry still allows a clean phase match — usually the low
                  end.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">Two waves, one ear</h2>
            </div>
            <span className="type-mono-sm">Interactive</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Drag phase toward 180°. When the copy is late by half a cycle, the
            bright sum collapses — that flat line is the null ANC is chasing,
            tone by tone, across a band. Enable the tone only if you want to
            hear it; nothing plays until you ask.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10">
            <WaveSuperposition />
          </div>
        </Reveal>
      </section>

      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">The ANC loop</h2>
            </div>
            <span className="type-mono-sm">Diagram</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Feedforward listens outside and acts early. Feedback listens inside
            and mops up what remains. Most serious designs run both into the
            same driver — a hybrid loop whose patents read like plumbing
            diagrams for pressure.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10">
            <AncLoopDiagram />
          </div>
        </Reveal>
      </section>

      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">Why bass yields first</h2>
            </div>
            <span className="type-mono-sm">Sketch</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            A 100 Hz rumble has a wavelength of metres; a headset is a speck
            beside it, so phase is forgiving. Climb toward several kilohertz and
            the same millimetres of mic-to-driver distance become large fractions
            of a cycle. Feedback loops run out of bandwidth; feedforward models
            go stale. High frequencies lean on the seal.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10">
            <BandSketch />
          </div>
        </Reveal>
      </section>

      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ IV</span>
              <h2 className="type-heading text-bone">Passive is not active</h2>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <span className="type-mono-sm text-accent">Isolation</span>
              <p className="mt-4 type-body">
                Cups, tips, and clamps reduce what arrives before any DSP wakes
                up. Standards measure this with ANC off — physical insertion
                loss against an open ear.
              </p>
            </div>
            <div>
              <span className="type-mono-sm text-accent">Cancellation</span>
              <p className="mt-4 type-body">
                Active insertion loss is the extra quieting when ANC turns on
                with the headphone already fitted. Total quiet is both. Marketing
                likes one number; physics keeps two ledgers.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-10 type-lede max-w-2xl text-bone-2">
            Fit still matters. A leaky seal changes the plant the controller
            assumed — which is why some headphones store wearer profiles instead
            of pretending every ear is the same cavity.
          </p>
        </Reveal>
      </section>

      <section id="sources" className="shell pb-28 md:pb-36">
        <Reveal>
          <div className="border-b border-line pb-6">
            <h2 className="type-heading text-bone">Sources</h2>
            <p className="mt-3 type-mono-sm text-bone-3">
              Primary patents and measurement standards. Claim IDs live in{" "}
              <code className="text-bone-2">research/noise-cancellation/</code>.
            </p>
          </div>
        </Reveal>
        <ul className="mt-10 flex flex-col gap-6">
          {SOURCES.map((s) => (
            <li key={s.href} className="border-b border-line pb-6">
              <SourceOutboundLink href={s.href} className="type-body text-bone">
                {s.label}
              </SourceOutboundLink>
              <p className="mt-2 type-mono-sm text-bone-3">
                {hostname(s.href)} · {s.note}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
