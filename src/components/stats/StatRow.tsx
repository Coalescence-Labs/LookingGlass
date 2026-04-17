import { Reveal } from "@/components/motion/Reveal";

export type StatRowItem = {
  label: string;
  value: string;
  equivalent: string;
  note?: string;
};

type Props = {
  items: StatRowItem[];
};

export function StatRow({ items }: Props) {
  return (
    <ul className="border-t border-line">
      {items.map((s, i) => (
        <li key={s.label}>
          <Reveal delay={i * 0.05} duration={0.7}>
            <div className="grid grid-cols-[1fr_auto] items-baseline gap-6 border-b border-line py-6 md:grid-cols-[1.3fr_1fr_auto] md:gap-10 md:py-7">
              <div className="flex flex-col gap-1.5">
                <span className="type-mono-sm">{s.label}</span>
                <span className="font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-bone md:text-[1.875rem]">
                  {s.equivalent}
                </span>
              </div>
              <div className="hidden text-bone-3 md:block type-body">
                {s.note}
              </div>
              <div className="justify-self-end text-right">
                <span className="type-numeral text-[2.25rem] text-bone md:text-[2.75rem]">
                  {s.value}
                </span>
                <div className="type-mono-sm">tokens</div>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
