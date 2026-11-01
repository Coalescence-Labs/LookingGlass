---
title: Concept — How public-key encryption works
status: not-started
category: concept
effort: M
series: "III — Everyday machines"
last-updated: 2026-06-17
---

## Context

HTTPS, messaging, software updates — all depend on public-key
cryptography, but "math you can't reverse" is where most explainers
lose readers. The piece should cover: symmetric vs asymmetric, one-way
functions (conceptual), key pairs, encrypt-with-public / decrypt-with-
private, digital signatures (sign-with-private / verify-with-public),
and TLS handshake at a block-diagram level — without requiring modular
arithmetic.

Complements `mesh-networks` speculation (identity without a central CA)
by explaining what the normal trust stack actually does today.

## Goal

Ship `/public-key-encryption` as a Concept in Series III, with a toy
encrypt/decrypt interactive using small color-coded keys and a clear
"what an eavesdropper sees" panel.

## Approach

1. **Research.** Write `research/public-key-encryption/` citing RFC 8446
   (TLS 1.3), Bernstein's Curve25519 paper, and NIST/ENISA primers.
   Distinguish textbook RSA intuition from what's deployed (ECDH, Ed25519).
2. **Data.** `src/lib/crypto-demo.ts` — tiny finite-field or permutation
   toy cipher for demonstration only; label it explicitly as didactic,
   not production crypto.
3. **Visuals.**
   - Alice/Bob/Eve lanes (original art, not clip art).
   - Key-generation → encrypt → decrypt flow with ciphertext visible to Eve.
   - Signature verify flow as a second mode.
4. **Page** includes a short "what this is not" box (don't roll your own).

## Files

**Create:**
- `research/public-key-encryption/`
- `src/lib/crypto-demo.ts`
- `src/components/crypto/KeyExchange.tsx`
- `src/components/crypto/SignatureVerify.tsx`
- `src/app/public-key-encryption/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry under Series III.

## Acceptance

- [ ] `bun run build` clean.
- [ ] Toy demo is clearly labeled didactic; no real keys or OpenSSL calls.
- [ ] TLS 1.3 handshake shown as named phases with citations.
- [ ] No implementation code that could be mistaken for production crypto.
- [ ] Keyboard-accessible mode toggle (encrypt vs sign).

## References

- RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3.
- Bernstein et al. — Curve25519 (2006).
- Internal: `src/app/mesh-networks/page.tsx` for trust/infrastructure tone.
