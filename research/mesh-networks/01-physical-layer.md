---
topic: "The physical layer — what the radio chooses for you"
plan: plans/concepts/mesh-networks.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 01
related-chunks:
  - 02-routing-protocols.md
  - 04-deployments.md
---

## Summary

Before any routing decision, the radio sets the budget. Three families bound
the design space a community mesh actually uses. **LoRa** trades almost all
bandwidth for range: 0.3–50 kbps, but tens of kilometres in clear terrain.
**IEEE 802.15.4** (the radio under Zigbee and Thread) trades range for
multi-year battery life: 250 kbit/s at 2.4 GHz over tens of metres. **Wi‑Fi
mesh** trades range for throughput: tens to hundreds of Mbps, but every metre
of reach costs power and line-of-sight — which is why community Wi‑Fi meshes
live on rooftops with directional antennas. No single radio is "best"; each
picks two of {range, bandwidth, power} and pays in the third.

## Method

- LoRa Alliance, *LoRaWAN 1.0.3 Specification* (PDF), read 2026-06-17 — data-rate range.
- Semtech, *LoRa and LoRaWAN: A Technical Overview* (PDF), read 2026-06-17 — CSS, SF7–SF12, range behaviour.
- Lee, Choi et al. (2020), "An Adaptive Spreading Factor Selection Scheme…," *Sensors* (PMC7070984), read 2026-06-17 — 2 km NLOS / 20 km LOS, SF 7–12.
- IEEE Std 802.15.4‑2006 (PDF), read 2026-06-17 — 2.4 GHz O‑QPSK DSSS, 250 kb/s; 868/915 MHz 20/40/100/250 kb/s.
- Meshtastic, *Overview* (docs), read 2026-06-17 — CSS chirp description, SF7→128 symbols, SF12→4096 symbols.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-01 | LoRaWAN data rates span 0.3–50 kbps | high | LoRa Alliance 1.0.3 | Lee & Choi 2020 | Region/SF dependent |
| C-02 | LoRa modulation is Chirp Spread Spectrum, spreading factors SF7–SF12 | high | Semtech | Meshtastic docs | Higher SF = more range, lower rate |
| C-03 | LoRa range ≈ 2–5 km urban, 15–20 km rural line-of-sight | medium | Semtech | Lee & Choi 2020 | Terrain-dependent; cite as band |
| C-04 | 802.15.4 2.4 GHz PHY: 250 kbit/s, O‑QPSK/DSSS, 127-byte max frame | high | IEEE 802.15.4-2006 | iotclass 802.15.4 | Shared base for Zigbee/Thread |
| C-05 | 802.15.4 typical range ≈ 10–100 m | medium | IEEE refs | Thread/Zigbee refs | Environment-dependent |

## Findings

### 1. LoRa — range bought with bandwidth (C-01, C-02, C-03)

LoRa modulates data onto a *chirp* — a tone that sweeps across the channel
bandwidth. The spreading factor (SF7 to SF12) sets how many chirps encode each
symbol: SF7 gives 2⁷ = 128 possible symbols, SF12 gives 2¹² = 4096. Higher SF
means each symbol lasts longer, which buys processing gain (more range,
better noise tolerance) at the direct cost of data rate. LoRaWAN's published
rates run from 0.3 kbps up to 50 kbps. Real-world range depends entirely on
terrain: roughly 2 km in dense urban / non-line-of-sight conditions, climbing
to 15–20 km with rural line of sight. The lesson for the article: LoRa is a
*telegraph*, not a *pipe* — perfect for short messages over long distances,
useless for anything streaming.

### 2. IEEE 802.15.4 — battery bought with range (C-04, C-05)

802.15.4 defines only the PHY and MAC; Zigbee, Thread, and 6LoWPAN build their
networking on top. The 2.4 GHz PHY runs at 250 kbit/s using O‑QPSK with direct
sequence spread spectrum, 16 channels, and a tight 127-byte maximum frame.
Sub-GHz variants (868/915 MHz) run slower (20/40/100/250 kb/s). The design
target is years of battery life on a coin cell, which caps range at roughly
10–100 m per hop. This is the radio of the smart home — many cheap, sleepy
nodes relaying small packets.

### 3. Wi‑Fi mesh — throughput bought with reach

Wi‑Fi mesh (802.11s and vendor variants) delivers Wi‑Fi-class throughput (tens
to hundreds of Mbps) but spends power and line-of-sight to get reach. Community
ISPs like NYC Mesh push the envelope with directional 5 GHz point-to-point
links and rooftop sector antennas, reaching across neighbourhoods — but only
because the antennas can see each other. See `04-deployments.md` for the gear.

## Implications for the article

- The physical layer is the first thing `ProtocolCompare` should make visceral:
  pick two of {range, bandwidth, power}.
- Stat callouts: LoRa 0.3–50 kbps (C-01); 802.15.4 250 kbit/s (C-04).
- Frame LoRa as "long-haul telegraph," 802.15.4 as "home whisper-net," Wi‑Fi
  mesh as "rooftop backbone." Feeds § III's long-haul-backbone argument.

## Sources

1. LoRa Alliance — *LoRaWAN 1.0.3 Specification*. https://lora-alliance.org/wp-content/uploads/2020/11/lorawan1.0.3.pdf
2. Semtech — *LoRa and LoRaWAN: A Technical Overview*. https://www.semtech.com/uploads/technology/LoRa/lora-and-lorawan.pdf
3. Lee, H.-C.; Choi, J. et al. (2020). "An Adaptive Spreading Factor Selection Scheme for a Single Channel LoRa Modem." *Sensors* 20(4). PMC7070984.
4. IEEE Std 802.15.4‑2006. https://people.ece.ubc.ca/edc/7860/data/802.15.4-2006.pdf
5. Meshtastic — *Overview*. https://meshtastic.org/docs/overview/

## Open questions

- [ ] Add a primary 802.11s throughput/range citation if Wi‑Fi mesh gets its own
  stat callout (currently treated qualitatively).
