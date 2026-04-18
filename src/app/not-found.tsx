import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Off the page",
  description: "The link you followed doesn't lead anywhere on this archive.",
};

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <div className="flex items-center gap-3 type-mono-sm">
        <span className="inline-block h-px w-8 bg-line-2" />
        <span>Error 404 · not found</span>
      </div>

      <h1 className="mt-10 type-display-l text-bone max-w-4xl">
        Off the page.
      </h1>

      <p className="mt-6 type-lede max-w-xl">
        The link you followed doesn&rsquo;t lead anywhere on the archive. It
        may have been renamed, retired, or never existed. Happens to the best
        of us.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 border border-line-2 bg-glass px-5 py-3 font-sans text-sm text-bone transition-all hover:border-accent hover:text-accent"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-[2px]">
            ←
          </span>
          <span>Back to the index</span>
        </Link>
        <Link
          href="/about"
          className="type-mono-sm text-bone-3 transition-colors hover:text-accent"
        >
          About Looking Glass →
        </Link>
      </div>
    </section>
  );
}
