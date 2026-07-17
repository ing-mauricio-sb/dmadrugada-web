import Image from "next/image";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { StarDoodle } from "@/components/Doodles";

/** Section 7 — final CTA on a warm cream block with Sicán. */
export function CtaFinal() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-cream px-6 py-14 sm:px-12">
          <StarDoodle className="pointer-events-none absolute left-8 top-8 h-7 w-7 opacity-80" />
          <StarDoodle className="pointer-events-none absolute right-10 top-12 h-5 w-5 opacity-70" />
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div className="text-center md:text-left">
              <h2 className="text-balance font-display text-[clamp(2rem,6vw,4rem)] font-extrabold leading-[0.95] text-ink">
                El hambre <span className="text-blue">no espera</span>.
              </h2>
              <p className="mt-4 text-ink/80">
                Escríbenos y te lo llevamos calientito.
              </p>
              <div className="mt-8 flex justify-center md:justify-start">
                <WhatsAppButton size="lg" />
              </div>
            </div>
            <div className="animate-float-soft flex justify-center">
              <Image
                src="/mascota.png"
                alt="Sicán listo para repartir tu pedido"
                width={240}
                height={240}
                className="h-auto w-40 object-contain sm:w-52"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
