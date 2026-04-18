"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error("[looking-glass] route error:", error);
  }, [error]);

  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <div className="flex items-center gap-3 type-mono-sm">
        <span className="inline-block h-px w-8 bg-line-2" />
        <span>Something came unstuck</span>
      </div>

      <h1 className="mt-10 type-display-l text-bone max-w-4xl">
        The page didn&rsquo;t load.
      </h1>

      <p className="mt-6 type-lede max-w-xl">
        An unexpected error interrupted this view. It&rsquo;s almost
        certainly on our side. Try again — if it happens twice in a row,
        we&rsquo;d appreciate a note.
      </p>

      {error.digest && (
        <p className="mt-4 type-mono-sm text-dim">
          Reference · {error.digest}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="group inline-flex items-center gap-3 border border-line-2 bg-glass px-5 py-3 font-sans text-sm text-bone transition-all hover:border-accent hover:text-accent"
        >
          <span>Try again</span>
          <span aria-hidden className="transition-transform group-hover:rotate-45">
            ↺
          </span>
        </button>
        <Link
          href="/"
          className="type-mono-sm text-bone-3 transition-colors hover:text-accent"
        >
          ← Back to the index
        </Link>
        <a
          href="mailto:coalescencelabs@gmail.com?subject=Looking%20Glass%20%E2%80%94%20something%20broke"
          className="type-mono-sm text-bone-3 transition-colors hover:text-accent"
        >
          Report it →
        </a>
      </div>
    </section>
  );
}
