import Link from "next/link";

type WordmarkProps = {
  size?: "sm" | "md";
  href?: string | null;
};

export function Wordmark({ size = "sm", href = "/" }: WordmarkProps) {
  const dim = size === "md" ? "text-[1.15rem]" : "text-[0.95rem]";
  const content = (
    <span className="inline-flex items-baseline gap-[0.55ch] font-serif leading-none tracking-[-0.02em]">
      <span className={`${dim} text-bone`}>Looking</span>
      <span className={`${dim} italic text-accent`}>Glass</span>
    </span>
  );
  if (!href) return content;
  return (
    <Link
      href={href}
      className="group inline-flex items-center transition-opacity hover:opacity-80"
      aria-label="Looking Glass — home"
    >
      {content}
    </Link>
  );
}
