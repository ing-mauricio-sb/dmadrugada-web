import { UtensilsCrossed, MessageCircle, Bike } from "lucide-react";
import { StepCard } from "@/components/StepCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";

/** Section 6 — how to order (subtle fade-in, no heavy motion). */
export function ComoPedir() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <h2 className="text-center font-display text-[clamp(2rem,5vw,4rem)] font-bold">
          Pedir es fácil
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted">
          Sin apps, sin registros. Un mensaje y a esperar tu antojo.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        <Reveal delay={0}>
          <StepCard
            n="01"
            title="Elige tu antojo"
            desc="Revisa la carta y arma tu pedido."
            Icon={UtensilsCrossed}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <StepCard
            n="02"
            title="Escríbenos al WhatsApp"
            desc="Un mensaje y listo, sin apps ni registros."
            Icon={MessageCircle}
          />
        </Reveal>
        <Reveal delay={0.2}>
          <StepCard
            n="03"
            title="Recíbelo caliente"
            desc="Llegamos a tu puerta en la madrugada."
            Icon={Bike}
          />
        </Reveal>
      </div>

      <div className="mt-12 flex justify-center">
        <WhatsAppButton size="lg" />
      </div>
    </section>
  );
}
