"use client";

import { useEffect, useRef } from "react";
import { SparkleDoodle } from "@/components/Doodles";

const WORDS = [
  "Alitas BBQ",
  "Chaufa",
  "Broaster",
  "Salchipapa",
  "Hamburguesa",
  "Mollejitas",
  "Aeropuerto",
  "Anticuchos",
];

/** One drifting pill row (module scope — declaring it inside the component
 *  would recreate it on every render and reset its state). */
function MarqueeRow({
  innerRef,
  variant,
}: {
  innerRef: React.RefObject<HTMLDivElement | null>;
  variant: "blue" | "amber";
}) {
  return (
    <div
      ref={innerRef}
      className="flex w-max whitespace-nowrap [will-change:transform]"
    >
      {Array.from({ length: 3 }).map((_, r) => (
        <span key={r} className="flex items-center">
          {WORDS.map((w) => (
            <span key={w + r} className="flex items-center">
              <span
                className={`mx-3 rounded-full px-5 py-2 font-display text-lg font-bold sm:text-xl ${
                  variant === "blue"
                    ? "border-2 border-blue bg-paper text-blue-ink"
                    : "bg-amber text-ink"
                }`}
              >
                {w}
              </span>
              <SparkleDoodle className="h-4 w-4" />
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

/** Section 5 — two friendly pill rows drifting opposite directions on scroll. */
export function MarqueeSabores() {
  const secRef = useRef<HTMLElement>(null);
  const row1 = useRef<HTMLDivElement>(null);
  const row2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onScroll = () => {
      const sec = secRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.18;
      if (row1.current)
        row1.current.style.transform = `translate3d(${-offset}px,0,0)`;
      if (row2.current)
        row2.current.style.transform = `translate3d(${offset - 400}px,0,0)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={secRef}
      aria-hidden
      className="flex flex-col gap-4 overflow-hidden py-14 sm:py-20"
    >
      <MarqueeRow innerRef={row1} variant="blue" />
      <MarqueeRow innerRef={row2} variant="amber" />
    </section>
  );
}
