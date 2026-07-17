import { Reveal } from "@/components/Reveal";
import { MoonDoodle } from "@/components/Doodles";
import { SITE } from "@/lib/site";

/** Section 3 — friendly hours card (9:00 PM → 4:30 AM). */
export function RelojMadrugada() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <Reveal>
        <div className="sticker p-8 text-center sm:p-12">
          <MoonDoodle className="animate-float-soft mx-auto h-14 w-14" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-ink">
            Nuestro horario
          </p>
          <div className="mt-3 font-display text-[clamp(1.9rem,6vw,3.5rem)] font-extrabold leading-none text-ink">
            {SITE.hoursText}
          </div>

          {/* progress: 8 PM → 5 AM, window highlighted */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative h-2.5 rounded-full bg-hair">
              <div
                className="absolute inset-y-0 rounded-full bg-gradient-to-r from-blue to-amber"
                style={{ left: "11%", width: "83%" }}
              />
              <span
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-blue"
                style={{ left: "11%" }}
              />
              <span
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-amber"
                style={{ left: "94%" }}
              />
            </div>
            <div className="mt-3 flex justify-between text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">
              <span>8 PM</span>
              <span>madrugada</span>
              <span>5 AM</span>
            </div>
          </div>

          <p className="mt-8 text-ink/80">
            Todos los días · los pedidos cierran 4:30 AM en punto.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
