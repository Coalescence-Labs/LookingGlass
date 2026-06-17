import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { Reveal } from "@/components/motion/Reveal";
import { TopologyDemo } from "@/components/mesh/TopologyDemo";
import { ProtocolCompare } from "@/components/mesh/ProtocolCompare";
import { DeploymentMap } from "@/components/mesh/DeploymentMap";
import { PHY_LAYERS } from "@/lib/mesh";

export const metadata: Metadata = {
  title: "How does a mesh network actually work?",
  description:
    "A mesh network has no centre: every node is also a relay, passing each message hop by hop across whatever links are up. An interactive look at how meshes route today — and a grounded thought experiment about what we'd rebuild if the stack fell.",
};

export default function MeshNetworksPage() {
  return (
    <>
      <PageHeader
        index="04"
        kicker="On infrastructure"
        title="How does a mesh network actually work?"
        lede="Most networks have a middle: a tower, an exchange, a cable landing where everything converges. A mesh has none. Every node is also a relay, and a message finds its way across the web one hop at a time, taking whatever path happens to be alive. This piece comes in two halves — first how that works today, then what we'd build from the pieces if the centralised stack ever fell away."
      />

      {/* ——— Short answer ——— */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                A mesh is a network with no centre. Every node{" "}
                <span className="italic text-accent">
                  relays for its neighbours
                </span>
                , so a message hops from node to node across whatever links are
                up — and reroutes the moment one goes down.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">The hard part isn&rsquo;t hops</span>
                <p className="type-body mt-2">
                  It&rsquo;s deciding <span className="text-bone">which</span> hop.
                  Three stances divide the field:
                </p>
              </div>
              <div className="rule" />
              <ul className="flex flex-col gap-3 type-body">
                <li>
                  <span className="text-bone">Reactive</span> — find a route only
                  when you need it.
                </li>
                <li>
                  <span className="text-bone">Proactive</span> — keep every route
                  ready in advance.
                </li>
                <li>
                  <span className="text-bone">Delay-tolerant</span> — carry the
                  message until a link appears.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— § I The mechanism ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">The mechanism</h2>
            </div>
            <span className="type-mono-sm">What a mesh actually is</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Before any clever routing, the radio sets the budget. Every mesh
            link picks two of three things — range, bandwidth, power — and pays
            for it in the third. There is no radio that gives you all three.
          </p>
        </Reveal>

        {/* Physical layer cards */}
        <Reveal delay={0.15}>
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
            {PHY_LAYERS.map((p) => (
              <div
                key={p.name}
                className="flex flex-col gap-3 border border-line p-6"
                style={{ background: "rgba(15, 15, 18, 0.6)" }}
              >
                <span className="type-mono-sm text-accent">{p.name}</span>
                <div>
                  <div className="type-numeral text-[1.6rem] leading-none text-bone">
                    {p.rate}
                  </div>
                  <div className="type-mono-sm mt-2 normal-case tracking-normal text-bone-3">
                    {p.range}
                  </div>
                </div>
                <p className="type-body text-bone-3">
                  Buys <span className="text-bone">{p.buys}</span>, pays in{" "}
                  {p.pays}.
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-12 type-lede max-w-2xl">
            On top of the radio sits the routing logic — the part that decides
            where each hop goes. The three stances are genuinely different
            philosophies, not just tunings.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
          <Reveal delay={0.08}>
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-[1.3rem] text-bone">Reactive</h3>
              <p className="type-body">
                <span className="text-bone-2">AODV</span> keeps no route it
                isn&rsquo;t using. When it needs to reach someone new, it floods
                a request outward and waits for a reply. Cheap when idle; a beat
                of latency the first time you call.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-[1.3rem] text-bone">Proactive</h3>
              <p className="type-body">
                <span className="text-bone-2">OLSR</span> and{" "}
                <span className="text-bone-2">BATMAN</span> keep the map warm,
                gossiping constantly so a route is always ready. BATMAN goes
                further: no single node holds the whole map — each only learns
                the best direction.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-[1.3rem] text-bone">
                Delay-tolerant
              </h3>
              <p className="type-body">
                When there is no path at all, <span className="text-bone-2">DTN</span>{" "}
                gives up on routing in the moment. It stores the message,
                carries it, and forwards it when a link finally appears — store,
                carry, forward.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <ProtocolCompare />
          </div>
        </Reveal>

        {/* Topology interactive */}
        <Reveal delay={0.08}>
          <p className="mt-14 type-lede max-w-2xl">
            Here is the part prose can&rsquo;t do. Below is a small mesh: a
            client at the lower left, a gateway at the upper right, and the
            shortest live path between them drawn in gold. Take relays offline
            and watch the route bend around the damage — until it can&rsquo;t.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <TopologyDemo />
          </div>
        </Reveal>

        {/* Identity */}
        <Reveal delay={0.08}>
          <h3 className="mt-16 type-heading text-bone">
            The quiet hard part: who are you talking to?
          </h3>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
            <p className="type-body max-w-xl">
              Moving packets turns out to be the easy half. The web you&rsquo;re
              reading this on trusts identity through certificate authorities —
              your browser ships with over a hundred root certificates and
              believes whatever they sign. It&rsquo;s a clean model with a
              central dependency baked in. A mesh can&rsquo;t assume those
              authorities exist.
            </p>
            <p className="type-body max-w-xl">
              The alternatives are older and stranger. A{" "}
              <span className="text-bone">web of trust</span> — Phil
              Zimmermann&rsquo;s idea from 1992 — lets people sign each
              other&rsquo;s keys until trust emerges from the graph. Stacks like{" "}
              <span className="text-bone">Reticulum</span> drop names entirely: a
              destination simply <span className="italic text-accent">is</span> a
              128-bit hash of a public key, and everything is encrypted by
              default. No authority, no permission, no centre.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ——— § II The field today ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">The field today</h2>
            </div>
            <span className="type-mono-sm">Running now</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            None of this is hypothetical. Mesh networks already carry real
            traffic at wildly different scales — a continental commons, a
            borough-sized ISP, a mesh you can fit in a backpack.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8">
            <DeploymentMap />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            <p className="type-body">
              <span className="text-bone">Guifi.net</span> is the giant. Born in
              rural Catalonia in 2004 when villages got tired of waiting for an
              ISP, it now runs roughly 37,600 working nodes over some 73,000
              kilometres of links — telecom infrastructure held as a commons.
            </p>
            <p className="type-body">
              <span className="text-bone">NYC Mesh</span> looks more like an ISP
              than a cloud. Rooftop antennas feed about seventy hubs, which feed
              a handful of data-centre supernodes that speak BGP to the wider
              internet. All volunteers; 450-odd installs in 2024 alone.
            </p>
            <p className="type-body">
              <span className="text-bone">Meshtastic</span> is the lower bound:
              cheap LoRa radios paired to a phone, flooding messages a few hops
              with no internet, no infrastructure, and no permission. Its
              cousin, <span className="text-bone">Freifunk</span> in Germany, is
              where BATMAN was born.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ——— § III The thought experiment ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">The thought experiment</h2>
            </div>
            <span className="type-mono-sm text-accent">
              Speculative — not reportage
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-lede max-w-2xl">
            Now the second half — <span className="italic">what a mesh could
            be.</span> Everything from here on is a thought experiment, not a
            report. The trick is that none of the building blocks are invented:
            each one already runs today. The only speculation is in composing
            them into a replacement for a stack that vanished.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-8 type-body max-w-2xl">
            So: suppose the cell networks, the trans-Atlantic fibre, and the
            consumer ISPs all went dark tomorrow. A plausible rebuild
            wouldn&rsquo;t start from a blank page — it would reach for the parts
            already lying around. You&rsquo;d probably run{" "}
            <span className="text-bone">LoRa for the long-haul backbone</span>:
            kilobits per second, but kilometres per hop. Inside a neighbourhood,
            density would likely call for something{" "}
            <span className="text-bone">BATMAN-shaped</span> — self-configuring,
            no node needing the whole map. Across regions with no live path,
            traffic would fall back to{" "}
            <span className="text-bone">delay-tolerant sneakernet</span>: a drive
            carries the bundles the radio can&rsquo;t. And identity would have to
            be <span className="text-bone">cryptographic rather than
            certified</span> — a web of trust, or Reticulum-style hashes of
            public keys, standing in for the certificate authorities that are no
            longer there.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 grid gap-px overflow-hidden border border-line md:grid-cols-2">
            <div className="p-6 md:p-8" style={{ background: "rgba(15, 15, 18, 0.6)" }}>
              <span className="type-mono-sm text-accent">What survives</span>
              <ul className="mt-4 flex flex-col gap-3 type-body">
                <li>Messaging and email-shaped traffic</li>
                <li>Local and regional services</li>
                <li>Cryptographic identity and signatures</li>
              </ul>
            </div>
            <div className="p-6 md:p-8" style={{ background: "rgba(15, 15, 18, 0.6)" }}>
              <span className="type-mono-sm">What doesn&rsquo;t</span>
              <ul className="mt-4 flex flex-col gap-3 type-body text-bone-3">
                <li>Streaming-grade latency</li>
                <li>CDN-era single-page apps</li>
                <li>Centralised card payments</li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-8 type-body max-w-2xl text-bone-3">
            That&rsquo;s the honest part. What you&rsquo;d rebuild isn&rsquo;t a
            copy of the internet we have — it&rsquo;s a slower, choppier,
            message-shaped one. Different, not restored. But, on the evidence of
            § II, entirely buildable.
          </p>
        </Reveal>
      </section>

      {/* ——— § IV Credits & inspirations ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ IV</span>
              <h2 className="type-heading text-bone">Credits & inspirations</h2>
            </div>
            <span className="type-mono-sm">Named, not lifted</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
            <article className="border border-line p-6 md:p-7" style={{ background: "rgba(15, 15, 18, 0.6)" }}>
              <span className="type-mono-sm text-accent">Television</span>
              <h3 className="font-serif text-[1.35rem] leading-tight text-bone mt-3">
                Pantheon
              </h3>
              <p className="type-body mt-4">
                The most serious recent screen treatment of post-cloud
                infrastructure. Its second season opens with a homemade local
                network stitched together after the global internet goes dark —
                very nearly this article&rsquo;s thought experiment. Credited as
                inspiration only: no dialogue, frames, or character designs
                appear here.
              </p>
            </article>
            <article className="border border-line p-6 md:p-7" style={{ background: "rgba(15, 15, 18, 0.6)" }}>
              <span className="type-mono-sm text-accent">Books & lineage</span>
              <h3 className="font-serif text-[1.35rem] leading-tight text-bone mt-3">
                Walkaway, and the cypherpunks
              </h3>
              <p className="type-body mt-4">
                Cory Doctorow&rsquo;s <span className="italic">Walkaway</span>{" "}
                (2017) supplies the political imagination of bottom-up
                infrastructure; the cypherpunk lineage — May, Hughes, Gilmore —
                supplies the older conviction that trust can be built from
                cryptography rather than granted by an authority.
              </p>
            </article>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 type-body max-w-2xl text-bone-3">
            The current cyberpunk revival — the salvaged-hardware,
            post-everything mood drifting across TikTok edits and Are.na
            channels — is the aesthetic weather this piece was written in. It is
            described here in our own words. Nothing was scraped or embedded.
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
              <h3 className="type-mono">Protocols & standards</h3>
              <ul className="mt-5 flex flex-col gap-3 type-body">
                {SOURCES.map((s) => (
                  <li key={s.href} className="flex flex-col">
                    <span className="font-serif text-bone text-[1.05rem]">
                      {s.title}
                    </span>
                    <SourceOutboundLink
                      href={s.href}
                      className="type-mono-sm text-bone-3 hover:text-accent transition-colors"
                    >
                      {hostname(s.href)} ↗
                    </SourceOutboundLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="type-mono">Notes & method</h3>
              <ul className="mt-5 flex flex-col gap-4 type-body max-w-lg">
                <li>
                  The topology demo is a synthetic, illustrative layout. Its
                  route is the shortest surviving path computed with
                  Dijkstra&rsquo;s algorithm — a teaching model. Real meshes
                  route in a distributed way (AODV, OLSR, BATMAN), and
                  Meshtastic doesn&rsquo;t compute paths at all: it floods,
                  rebroadcasting anything it hasn&rsquo;t already seen.
                </li>
                <li>
                  Physical-layer figures are ranges because real range depends
                  on terrain and configuration. LoRa rates follow the LoRaWAN
                  specification; the 250 kbit/s figure is the IEEE 802.15.4
                  2.4 GHz PHY.
                </li>
                <li>
                  Deployment figures are each operator&rsquo;s own. Guifi.net
                  node and link counts are from its live statistics, mid-2026.
                  Map positions are illustrative, not geographic.
                </li>
                <li>
                  § III is labelled speculation throughout. Every scenario there
                  is built from a component established in §§ I–II; none of it is
                  a claim about the present.
                </li>
                <li>
                  <span className="italic">Pantheon</span> and the cyberpunk
                  revival are credited as inspiration. No third-party dialogue,
                  imagery, or design appears anywhere on this page.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

const SOURCES: { title: string; href: string }[] = [
  { title: "RFC 3561 — AODV reactive routing", href: "https://datatracker.ietf.org/doc/html/rfc3561" },
  { title: "RFC 3626 — OLSR proactive routing", href: "https://datatracker.ietf.org/doc/html/rfc3626" },
  { title: "RFC 4838 — Delay-tolerant networking", href: "https://datatracker.ietf.org/doc/html/rfc4838" },
  { title: "RFC 9171 — Bundle Protocol v7", href: "https://datatracker.ietf.org/doc/html/rfc9171" },
  { title: "B.A.T.M.A.N.-adv (open-mesh.org)", href: "https://www.open-mesh.org/projects/batman-adv/wiki" },
  { title: "LoRa & LoRaWAN — Semtech overview", href: "https://www.semtech.com/uploads/technology/LoRa/lora-and-lorawan.pdf" },
  { title: "IEEE 802.15.4 — low-rate PHY/MAC", href: "https://standards.ieee.org/ieee/802.15.4/7029/" },
  { title: "Reticulum — cryptographic networking", href: "https://reticulum.network/" },
];

function hostname(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}
