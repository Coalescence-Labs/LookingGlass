import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const IDEA_MAX = 4000;
const FIELD_MAX = 200;

// Per-serverless-instance rate limit. Not perfect (serverless resets on cold
// starts, and scale means multiple instances) but enough to slow down naive
// scripted abuse without adding a Redis dependency for a low-volume site.
const hits = new Map<string, number[]>();

type Payload = {
  idea?: unknown;
  name?: unknown;
  email?: unknown;
  kind?: unknown;
  website?: unknown;
};

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const previous = hits.get(ip)?.filter((t) => t > windowStart) ?? [];
  if (previous.length >= RATE_LIMIT_MAX) {
    hits.set(ip, previous);
    return true;
  }
  previous.push(now);
  hits.set(ip, previous);
  return false;
}

function asString(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.slice(0, max).trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — if filled, pretend success so bots don't retry or adapt.
  if (typeof payload.website === "string" && payload.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip = getIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions — please try again later." },
      { status: 429 },
    );
  }

  const idea = asString(payload.idea, IDEA_MAX);
  if (!idea) {
    return NextResponse.json(
      { error: "Idea is required." },
      { status: 400 },
    );
  }

  const name = asString(payload.name, FIELD_MAX);
  const email = asString(payload.email, FIELD_MAX);
  const kind = asString(payload.kind, FIELD_MAX);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[submit] RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Mail service isn't configured yet." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  const from = process.env.SUBMIT_FROM_EMAIL ?? "onboarding@resend.dev";
  const to = process.env.SUBMIT_TO_EMAIL ?? "coalescencelabs@gmail.com";

  const subjectKind = kind ? ` · ${kind}` : "";
  const subject = `Looking Glass · new idea${subjectKind}`;

  const replyTo = email || undefined;

  const metaLines = [
    name && `Name: ${name}`,
    email && `Email: ${email}`,
    kind && `Kind: ${kind}`,
    `IP: ${ip}`,
    `At: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const textBody = `${idea}\n\n—\n${metaLines}`;

  const htmlBody = `
<div style="font-family: -apple-system, system-ui, sans-serif; color: #09090B; max-width: 640px;">
  <p style="white-space: pre-wrap; font-size: 16px; line-height: 1.6;">${escapeHtml(idea)}</p>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
  <dl style="font-size: 13px; color: #555; line-height: 1.6;">
    ${name ? `<div><strong>Name:</strong> ${escapeHtml(name)}</div>` : ""}
    ${email ? `<div><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>` : ""}
    ${kind ? `<div><strong>Kind:</strong> ${escapeHtml(kind)}</div>` : ""}
    <div><strong>IP:</strong> ${escapeHtml(ip)}</div>
    <div><strong>At:</strong> ${new Date().toISOString()}</div>
  </dl>
</div>`.trim();

  try {
    const { error } = await resend.emails.send({
      from: `Looking Glass <${from}>`,
      to,
      subject,
      text: textBody,
      html: htmlBody,
      replyTo,
    });

    if (error) {
      console.error("[submit] Resend error:", error);
      return NextResponse.json(
        { error: "Couldn't send the message." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong on our end." },
      { status: 500 },
    );
  }
}
