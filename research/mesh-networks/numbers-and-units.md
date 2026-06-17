---
topic: "Numbers and units — quantified claims ledger"
plan: plans/concepts/mesh-networks.md
date: 2026-06-17
agent: cursor
status: draft
chunk: numbers
related-chunks:
  - 01-physical-layer.md
  - 04-deployments.md
---

## Summary

Every quantity that may appear in copy, a stat callout, or an interactive,
with sources. Ranges are cited as ranges (terrain- and region-dependent);
no single hero number is invented.

## Ledger

| Claim ID | Value | Units | Source A | Source B | Notes | Safe for page |
|----------|-------|-------|----------|----------|-------|---------------|
| C-01 | 0.3 – 50 | kbps | LoRa Alliance 1.0.3 | Lee & Choi 2020 | LoRaWAN data-rate span | yes |
| C-02 | SF7 – SF12 | spreading factor | Semtech | Meshtastic docs | SF7=128 symbols, SF12=4096 | yes |
| C-03 | ~2–5 (urban) / 15–20 (rural LOS) | km | Semtech | Lee & Choi 2020 | Cite as band, terrain-dependent | yes — hedge |
| C-04 | 250 | kbit/s | IEEE 802.15.4-2006 | iotclass | 2.4 GHz O-QPSK/DSSS PHY | yes |
| C-04b | 127 | bytes | IEEE 802.15.4-2006 | — | Max frame size | yes |
| C-05 | ~10–100 | m | IEEE refs | Thread/Zigbee refs | Typical range | yes — hedge |
| C-12b | 2.6.38 | Linux kernel version | Wikipedia BATMAN (kernel docs) | — | batman-adv mainlined | yes |
| C-22b | 128 | bits | Reticulum Manual | — | Destination = truncated SHA-256 hash | yes |
| C-30a | ~37,652 | working nodes | Guifi stats | Wikipedia Guifi | Date "mid-2026"; round to ~37,600 | yes |
| C-30b | ~73,133 | km of wireless links | Guifi stats | — | Round to ~73,000 km | yes |
| C-30c | 2004 | year founded | Wikipedia Guifi | — | Osona, Catalonia | yes |
| C-31a | ~70 | hubs | NYC Mesh 2024 review | NYC Mesh wiki | Plus a few supernodes | yes |
| C-31b | 450+ | installs in 2024 | NYC Mesh 2024 review | — | From 1,852 join requests | yes |
| C-31c | 40 | Gbit/s | NYC Mesh 2024 review | — | One supernode's uplink | yes |
| C-31d | 2014 | year founded | NYC Mesh | — | — | yes |
| C-32a | ~30 | packets | Meshtastic docs | — | Per-radio store when no client | yes |
| C-32b | 3 | retransmits | Meshtastic docs | — | If no ack heard | yes |
| C-32c | 2020 | year first released | Meshtastic docs/project | — | Medium confidence | yes — hedge |
| C-40a | 2 / 16 | seasons / episodes | Wikipedia Pantheon | — | S1 2022, S2 2023 | yes |
| C-41a | 2017 | year | Wikipedia Walkaway | — | Tor Books | yes |
| C-42a | 1992 / 1993 | mailing list / manifesto | Wikipedia Cypherpunk | — | Verify in review | yes — hedge |

## Notes

- TopologyDemo node count: plan asks for 30–60 nodes. This is a *synthesised*
  topology for teaching, not a real-world measurement — not a sourced number.
  Document in `#sources` as an illustrative layout.
- Hop counts shown by the interactive are computed live from the synthetic graph,
  not claims about any real deployment.
