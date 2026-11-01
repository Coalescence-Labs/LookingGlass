import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { Reveal } from "@/components/motion/Reveal";
import { BigNumber } from "@/components/stats/BigNumber";
import { Cutaway } from "@/components/espresso/Cutaway";
import { PullCurve } from "@/components/espresso/PullCurve";
import { BoilerComparison } from "@/components/espresso/BoilerComparison";
import {
  STANDARDS,
  CAFE_REFERENCE,
  PRESSURE_INTUITION,
  SCIENCE_STATS,
  MYTHS,
  CREMA,
  SOURCES,
  hostname,
} from "@/lib/espresso";

export const metadata: Metadata = {
  title: "How an espresso machine works",
  description:
    "Nine bars of pressure, water a few degrees off boiling, seven grams of coffee — and twenty-five seconds. A cutaway of the flow path, a scrubbable extraction curve, and what the science actually says about the perfect shot.",
};

export default function EspressoMachinePage() {
  return (
    <>
      <PageHeader
        index="04"
        kicker="On machines"
        title="How an espresso machine works"
        lede="Set aside the chrome and the ritual and an espresso machine is a small, exact instrument: it holds water a few degrees below boiling, leans on it with the weight of nine atmospheres, and pushes it through a thimble of ground coffee before the pressure has time to settle. Everything interesting happens in about twenty-five seconds."
      />

      {/* ——— Short answer ——— */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                An espresso machine drives hot water{" "}
                <span className="italic text-accent">
                  through a packed bed of coffee under pressure
                </span>{" "}
                — about nine bars of it, water a few degrees off the boil, seven
                grams of grounds, done before you&rsquo;ve found a saucer.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">The standard pull</span>
                <div className="mt-3">
                  <span className="type-numeral text-[3.5rem] leading-none text-bone md:text-[4.5rem]">
                    {PRESSURE_INTUITION.bar} bar
                  </span>
                  <div className="type-mono">
                    ≈ {PRESSURE_INTUITION.psi} psi · {PRESSURE_INTUITION.atmospheres}× atmospheric pressure
                  </div>
                </div>
              </div>
              <div className="rule" />
              <div>
                <span className="type-mono-sm">By the book</span>
                <p className="type-body mt-2">
                  Roughly {STANDARDS[0].dose} of coffee, water near{" "}
                  {STANDARDS[0].temp}, {STANDARDS[0].time}, yielding{" "}
                  {STANDARDS[0].yield}.{" "}
                  <span className="text-bone-3">
                    In a real café, heavier — {CAFE_REFERENCE.dose} in,{" "}
                    {CAFE_REFERENCE.beverage} out.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § I The flow path ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">The flow path</h2>
            </div>
            <span className="type-mono-sm">Interactive · cutaway</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Follow a single shot from tank to cup. Three things have to line up
            along the way — pressure has to be made, heat has to be held, and the
            coffee itself has to push back just the right amount. Step through the
            parts to see where each one lives.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <Cutaway />
          </div>
        </Reveal>
      </section>

      {/* ——— § II The pull ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">The pull</h2>
            </div>
            <span className="type-mono-sm">Interactive</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            &ldquo;Nine bars for twenty-five seconds&rdquo; sounds like a setting
            you dial in and hold. It isn&rsquo;t. A shot is a short journey
            through three curves at once — pressure, flow, and temperature.
            Scrub the cursor and watch how the famous window is really a plateau
            the machine passes through, with a wetting phase before it and a
            decline after.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <PullCurve />
          </div>
        </Reveal>
      </section>

      {/* ——— § III Three boilers ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">Three boilers, one problem</h2>
            </div>
            <span className="type-mono-sm">Compare</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Here is the awkward fact a machine has to design around: brewing wants
            water around ninety-three degrees, and steaming milk wants something
            well past boiling. One vessel cannot be both at once. The three
            classic layouts are three different ways out of that corner.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <BoilerComparison />
          </div>
        </Reveal>
      </section>

      {/* ——— § IV The science ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ IV</span>
              <h2 className="type-heading text-bone">
                What the science actually says
              </h2>
            </div>
            <span className="type-mono-sm">Matter, 2020</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-10 md:grid-cols-[0.9fr_1.4fr]">
            <h3 className="type-display-m text-bone">
              Finer isn&rsquo;t <span className="italic text-accent">always</span>{" "}
              more.
            </h3>
            <div className="flex max-w-xl flex-col gap-6 type-body">
              <p>
                The industry measures a shot by its extraction yield: the share of
                the dry coffee&rsquo;s mass that actually ends up dissolved in the
                cup. Most of a roasted bean is insoluble structure, so there is a
                hard ceiling — only about a third of it will ever leave.
              </p>
              <p>
                Grind finer and you expose more surface, which ought to raise the
                yield. A mathematical model of the puck predicts exactly that — so
                long as water flows evenly. But when Cameron, Hendon and their
                colleagues actually measured it, yield rose, peaked, and then
                <em> fell</em> as the grind got finer still.
              </p>
              <p>
                The culprit is channeling. Pack the bed too fine and water stops
                soaking through evenly; instead it carves a few preferential paths,
                over-extracting along them and barely touching the rest. The cup
                comes out both bitter and sour at once, and no two shots agree.
              </p>
              <p>
                Their fix runs against café instinct: find a shot you like, then
                grind <em>coarser</em> and use <em>less</em> coffee, steering the
                yield with the ratio of water to grounds rather than the clock. In
                a year-long café trial it cut the coffee in each drink by as much
                as a quarter, with no loss in the cup.
              </p>
              <p className="text-bone-3">
                A smaller heresy from the same work: tamping force, within the
                range anyone actually uses, barely changes the shot. The tamp is
                there to level the bed, not to add resistance. And the lower the
                pressure, the wider the range of grinds that still flow evenly —
                their trials dropped to six bars to keep fine beds from clogging.
                Nine bars endures as the <em>sensory</em> standard, not a yield
                optimum.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
            {SCIENCE_STATS.map((s) => (
              <div key={s.id} className="flex flex-col gap-2">
                <BigNumber
                  value={s.value}
                  suffix={s.suffix}
                  className="text-[3.25rem] leading-none text-accent md:text-[4rem]"
                />
                <p className="type-body max-w-sm">{s.caption}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ——— § V Mechanism and ritual ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ V</span>
              <h2 className="type-heading text-bone">Mechanism and ritual</h2>
            </div>
            <span className="type-mono-sm">Crema</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-10 md:grid-cols-[0.9fr_1.4fr]">
            <h3 className="type-display-m text-bone">
              The crema is <span className="italic text-accent">not</span> the
              flavour.
            </h3>
            <div className="flex max-w-xl flex-col gap-6 type-body">
              <p>
                That reddish-brown foam is real, and it is more interesting than
                the folklore around it. Roasting traps carbon dioxide inside the
                bean; the shot&rsquo;s pressure forces that gas into solution, and
                when the coffee hits the open cup and the pressure drops, it
                fizzes back out as a haze of micro-bubbles suspended in an
                oil-in-water emulsion — {CREMA.dropletFineness}, threaded with
                fragments of coffee too small to see.
              </p>
              <p>
                What keeps it standing is chemistry borrowed from roasting:
                proteins and their browned descendants, the melanoidins, build the
                foam; dissolved sugars called polysaccharides make it last; oils
                firm up the walls. Drip coffee has the same ingredients and never
                foams, because it never sees the pressure.
              </p>
              <p>
                The connoisseur&rsquo;s rule of thumb — {CREMA.fractionOfCup} of
                the cup, holding for {CREMA.persistence} — is a fine{" "}
                <em>freshness</em> cue, because stale, off-gassed beans foam less.
                But it is a poor flavour cue: low-regarded robusta foams more than
                prized arabica. Crema tells you there was pressure and the beans
                were fresh. It does not tell you the coffee is good.
              </p>
              <p>
                None of which is an argument against the ritual. The tamp, the
                timing, the watching — they are part of the pleasure of the thing.
                The point is only to know which parts are the machine doing
                physics and which parts are us, enjoying ourselves.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="mt-12 border-t border-line">
            {MYTHS.map((m, i) => (
              <li key={m.myth}>
                <Reveal delay={i * 0.05} duration={0.7}>
                  <div className="grid gap-2 border-b border-line py-6 md:grid-cols-[1fr_1.4fr] md:gap-10">
                    <span className="font-serif text-[1.25rem] leading-tight tracking-[-0.02em] text-bone-3 md:text-[1.4rem]">
                      &ldquo;{m.myth}&rdquo;
                    </span>
                    <p className="type-body">{m.truth}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ——— Sources ——— */}
      <section id="sources" className="shell pb-28">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="type-mono">Sources &amp; notes</h2>
            <span className="type-mono-sm">Verified June 2026</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h3 className="type-mono">References</h3>
              <ul className="mt-5 flex flex-col gap-5 type-body">
                {SOURCES.map((s) => (
                  <li key={s.id} className="flex flex-col">
                    <SourceOutboundLink
                      href={s.href}
                      className="font-serif text-[1.05rem] text-bone underline decoration-line-2 underline-offset-[6px] transition-colors hover:decoration-accent"
                    >
                      {s.cite}
                    </SourceOutboundLink>
                    <span className="type-body mt-1 text-bone-3">{s.note}</span>
                    <SourceOutboundLink
                      href={s.href}
                      className="type-mono-sm mt-1 text-bone-3 transition-colors hover:text-accent"
                    >
                      {hostname(s.href)} ↗
                    </SourceOutboundLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="type-mono">Notes on the figures</h3>
              <ul className="mt-5 flex flex-col gap-4 type-body max-w-lg">
                <li>
                  The canonical numbers — seven grams, nine bars, ninety-odd
                  degrees, twenty-five seconds — come from the Specialty Coffee
                  Association&rsquo;s historical definition (as quoted in Cameron
                  &amp; Hendon, 2020) and the Istituto Espresso Italiano&rsquo;s
                  certified specification. The two measure temperature at
                  different points, which is why this page says &ldquo;a few
                  degrees off the boil&rdquo; rather than a single figure.
                </li>
                <li>
                  The extraction curve in § II is an{" "}
                  <em>illustrative reference</em>: its shape follows documented
                  behaviour — a low pre-infusion soak, a plateau near nine bars,
                  a decline, with flow coupled to pressure and temperature held
                  nearly flat — but it is not a log from any one machine.
                </li>
                <li>
                  The cutaway in § I is a stylised, hand-drawn schematic for
                  Looking Glass — not to scale, and not traced from any
                  manufacturer&rsquo;s drawing.
                </li>
                <li>
                  Pump and boiler mechanisms are described from independent
                  vendor and educator explainers that agree on the engineering;
                  every <em>quantity</em> on this page rests on a primary or
                  peer-reviewed source above.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
