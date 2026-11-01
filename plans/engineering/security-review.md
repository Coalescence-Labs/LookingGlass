---
title: Engineering — Security review of public surface
status: done
category: engineering
effort: M
last-updated: 2026-11-01
---

## Context

Looking Glass has one server-side entry point: `POST /api/submit` (see
`src/app/api/submit/route.ts`). Everything else is static. Abuse
concentrates on that route, so we ran a one-time public-surface review
before traffic ramps up.

**Findings live in Ergon, not this repo** — the git tree stays free of
vulnerability write-ups once the repo is public.

## Goal

Complete a threat-model style review of the submission pipeline, client
surface, and build/deploy configuration; file the write-up and follow-ups
in Ergon.

## Outcome

- Research doc (private): Ergon —
  [Looking Glass public-surface security review](https://ergon.coalescencelabs.app/doc/looking-glass/looking-glass-public-surface-security-review-2026-04-18.md)
- Review ticket (Done): [COA-463](https://ergon.coalescencelabs.app/issue/COA-463)
- Follow-ups: [COA-464](https://ergon.coalescencelabs.app/issue/COA-464) (CSP/headers),
  [COA-465](https://ergon.coalescencelabs.app/issue/COA-465) (email validation),
  [COA-466](https://ergon.coalescencelabs.app/issue/COA-466) (Vercel ops),
  [COA-467](https://ergon.coalescencelabs.app/issue/COA-467) (IP log minimization)
- Public GitHub PR that would have published findings was closed without merge:
  https://github.com/Coalescence-Labs/LookingGlass/pull/4

## Acceptance

- [x] Review completed and stored in Ergon (not under `research/`).
- [x] Findings ranked; remaining hardening tracked as Ergon issues.
- [x] No critical-severity finding left without a follow-up ticket.

## References

- OWASP Cheatsheet Series — https://cheatsheetseries.owasp.org/
- MDN: Security on the web — https://developer.mozilla.org/docs/Web/Security
- Vercel security docs — https://vercel.com/docs/security
- Resend API reference — https://resend.com/docs/api-reference

## Closing

2026-11-01 · findings relocated to Ergon; `research/security-review.md`
removed from the public tree.
