import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { Term } from "@/components/site/Term";
import { StageTimeline } from "@/components/solar/StageTimeline";
import { SolarStages } from "@/components/solar/SolarStages";
import { SOURCES, STAGES, SUN_CURRENT_AGE_GYR } from "@/lib/solar";

export const metadata: Metadata = {
  title: "The life of a star — the one we live by",
  description:
    "The sun's life cycle from nebular collapse through main sequence, red giant, helium flash, horizontal branch, AGB, planetary nebula, and white dwarf — with every number sourced to a primary reference.",
};

export default function SolarLifeCyclePage() {
  const mainSequence = STAGES.find((s) => s.id === "main-sequence")!;
  const remainingMsGyr =
    mainSequence.startGyr + mainSequence.durationGyr - SUN_CURRENT_AGE_GYR;

  return (
    <>
      <PageHeader
        index="08"
        kicker="On the things we live by"
        title="The life of a star — the one we live by"
        lede="The sun is the largest celestial body most of us will ever live alongside. It has a childhood, a long working middle, a dramatic old age, and a long, slow afterwards. Here is the whole of it."
      />

      {/* ——— Short answer ——— */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                The sun is{" "}
                <span className="italic text-accent">
                  {SUN_CURRENT_AGE_GYR} billion years old
                </span>
                , a little under halfway through a{" "}
                <span className="italic text-accent">
                  ~10-billion-year
                </span>{" "}
                main-sequence life. After that, a short and spectacular old age,
                then a cooling that lasts hundreds of billions of years (and
                longer in detailed white-dwarf models).
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">Remaining main sequence</span>
                <div className="mt-3">
                  <span className="type-numeral text-[3.5rem] leading-none text-bone md:text-[4.5rem]">
                    ~{remainingMsGyr.toFixed(1)}
                  </span>
                  <div className="type-mono">billion years</div>
                </div>
              </div>
              <div className="rule" />
              <p className="type-mono-sm text-bone-3 max-w-sm">
                The sun is not <em>burning</em>. Fire is a chemical reaction
                that needs oxygen; fusion is nuclei colliding hard enough to
                become new nuclei. Different physics, different rate constants,
                different timescales.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— Anchor: what we mean by a star's life ——— */}
      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.4fr] md:gap-16">
          <Reveal>
            <h2 className="type-display-m text-bone">
              First, <span className="italic text-accent">what we mean by a life.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-6 type-body max-w-xl">
              <p>
                A star is a ball of <Term>plasma</Term> held together by its
                own weight, kept from collapsing by the pressure of fusion
                happening in its centre. When a new kind of fuel runs out, the
                balance shifts, and the star reconfigures — sometimes over
                millions of years, sometimes in a flash.
              </p>
              <p>
                What follows is not the story of every star. Massive stars end
                in supernovae and leave neutron stars or black holes; small red
                dwarfs will outlive the universe in its current form. This is
                the single-star, one-solar-mass life cycle — the one that
                applies to the specific object Earth orbits.
              </p>
              <p>
                Every number on this page is sourced to a primary reference
                below. &ldquo;Approximately&rdquo; does real work: evolutionary
                models disagree in the third significant figure, and this piece
                doesn&rsquo;t pretend otherwise.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— § I — The whole life, at a glance ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">
                The whole life, at a glance
              </h2>
            </div>
            <span className="type-mono-sm">Two scales of the same timeline</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Log makes every phase readable — including the minute of a helium
            flash. Linear tells the truth of proportion: the luminous career is
            a left-edge sliver; white-dwarf cooling owns the rest.
          </p>
        </Reveal>

        <div className="mt-10">
          <StageTimeline />
        </div>
      </section>

      {/* ——— § II — Phase by phase ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">Phase by phase</h2>
            </div>
            <span className="type-mono-sm">Scroll · the star moves with you</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Each phase is defined by what&rsquo;s fusing in the core (or
            isn&rsquo;t). The Hertzsprung–Russell diagram on the left tracks
            the star through luminosity and surface temperature — the two
            things you could, in principle, measure from a great distance.
          </p>
        </Reveal>

        <div className="mt-10">
          <SolarStages />
        </div>
      </section>

      {/* ——— § III — What this means for Earth ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">
                What this means for Earth
              </h2>
            </div>
            <span className="type-mono-sm">Order of magnitude only</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <div className="flex flex-col gap-6 type-body max-w-xl">
              <p>
                The most common picture of Earth&rsquo;s end involves the sun
                swelling red and swallowing us whole. Mercury is engulfed on
                the red-giant tip in standard solar tracks; Earth&rsquo;s fate
                on the asymptotic giant branch is model-dependent — tip radii
                reach near today&rsquo;s 1&nbsp;AU, but mass loss widens orbits
                and tides can still pull planets in. That debate misses the
                more immediate problem.
              </p>
              <p>
                The sun brightens as it ages. From zero-age to turnoff,
                luminosity rises from roughly 0.7&nbsp;L☉ to about
                2&nbsp;L☉ — roughly a factor of three, not a few tens of
                percent. Relative to today, climate models that couple
                increasing solar flux to atmospheric chemistry put the loss of
                Earth&rsquo;s liquid water somewhere between{" "}
                <span className="text-bone">a few hundred million</span> and{" "}
                <span className="text-bone">about a billion</span> years from
                now — long after anything resembling the current biosphere,
                long before any red-giant turn.
              </p>
              <p>
                The specific number depends on assumptions about cloud cover,
                CO₂ cycling, and biological feedback that are still being
                argued about. The direction of the answer is not in doubt:
                Earth will be uninhabitable on a scale of hundreds of millions
                to a billion years, purely from the sun getting hotter.
              </p>
            </div>

            <aside className="flex flex-col gap-5 border-t border-line pt-6 md:pt-0 md:border-t-0 md:border-l md:pl-8">
              <span className="type-mono-sm">The misconceptions this corrects</span>
              <ul className="flex flex-col gap-4 type-body">
                <li className="flex gap-3">
                  <span className="type-mono-sm mt-1 text-accent">01</span>
                  <span>
                    The sun isn&rsquo;t burning. Fire is combustion; this is
                    fusion.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="type-mono-sm mt-1 text-accent">02</span>
                  <span>
                    &ldquo;~5 billion years left&rdquo; is main-sequence life
                    remaining, not total sun life, and not Earth habitability.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="type-mono-sm mt-1 text-accent">03</span>
                  <span>
                    Fuel exhaustion means core hydrogen; shell burning
                    continues long after.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="type-mono-sm mt-1 text-accent">04</span>
                  <span>
                    The helium flash is an internal event. It doesn&rsquo;t
                    look dramatic from outside.
                  </span>
                </li>
              </ul>
            </aside>
          </div>
        </Reveal>
      </section>

      {/* ——— Sources ——— */}
      <section id="sources" className="shell pb-28">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="type-mono">Sources & notes</h2>
            <span className="type-mono-sm">Verified October 2026</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-8 flex flex-col gap-5 type-body max-w-3xl">
            <li>
              Present-day Teff (5772&nbsp;K), luminosity, and central temperature
              come from the{" "}
              <SourceOutboundLink
                href={SOURCES.nasa.href}
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                NASA Sun Fact Sheet
              </SourceOutboundLink>
              . Age (~4.6&nbsp;Gyr) and the public ~10&nbsp;Gyr main-sequence
              lifetime / ~5&nbsp;Gyr remaining wording follow{" "}
              <SourceOutboundLink
                href={SOURCES.nasaFacts.href}
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                NASA Science Sun facts
              </SourceOutboundLink>
              ; detailed 1&nbsp;M☉ tracks often give ~10–11&nbsp;Gyr on the main
              sequence.
            </li>
            <li>
              Phase-by-phase physics (core degeneracy, shell burning, dredge-up,
              pp-chain vs CNO, triple-alpha) follows{" "}
              <SourceOutboundLink
                href={SOURCES.cd.href}
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                Christensen-Dalsgaard&rsquo;s <em>Lecture Notes on Stellar
                Structure and Evolution</em>
              </SourceOutboundLink>{" "}
              (Aarhus; linked via a Wayback snapshot of the 2023 PDF — the live
              Aarhus path has moved). Specific sections are cited on each stage
              card.
            </li>
            <li>
              Quantitative solar-track waypoints (ZAMS→turnoff L/R, RGB tip,
              AGB tip near 1&nbsp;AU, HB/AGB durations, remnant mass) are
              anchored to{" "}
              <SourceOutboundLink
                href={SOURCES.sackmann.href}
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                Sackmann, Boothroyd &amp; Kraemer (1993)
              </SourceOutboundLink>
              . Numbers are rounded for the explainer; they are
              model-dependent.
            </li>
            <li>
              RGB, helium flash, HB, and AGB qualitative structure are
              cross-referenced with Iben&rsquo;s{" "}
              <SourceOutboundLink
                href={SOURCES.iben.href}
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                <em>Stellar Evolution Physics</em>
              </SourceOutboundLink>{" "}
              (Cambridge, 2012). The earlier ApJS 76, 55 (1991) review is
              subsumed by this treatment.
            </li>
            <li>
              Grid context for 1&nbsp;M☉ evolution also includes{" "}
              <SourceOutboundLink
                href={SOURCES.schaller.href}
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                Schaller et al. (1992)
              </SourceOutboundLink>
              ; this page&rsquo;s timing cells follow Sackmann + NASA rather
              than reading every Schaller table cell.
            </li>
            <li>
              Earth habitability framing (§ III) is intentionally
              order-of-magnitude: specific million-year figures depend on
              climate coupling assumptions that remain under active
              discussion. The direction and rough scale are robust; pinpoint
              values are not. Engulfment of Earth is likewise unsettled once
              tides and AGB mass loss are included.
            </li>
            <li>
              HR path shown in § II is a simplified single-star trace. AGB
              thermal-pulse wiggles and &ldquo;born-again&rdquo; loops are
              omitted for legibility. The convention — temperature decreasing
              left-to-right, luminosity log-scaled — is the one Hertzsprung
              and Russell independently arrived at in 1911 and 1913. White-dwarf
              cooling on the timeline uses a 10¹¹&nbsp;yr schematic span;
              cooling models continue longer.
            </li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}
