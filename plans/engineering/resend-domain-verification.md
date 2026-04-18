---
title: Engineering — Verified sender domain for Resend
status: in-progress
category: engineering
effort: S
last-updated: 2026-04-18
---

## Context

Submission emails currently come from the shared sender
`onboarding@resend.dev` (see `SUBMIT_FROM_EMAIL` default in
`src/app/api/submit/route.ts`). That works but:

- Harder for Gmail's spam filters to trust. Some submissions will end
  up in the Promotions tab or worse.
- Can't set custom reply routing, DMARC, or the "from" display name
  cleanly.
- A shared sender means any Resend account using the same address could
  affect deliverability.

The fix is a verified sub-domain (e.g. `hello@lookingglass.coalescencelabs.app`
or `mail.lookingglass.coalescencelabs.app`) with SPF, DKIM, and DMARC
configured via DNS.

## Goal

Submission emails arrive from a `@lookingglass.coalescencelabs.app`
address, pass SPF/DKIM/DMARC, and render with a clean "Looking Glass"
display name in Gmail.

## Approach

1. **Pick the sending domain.** Options:
   - `hello@lookingglass.coalescencelabs.app` (uses the site's domain
     directly; cleanest).
   - `mail.lookingglass.coalescencelabs.app` (sub-sub-domain; isolates
     sending from any future web mail config).
   Default to the first.
2. **Add the domain in Resend.** Dashboard → Domains → Add Domain.
   Resend will emit the required DNS records (SPF TXT, DKIM CNAMEs,
   optional DMARC TXT).
3. **Add DNS records.** In the domain's DNS (likely Vercel or the
   registrar): add each record Resend provides, wait for propagation.
4. **Verify in Resend.** Click "Verify DNS" in the dashboard. All
   records must show green.
5. **Flip the env vars** (in Vercel project settings and `.env.local`):
   - `SUBMIT_FROM_EMAIL=hello@lookingglass.coalescencelabs.app`
6. **Test end-to-end.** Submit a test idea via `/about` and verify:
   - It arrives from the new address.
   - Gmail shows "verified by lookingglass.coalescencelabs.app" on the
     message header.
   - Reply-to still routes to the submitter's email when they filled it.

## Files

**Modify (Vercel env only — no code change needed):**
- Vercel project → Settings → Environment Variables → `SUBMIT_FROM_EMAIL`.
- `.env.local` (local dev) — same.

Optional code touch:
- `src/app/api/submit/route.ts` — only if we want to change the display
  name format ("Looking Glass" vs "Looking Glass <hello@…>").

## Acceptance

- [ ] Resend domain status = verified.
- [ ] SPF, DKIM, DMARC all pass — check message headers in Gmail
      ("Show original").
- [ ] Test submission arrives in primary inbox, not spam.
- [ ] Reply-to still works (reply goes to the submitter, not to
      `hello@…`).

## References

- Resend domain verification docs —
  https://resend.com/docs/dashboard/domains/introduction
- SPF — https://datatracker.ietf.org/doc/html/rfc7208
- DKIM — https://datatracker.ietf.org/doc/html/rfc6376
- DMARC — https://datatracker.ietf.org/doc/html/rfc7489
- Internal: `src/app/api/submit/route.ts`.
