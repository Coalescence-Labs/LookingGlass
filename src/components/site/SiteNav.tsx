import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function SiteNav() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-line backdrop-blur-xl"
      style={{ background: "rgba(9, 9, 11, 0.72)" }}
    >
      <div className="shell flex h-14 items-center justify-between">
        <Wordmark />
        <nav className="flex items-center gap-7 type-mono-sm">
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
            href="https://coalescencelabs.app"
            className="hidden text-bone-3 transition-colors hover:text-bone sm:inline"
            target="_blank"
            rel="noreferrer"
          >
            Coalescence Labs ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
