"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SmartTime } from "@/components/SmartTime";
import { MoonDoodle, StarDoodle } from "@/components/Doodles";

/**
 * Section 1 — "Sicán te acompaña".
 * A bright, friendly "night-in-light" scene: sky-blue backdrop, an amber moon
 * and twinkling stars, with Sicán (the mascot) as the protagonist. Signature
 * interaction: the mascot tilts gently toward the cursor (magnetic, capped),
 * over a steady idle bob. Falls back to idle-only on touch / reduced-motion.
 */
export function Hero() {
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mascotRef.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches
    ) {
      return; // idle float only (CSS)
    }

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smooth = { ...mouse };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const loop = () => {
      smooth.x += (mouse.x - smooth.x) * 0.08;
      smooth.y += (mouse.y - smooth.y) * 0.08;
      const rect = el.getBoundingClientRect();
      const dx = smooth.x - (rect.left + rect.width / 2);
      const dy = smooth.y - (rect.top + rect.height / 2);
      const tx = clamp(dx / 30, -8, 8);
      const ty = clamp(dy / 30, -8, 8);
      const rot = clamp(dx / 40, -4, 4);
      el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative flex min-h-[92dvh] w-full items-center overflow-hidden bg-sky">
      {/* z-0 — sky fading to paper */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-gradient-to-b from-sky via-sky to-paper"
      />

      {/* z-10 — moon + stars */}
      <MoonDoodle className="animate-float-soft pointer-events-none absolute right-[6%] top-[10%] z-10 h-24 w-24 sm:h-32 sm:w-32" />
      <StarDoodle className="animate-twinkle pointer-events-none absolute left-[10%] top-[18%] z-10 h-6 w-6" />
      <StarDoodle className="animate-twinkle pointer-events-none absolute left-[22%] top-[32%] z-10 h-4 w-4 [animation-delay:0.6s]" />
      <StarDoodle className="animate-twinkle pointer-events-none absolute right-[24%] top-[26%] z-10 h-5 w-5 [animation-delay:1.1s]" />
      <StarDoodle className="animate-twinkle pointer-events-none absolute right-[14%] bottom-[22%] z-10 h-4 w-4 [animation-delay:0.3s]" />

      {/* content */}
      <div className="relative z-30 mx-auto grid w-full max-w-7xl items-center gap-8 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Sicán — appears first on mobile (order), beside copy on desktop */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div ref={mascotRef} className="[will-change:transform]">
            <div className="animate-float-soft">
              <Image
                src="/mascota.png"
                alt="Sicán, la mascota de D'Madrugada, listo para tu pedido"
                width={420}
                height={420}
                priority
                sizes="(max-width: 1024px) 60vw, 40vw"
                className="h-auto w-[min(60vw,26rem)] object-contain drop-shadow-[6px_10px_0_rgba(10,87,194,0.18)]"
              />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p
            className="pop badge-amber text-xs uppercase tracking-[0.16em]"
            style={{ animationDelay: "0.05s" }}
          >
            Chiclayo · Delivery nocturno
          </p>
          <h1
            className="pop mt-5 font-display text-[clamp(2.75rem,9vw,7rem)] font-extrabold leading-[0.95] text-ink"
            style={{ animationDelay: "0.15s" }}
          >
            Tu antojo
            <br />
            <span className="text-blue">no duerme</span>
          </h1>
          <p
            className="pop mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg lg:mx-0"
            style={{ animationDelay: "0.28s" }}
          >
            Delivery en Chiclayo de 9:00 PM a 4:30 AM. Alitas, chaufa, broaster y
            más — calientito hasta tu puerta cuando todo lo demás ya cerró.
          </p>
          <div
            className="pop mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center"
            style={{ animationDelay: "0.4s" }}
          >
            <WhatsAppButton size="lg" />
            <Link
              href="/carta"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-blue px-7 text-base font-bold text-blue-ink transition hover:bg-blue/10"
            >
              Ver la carta
            </Link>
          </div>
          <div
            className="pop mt-7 flex justify-center lg:justify-start"
            style={{ animationDelay: "0.52s" }}
          >
            <SmartTime />
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute inset-x-0 bottom-6 z-30 flex flex-col items-center gap-2 text-muted">
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.24em]">
          Desliza
        </span>
        <ChevronDown className="h-5 w-5 animate-bob" />
      </div>
    </section>
  );
}
