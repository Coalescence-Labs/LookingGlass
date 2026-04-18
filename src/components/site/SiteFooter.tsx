import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="shell flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-md flex-col gap-3">
          <Wordmark size="md" />
          <p className="type-body text-bone-3">
            A field guide to things worth understanding. Made by{" "}
            <a
              href="https://coalescencelabs.app"
              className="text-bone underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-accent"
              target="_blank"
              rel="noreferrer"
            >
              Coalescence Labs
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 type-mono-sm md:text-right">
          <div className="flex gap-5 md:justify-end">
            <Link
              href="/"
              className="text-bone-3 transition-colors hover:text-bone"
            >
              Index
            </Link>
            <Link
              href="/about"
              className="text-bone-3 transition-colors hover:text-bone"
            >
              About
            </Link>
            <a
              href="mailto:coalescencelabs@gmail.com"
              className="text-bone-3 transition-colors hover:text-bone"
            >
              Contact
            </a>
          </div>
          <span className="text-dim">
            {new Date().getFullYear()} · All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
}
