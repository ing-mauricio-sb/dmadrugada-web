import { Reveal } from "@/components/Reveal";
import { StarDoodle } from "@/components/Doodles";

/** Section 2 — friendly manifesto on a blue color-block. */
export function Manifiesto() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-blue-deep px-8 py-14 text-center text-paper sm:px-16 sm:py-20">
          <StarDoodle className="pointer-events-none absolute left-6 top-6 h-8 w-8 opacity-80" />
          <StarDoodle className="pointer-events-none absolute right-9 top-10 h-5 w-5 opacity-70" />
          <StarDoodle className="pointer-events-none absolute bottom-8 right-12 h-7 w-7 opacity-70" />
          <p className="mx-auto max-w-3xl text-balance font-display text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.2]">
            Mientras la ciudad duerme,{" "}
            <span className="text-amber">nosotros cocinamos</span>. Tu madrugada
            tiene quien la acompañe.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
