"use client";

import { useState, type FormEvent } from "react";
import { trackSubmissionSent } from "@/lib/analytics";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const KINDS = [
  { id: "mechanism", label: "Mechanism" },
  { id: "system", label: "System" },
  { id: "phenomenon", label: "Phenomenon" },
  { id: "software", label: "Software" },
  { id: "other", label: "Other" },
] as const;

type KindId = (typeof KINDS)[number]["id"];

export function SubmissionForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [kind, setKind] = useState<KindId | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const idea = String(data.get("idea") ?? "").trim();
    if (!idea) {
      setState({ kind: "error", message: "Please add an idea before sending." });
      return;
    }

    setState({ kind: "submitting" });

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          name: String(data.get("name") ?? "").trim() || null,
          email: String(data.get("email") ?? "").trim() || null,
          kind,
          website: String(data.get("website") ?? ""),
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Something went wrong on our end.");
      }

      trackSubmissionSent();
      setState({ kind: "success" });
      form.reset();
      setKind(null);
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong on our end.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <div
        className="border border-line p-6 md:p-10"
        style={{ background: "rgba(15, 15, 18, 0.6)" }}
      >
        <span className="type-mono-sm text-accent">Thanks — received</span>
        <p className="mt-4 type-lede max-w-xl">
          It landed in our inbox. We read everything, though we don&rsquo;t
          reply to every note. If an idea turns into a piece, you&rsquo;ll see
          it on the archive.
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: "idle" })}
          className="mt-6 type-mono-sm text-bone-3 transition-colors hover:text-accent"
        >
          ← Submit another
        </button>
      </div>
    );
  }

  const submitting = state.kind === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      {/* honeypot — invisible to humans, catches bots */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      <div className="flex flex-col gap-6">
        <Field label="The idea" htmlFor="idea" required>
          <textarea
            id="idea"
            name="idea"
            rows={5}
            required
            placeholder="Something most people live alongside without looking inside. A mechanism, a phenomenon, a system…"
            className="w-full resize-y bg-transparent px-0 py-3 type-body text-bone placeholder:text-muted focus:outline-none"
            style={{
              borderBottom: "1px solid var(--color-line-2)",
            }}
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Your name" htmlFor="name">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Optional"
              className="w-full bg-transparent px-0 py-3 type-body text-bone placeholder:text-muted focus:outline-none"
              style={{
                borderBottom: "1px solid var(--color-line-2)",
              }}
            />
          </Field>

          <Field label="Your email" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Only if you'd like a reply"
              className="w-full bg-transparent px-0 py-3 type-body text-bone placeholder:text-muted focus:outline-none"
              style={{
                borderBottom: "1px solid var(--color-line-2)",
              }}
            />
          </Field>
        </div>

        <div>
          <span className="type-mono-sm">What kind of thing?</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {KINDS.map((k) => {
              const on = kind === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(on ? null : k.id)}
                  className="type-mono-sm px-3 py-1.5 transition-colors"
                  style={{
                    border: `1px solid ${on ? "var(--color-accent)" : "var(--color-line)"}`,
                    color: on ? "var(--color-accent)" : "var(--color-bone-3)",
                    background: on
                      ? "rgba(228,199,138,0.06)"
                      : "var(--color-glass)",
                  }}
                >
                  {k.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="type-mono-sm max-w-md text-bone-3">
            We read everything. Thoughtful notes over polished pitches —
            we&rsquo;re after the idea, not the wrapper.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex items-center justify-center gap-3 border border-line-2 bg-glass px-5 py-3 font-sans text-sm text-bone transition-all hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{submitting ? "Sending…" : "Send it over"}</span>
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-[2px]"
            >
              →
            </span>
          </button>
        </div>

        {state.kind === "error" && (
          <p className="type-mono-sm text-accent">
            {state.message} Or email us directly at{" "}
            <a
              href="mailto:coalescencelabs@gmail.com"
              className="underline decoration-line-2 underline-offset-4 hover:decoration-accent"
            >
              coalescencelabs@gmail.com
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-2">
      <span className="type-mono-sm">
        {label}
        {required && <span className="ml-2 text-accent">·</span>}
      </span>
      {children}
    </label>
  );
}
