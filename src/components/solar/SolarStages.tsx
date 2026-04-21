"use client";

import { useEffect, useRef, useState } from "react";
import { STAGES, type StageId } from "@/lib/solar";
import { HRPath } from "./HRPath";
import { StageCard } from "./StageCard";

export function SolarStages() {
  const [activeId, setActiveId] = useState<StageId>(STAGES[1].id);
  const refs = useRef<Map<StageId, HTMLDivElement>>(new Map());

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        let best: { id: StageId; ratio: number } | null = null;
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-stage-id") as StageId | null;
          if (!id) continue;
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.ratio) {
              best = { id, ratio: entry.intersectionRatio };
            }
          }
        }
        if (best) setActiveId(best.id);
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    refs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
      <div className="md:sticky md:top-20 md:self-start">
        <HRPath activeStageId={activeId} />
      </div>

      <div className="flex flex-col">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            data-stage-id={stage.id}
            ref={(el) => {
              if (el) refs.current.set(stage.id, el);
              else refs.current.delete(stage.id);
            }}
            className="py-10"
          >
            <StageCard stage={stage} />
          </div>
        ))}
      </div>
    </div>
  );
}
