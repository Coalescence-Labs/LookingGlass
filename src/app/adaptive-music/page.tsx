import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { Reveal } from "@/components/motion/Reveal";
import { AudioEngine } from "@/components/adaptive/AudioEngine";
import { CASE_STUDIES, MIDDLEWARE } from "@/lib/adaptive-music";

export const metadata: Metadata = {
  title: "How game music follows you",
  description:
    "A game score isn't a recording — it's a system of stems an engine remixes in real time. An interactive, synthesised demo of vertical layering, transitions, and the middleware behind adaptive music.",
};

export default function AdaptiveMusicPage() {
  return (
    <>
      <PageHeader
        index="05"
        kicker="On systems"
        title="How game music follows you"
        lede="Play the same room twice and the music isn't quite the same. That's not a long recording on shuffle — it's a system. A composer writes the music in separable parts, and the game decides which parts you hear, and when, while you play."
      />

      {/* ——— Short answer ——— */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                A game score is{" "}
                <span className="italic text-accent">
                  a decision tree that only becomes a piece while you play
                </span>
                . The notes are written in advance; the arrangement is assembled
                live.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">What it reacts to</span>
                <p className="type-body mt-2">
                  Game state — enemies near, health low, a mission turning —{" "}
                  <span className="text-bone-3">not the buttons you press.</span>
                </p>
              </div>
              <div className="rule" />
              <div>
                <span className="type-mono-sm">What it&rsquo;s made of</span>
                <p className="type-body mt-2">
                  Stems: separable layers, mixed and re-sequenced in real time.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § I The mixing board ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">The mixing board</h2>
            </div>
            <span className="type-mono-sm">Interactive</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            The first trick is called vertical layering. The same eight bars keep
            playing; what changes is which stems are unmuted on top. Drive the
            three parameters below and listen — the drums kick in for combat and
            drop out when it&rsquo;s over, exactly the way Hades does it.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <AudioEngine />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-6 type-mono-sm text-bone-3 max-w-2xl">
            Every sound here is generated in your browser from oscillators and
            noise — there are no audio files on this page, and nothing from any
            game.
          </p>
        </Reveal>
      </section>

      {/* ——— § II The map ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">The map</h2>
            </div>
            <span className="type-mono-sm">Re-sequencing</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Layering changes how thick the music is. The other technique changes
            which music plays at all. It cuts a piece into segments and jumps
            between them — but never mid-phrase.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <SegmentDiagram />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-8 md:grid-cols-[0.9fr_1.4fr]">
            <h3 className="type-display-m text-bone">
              A switch that waits for the bar.
            </h3>
            <div className="flex flex-col gap-6 max-w-xl">
              <p className="type-body">
                Each segment carries an entry cue and an exit cue. When the game
                asks for combat halfway through a bar, the change doesn&rsquo;t
                fire immediately. By default it waits for the current
                segment&rsquo;s exit cue, so the switch lands on a musical
                boundary instead of cutting a note in half.
              </p>
              <p className="type-body">
                In a tool like Wwise that waiting is spelled out in a transition
                matrix — a rule for every move from one state to another. A death
                might be set to interrupt at once; a victory might be told to let
                the current phrase finish first. Either way the change is
                quantised to the beat or the bar, which is why runtime music
                sounds performed rather than spliced.
              </p>
              <p className="type-body">
                Stingers are the punctuation on top: a cymbal swell or a horn
                hit, held back a fraction so it lands on the next beat. Press the
                stinger in the demo above and you&rsquo;ll hear the bed duck
                under it for a moment — which is the subject of the next section.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § III Keeping it legible ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">Keeping it legible</h2>
            </div>
            <span className="type-mono-sm">The mix</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            A score that&rsquo;s always there has a problem: it can drown out the
            line of dialogue you actually need to hear. Two techniques keep the
            mix readable.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="border border-line p-6" style={{ background: "rgba(15,15,18,0.6)" }}>
              <span className="type-mono-sm">Sidechain ducking</span>
              <DuckDiagram />
              <p className="type-body mt-5">
                The voice bus reaches over and pulls the music bus down — the way
                a DJ&rsquo;s talk-over dips the record. The trick is in the
                timing: typically fast to duck (roughly 50–200&nbsp;ms) and slow
                to release (closer to 500–1500&nbsp;ms), so the music sinks out
                of the way and then eases back without pumping.
              </p>
            </div>
            <div className="border border-line p-6" style={{ background: "rgba(15,15,18,0.6)" }}>
              <span className="type-mono-sm">HDR audio</span>
              <MaskDiagram />
              <p className="type-body mt-5">
                High dynamic range mixing takes the opposite approach: author
                sounds across a huge range of loudness, then slide a window over
                it. When a gunshot fires it sits at the top of the window and the
                rustle of leaves below simply drops out — and returns the instant
                the shot stops. No one decided the leaves mattered less; the
                system worked it out from loudness.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § IV How real scores do it ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ IV</span>
              <h2 className="type-heading text-bone">How real scores do it</h2>
            </div>
            <span className="type-mono-sm">Three</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            None of this is theory. Here are three soundtracks you may already
            know, and the technique each one leans on hardest.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CASE_STUDIES.map((c, i) => (
            <Reveal key={c.game} delay={0.15 + i * 0.06}>
              <article className="flex h-full flex-col border border-line p-6">
                <h3 className="font-serif text-[1.3rem] text-bone leading-tight">
                  {c.game}
                </h3>
                <div className="mt-3 flex flex-col gap-1">
                  <span className="type-mono-sm">{c.composer}</span>
                  <span className="type-mono-sm text-bone-3">
                    Engine — {c.engine}
                  </span>
                </div>
                <p className="type-body mt-4">{c.technique}</p>
                <p className="type-mono-sm text-bone-3 mt-4 border-t border-line pt-4">
                  {c.note}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— § V The plumbing ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ V</span>
              <h2 className="type-heading text-bone">The plumbing</h2>
            </div>
            <span className="type-mono-sm">Middleware</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Studios rarely build the music engine themselves. Two packages do the
            job for almost everyone, and they split along a familiar line — power
            versus ease.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {MIDDLEWARE.map((m, i) => (
            <Reveal key={m.name} delay={0.15 + i * 0.06}>
              <div className="flex h-full flex-col border border-line p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-[1.3rem] text-bone">{m.name}</h3>
                  <span className="type-mono-sm">{m.maker}</span>
                </div>
                <p className="type-body mt-3 text-bone-2">{m.character}</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {m.features.map((f) => (
                    <li key={f} className="type-body flex gap-3">
                      <span aria-hidden className="text-accent">
                        —
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 type-body max-w-2xl text-bone-2">
            The demo in § I is the same idea, stripped to its bones. Each stem is
            a single gain node; a small scheduler quantises new layers to the
            beat; and nothing makes a sound until you ask it to, because the
            browser starts every audio context suspended. It&rsquo;s a hand-built
            miniature of what Wwise and FMOD do at scale.
          </p>
        </Reveal>
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
              <h3 className="type-mono">Techniques & middleware</h3>
              <ul className="mt-5 flex flex-col gap-4 type-body max-w-lg">
                <li>
                  The vertical / horizontal split and the transition matrix,
                  stingers, and sync behaviour come from{" "}
                  <SourceOutboundLink
                    href="https://www.audiokinetic.com/en/courses/wwise201/"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Audiokinetic&rsquo;s Wwise documentation
                  </SourceOutboundLink>{" "}
                  and{" "}
                  <SourceOutboundLink
                    href="https://www.fmod.com/docs"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Firelight&rsquo;s FMOD docs
                  </SourceOutboundLink>
                  .
                </li>
                <li>
                  The dynamic / interactive / adaptive vocabulary is Karen
                  Collins&rsquo;, in <em>Game Sound</em> (MIT Press, 2008) and{" "}
                  <em>From Pac-Man to Pop Music</em> (Routledge, 2008).
                </li>
                <li>
                  Sidechain ducking and HDR follow Audiokinetic&rsquo;s{" "}
                  <SourceOutboundLink
                    href="https://www.audiokinetic.com/en/library/edge/?id=understanding_hdr"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    HDR documentation
                  </SourceOutboundLink>
                  ; fade-time figures are practitioner guidance and are given as
                  rough ranges.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="type-mono">The three scores & the demo</h3>
              <ul className="mt-5 flex flex-col gap-4 type-body max-w-lg">
                <li>
                  Hades, in composer Darren Korb&rsquo;s own words —{" "}
                  <SourceOutboundLink
                    href={CASE_STUDIES[0].source}
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    {new URL(CASE_STUDIES[0].source).hostname} ↗
                  </SourceOutboundLink>
                  .
                </li>
                <li>
                  Red Dead Redemption 2&rsquo;s eleven stems and Gunfight
                  Conductor, from Rockstar&rsquo;s own Q&amp;A —{" "}
                  <SourceOutboundLink
                    href={CASE_STUDIES[1].source}
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    {new URL(CASE_STUDIES[1].source).hostname} ↗
                  </SourceOutboundLink>
                  . (Its roughly 60 hours of music across around 190 missions are
                  widely reported but tertiary, so kept out of the body.)
                </li>
                <li>
                  Marty O&rsquo;Donnell on building Bungie&rsquo;s adaptive
                  engine for Halo and Destiny —{" "}
                  <SourceOutboundLink
                    href={CASE_STUDIES[2].source}
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    {new URL(CASE_STUDIES[2].source).hostname} ↗
                  </SourceOutboundLink>
                  .
                </li>
                <li>
                  The opt-in audio context and click-free gain ramps follow{" "}
                  <SourceOutboundLink
                    href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    MDN&rsquo;s Web Audio best practices
                  </SourceOutboundLink>{" "}
                  and the{" "}
                  <SourceOutboundLink
                    href="https://webaudio.github.io/web-audio-api/"
                    className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
                  >
                    Web Audio API specification
                  </SourceOutboundLink>
                  . All audio on this page is synthesised at runtime; no
                  recordings, original or otherwise, are loaded.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

// ——— Static diagrams (server-rendered SVG/CSS, no audio) ———

function SegmentDiagram() {
  return (
    <div
      className="mt-8 border border-line p-6 md:p-8"
      style={{ background: "rgba(15,15,18,0.6)" }}
    >
      <svg
        viewBox="0 0 600 190"
        width="100%"
        role="img"
        aria-label="Two music segments — Explore and Combat — laid on a timeline. The player asks for combat mid-bar, but the switch waits for the next exit cue and lands on the bar line."
        style={{ display: "block" }}
      >
        {/* bar gridlines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={60 + i * 120}
            y1={30}
            x2={60 + i * 120}
            y2={150}
            stroke="var(--color-line)"
            strokeWidth={1}
            aria-hidden
          />
        ))}

        {/* Explore lane */}
        <text x={10} y={58} fill="var(--color-bone-3)" style={labelStyle}>
          Explore
        </text>
        <rect x={60} y={44} width={240} height={26} fill="rgba(236,232,222,0.08)" stroke="var(--color-line-2)" />
        <text x={66} y={61} fill="var(--color-accent)" style={cueStyle}>entry</text>
        <text x={250} y={61} fill="var(--color-accent)" style={cueStyle}>exit cue</text>

        {/* Combat lane (starts at the exit cue / bar line at x=300) */}
        <text x={10} y={118} fill="var(--color-bone-3)" style={labelStyle}>
          Combat
        </text>
        <rect x={300} y={104} width={240} height={26} fill="rgba(228,199,138,0.12)" stroke="rgba(228,199,138,0.4)" />
        <text x={306} y={121} fill="var(--color-accent)" style={cueStyle}>entry</text>

        {/* "you pressed here" marker mid-bar */}
        <line x1={210} y1={20} x2={210} y2={170} stroke="var(--color-bone-3)" strokeWidth={1} strokeDasharray="3 3" aria-hidden />
        <text x={210} y={185} textAnchor="middle" fill="var(--color-bone-3)" style={cueStyle}>
          you ask for combat
        </text>

        {/* the quantised switch arrow from press → exit cue */}
        <line x1={210} y1={28} x2={300} y2={28} stroke="var(--color-accent)" strokeWidth={1} aria-hidden />
        <polygon points="300,28 292,24 292,32" fill="var(--color-accent)" aria-hidden />
        <text x={255} y={20} textAnchor="middle" fill="var(--color-accent)" style={cueStyle}>
          waits for the bar
        </text>
      </svg>
    </div>
  );
}

function DuckDiagram() {
  return (
    <svg
      viewBox="0 0 300 90"
      width="100%"
      role="img"
      aria-label="A music level holds steady, dips quickly when a dialogue pulse arrives, then eases back up more slowly."
      className="mt-4"
      style={{ display: "block" }}
    >
      {/* music level line: steady, dip, slow recover */}
      <polyline
        points="0,30 90,30 110,62 150,62 230,34 300,30"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        aria-hidden
      />
      {/* dialogue pulse */}
      <rect x={108} y={20} width={42} height={50} fill="rgba(236,232,222,0.06)" stroke="var(--color-line-2)" aria-hidden />
      <text x={129} y={84} textAnchor="middle" fill="var(--color-bone-3)" style={cueStyle}>
        dialogue
      </text>
      <text x={40} y={22} fill="var(--color-bone-3)" style={cueStyle}>music</text>
    </svg>
  );
}

function MaskDiagram() {
  return (
    <svg
      viewBox="0 0 300 90"
      width="100%"
      role="img"
      aria-label="A loud gunshot bar sits near the top of the loudness window; a much quieter leaves bar falls below the window and is masked."
      className="mt-4"
      style={{ display: "block" }}
    >
      {/* window top line */}
      <line x1={0} y1={26} x2={300} y2={26} stroke="rgba(228,199,138,0.5)" strokeDasharray="4 3" strokeWidth={1} aria-hidden />
      <text x={4} y={20} fill="var(--color-accent)" style={cueStyle}>window top</text>
      {/* gunshot — tall */}
      <rect x={70} y={30} width={36} height={48} fill="var(--color-accent)" aria-hidden />
      <text x={88} y={88} textAnchor="middle" fill="var(--color-bone-3)" style={cueStyle}>gunshot</text>
      {/* leaves — short, below masked line */}
      <rect x={190} y={64} width={36} height={14} fill="var(--color-line-2)" aria-hidden />
      <text x={208} y={88} textAnchor="middle" fill="var(--color-muted)" style={cueStyle}>leaves</text>
    </svg>
  );
}

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const cueStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 8.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};
