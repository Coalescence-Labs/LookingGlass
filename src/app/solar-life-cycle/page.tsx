import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { StageTimeline } from "@/components/solar/StageTimeline";
import { SolarStages } from "@/components/solar/SolarStages";
import { SOURCES, SUN_CURRENT_AGE_GYR, TOTAL_GYR } from "@/lib/solar";

export const metadata: Metadata = {
  title: "The life of a star — the one we live by",
  description:
    "The sun's life cycle from nebular collapse through main sequence, red giant, helium flash, horizontal branch, AGB, planetary nebula, and white dwarf — with every number sourced to a primary reference.",
};

export default function SolarLifeCyclePage() {
  const remainingGyr = TOTAL_GYR - SUN_CURRENT_AGE_GYR;

  return (
    <>
      <PageHeader
        index="04"
        kicker="On the things we live by"
        title="The life of a star — the one we live by"
        lede="The sun is the largest mechanism any of us will ever live alongside, and one of the few whose inner workings don't require a specialist to describe. It has a childhood, a long working middle, a dramatic old age, and a long, slow afterwards. Here is the whole of it."
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
                then a hundred-billion-year cooling.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <span className="type-mono-sm">Remaining main sequence</span>
                <div className="mt-4">
                  <span className="type-numeral text-[3.25rem] leading-none text-bone md:text-[4rem]">
                    ~{remainingGyr.toFixed(1)}
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
                A star is a ball of plasma held together by its own weight, kept
                from collapsing by the pressure of fusion happening in its
                centre. When a new kind of fuel runs out, the balance shifts,
                and the star reconfigures — sometimes gradually, sometimes in
                minutes.
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
          <p className="mt-10 type-lede max-w-2xl">
            The sun&rsquo;s life spans 11 orders of magnitude in duration, from
            minute-long events like the helium flash to hundred-billion-year
            cooling. A log scale makes every phase visible; a linear scale
            shows what one Gyr really looks like next to the others.
          </p>
        </Reveal>

        <div className="mt-12 md:mt-16">
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
          <p className="mt-10 type-lede max-w-2xl">
            Each phase is defined by what&rsquo;s fusing in the core (or
            isn&rsquo;t). The Hertzsprung–Russell diagram on the left tracks
            the star through luminosity and surface temperature — the two
            things you could, in principle, measure from a great distance.
          </p>
        </Reveal>

        <div className="mt-12 md:mt-16">
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
                swelling red and swallowing us whole during the red giant
                branch. That is technically possible — the AGB radius does
                reach past the current orbit — but it misses the more
                immediate problem.
              </p>
              <p>
                The sun brightens as it ages. Over the main sequence,
                luminosity climbs roughly 30% from zero-age to turnoff. Climate
                models that couple increasing solar flux to atmospheric
                chemistry put the loss of Earth&rsquo;s liquid water somewhere
                between{" "}
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

            <aside
              className="flex flex-col gap-4 border border-line p-6 md:p-8"
              style={{ background: "rgba(15, 15, 18, 0.6)" }}
            >
              <span className="type-mono-sm">The misconceptions this corrects</span>
              <ul className="flex flex-col gap-3 type-body text-[0.95rem]">
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
            <span className="type-mono-sm">Verified April 2026</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-8 flex flex-col gap-5 type-body max-w-3xl">
            <li>
              Sun&rsquo;s current age (4.6 Gyr), radius, luminosity, and
              hydrostatic properties are drawn from the{" "}
              <SourceOutboundLink
                href={SOURCES.nasa.href}
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                NASA Sun Fact Sheet
              </SourceOutboundLink>
              . Main-sequence duration and fraction elapsed are consistent with
              that source&rsquo;s wording.
            </li>
            <li>
              Phase-by-phase physics (core degeneracy, shell burning, dredge-up,
              pp-chain vs CNO, triple-alpha) follows{" "}
              <SourceOutboundLink
                href={SOURCES.cd.href}
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                Christensen-Dalsgaard&rsquo;s <em>Stellar Structure and Evolution</em>
              </SourceOutboundLink>{" "}
              lecture notes (Aarhus, 2008), chapters 10–12. Specific sections
              are cited on each stage card.
            </li>
            <li>
              RGB, helium flash, HB, and AGB descriptions are cross-referenced
              with Iben&rsquo;s{" "}
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
              Post-main-sequence track timing proxies values from NASA +
              Christensen-Dalsgaard rather than reading{" "}
              <SourceOutboundLink
                href={SOURCES.schaller.href}
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                Schaller et al. (1992)
              </SourceOutboundLink>{" "}
              tables directly. Cells in the data layer where interpolation was
              unavoidable are flagged as such.
            </li>
            <li>
              Earth habitability framing (§ III) is intentionally
              order-of-magnitude: specific Myr numbers depend on climate
              coupling assumptions that remain under active discussion. The
              direction and rough scale are robust; pinpoint values are not.
            </li>
            <li>
              HR path shown in § II is a simplified single-star trace. AGB
              thermal-pulse wiggles and &ldquo;born-again&rdquo; loops are
              omitted for legibility. The convention — temperature decreasing
              left-to-right, luminosity log-scaled — is the one Hertzsprung
              and Russell independently arrived at in 1911 and 1913.
            </li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}
