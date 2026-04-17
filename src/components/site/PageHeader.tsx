import Link from "next/link";
import { SplitWords } from "@/components/motion/SplitWords";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  index: string;
  kicker: string;
  title: string;
  lede?: string;
};

export function PageHeader({ index, kicker, title, lede }: Props) {
  return (
    <header className="shell pt-14 pb-10 md:pt-20 md:pb-16">
      <Reveal delay={0} y={0} duration={0.5}>
        <div className="flex items-center gap-4 type-mono-sm">
          <Link href="/" className="text-bone-3 hover:text-bone transition-colors">
            ← Index
          </Link>
          <span className="text-dim">/</span>
          <span>{kicker}</span>
          <span className="text-dim">/</span>
          <span>{index}</span>
        </div>
      </Reveal>

      <h1 className="mt-10 type-display-l text-bone max-w-5xl">
        <SplitWords text={title} delay={0.15} />
      </h1>

      {lede && (
        <Reveal delay={0.55} duration={0.8}>
          <p className="mt-8 type-lede max-w-2xl">{lede}</p>
        </Reveal>
      )}
    </header>
  );
}
