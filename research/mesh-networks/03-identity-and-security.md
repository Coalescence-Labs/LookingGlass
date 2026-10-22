---
topic: "Identity and security without certificate authorities"
plan: plans/concepts/mesh-networks.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 03
related-chunks:
  - 02-routing-protocols.md
  - 06-speculative-rebuild.md
---

## Summary

The hardest problem in a bottom-up network isn't moving packets — it's knowing
who you're talking to. Today's web leans on a *certificate authority* hierarchy:
your browser ships with 100+ root certificates and trusts anything they sign.
That's a clean model with a central dependency. Two alternatives survive without
it. The **web of trust** (PGP/OpenPGP, proposed by Phil Zimmermann in 1992)
makes trust *emergent* — people sign each other's keys, and you decide whom to
believe. Cryptographic-identity stacks like **Reticulum** dispense with names
and authorities entirely: a destination *is* a 128-bit truncated SHA‑256 hash
derived from a public key, encryption is end-to-end by default (ECC + AES,
Curve25519), and there is "no central point of authority, control, censorship
or barrier to entry."

## Method

- Wikipedia, *Web of trust*, read 2026-06-17 — PGP/OpenPGP model, Zimmermann 1992, CA contrast, 100+ root certs.
- Reticulum Manual, *Understanding Reticulum*, read 2026-06-17 — destinations as 16-byte (128-bit) truncated SHA-256 hashes, ECC+AES, Curve25519, forward secrecy, no central authority.
- Meshtastic, *Overview* (docs), read 2026-06-17 — per-channel PSK (AES) encryption.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-20 | The web's default trust model is centralised: browsers ship 100+ CA root certificates and trust the chains below them | high | Wikipedia Web of trust | — | X.509 PKI |
| C-21 | The web of trust is a decentralised alternative (PGP/OpenPGP), proposed by Phil Zimmermann in 1992; trust is emergent from peer key-signing | high | Wikipedia Web of trust | — | "decentralized fault-tolerant web of confidence" |
| C-22 | Reticulum has no certificate authority; destinations are 128-bit truncated SHA-256 hashes of public keys; traffic is ECC+AES encrypted with forward secrecy | high | Reticulum Manual | — | Curve25519, per-packet keys |
| C-23 | Meshtastic encrypts each channel with a pre-shared AES key | high | Meshtastic docs | — | Default channel has a public key |

## Findings

### 1. The CA model: clean, central (C-20)

X.509 public-key infrastructure lets a single party — a certificate authority —
sign a certificate, with that CA's own certificate signed by another, up to a
self-signed root. Browsers and operating systems ship with over a hundred root
certificates from dozens of PKIs, so TLS pages authenticate without the user
doing anything. The strength is also the weakness: trust flows down from a small
set of anchors that a bottom-up network can't assume exists.

### 2. The web of trust: emergent, decentralised (C-21)

Zimmermann's PGP (1992) proposed the opposite. There is no authority; instead,
users sign keys they've personally verified, accumulating "certifying
signatures." You configure how many endorsements (or how many partially trusted
endorsers) you require before believing a key belongs to its claimed owner.
Trust becomes a graph you navigate, not a hierarchy you inherit. The cost is
social: a brand-new key with no signatures is hard to trust until someone vouches
for it (hence key-signing parties).

### 3. Cryptographic identity: Reticulum (C-22, C-23)

Reticulum drops names and addresses altogether. Every *destination* is a 16-byte
(128-bit) hash, formed by truncating the SHA‑256 of identifying characteristics
plus the destination's public key. Knowing the hash is enough to address it;
data is encrypted by default with elliptic-curve cryptography and AES, with
forward secrecy on links via Curve25519 key exchange. The project's stated aim
is networking with "no central point of authority, control, censorship or
barrier to entry," requiring "as little coordination and trust as possible."
Meshtastic takes a simpler route for casual use: each channel carries a
pre-shared AES key, so only nodes with the key can read a message — though every
node may still relay it.

## Implications for the article

- Identity is the strongest argument that § III is hard, not just romantic.
- The CA-vs-web-of-trust contrast (C-20/C-21) is a clean two-column visual idea.
- Reticulum (C-22) is the concrete "this already exists" anchor for the
  speculative identity layer — keeps § III grounded.

## Sources

1. Wikipedia — *Web of trust*. https://en.wikipedia.org/wiki/Web_of_trust
2. Reticulum — *Understanding Reticulum* (manual). https://reticulum.network/manual/understanding.html
3. Meshtastic — *Overview*. https://meshtastic.org/docs/overview/

## Open questions

- [ ] None blocking.
