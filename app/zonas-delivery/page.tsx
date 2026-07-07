import type { Metadata } from "next";
import { UtensilsCrossed, MessageCircle, Bike } from "lucide-react";
import { ZONES } from "@/lib/zones";
import { formatPrice } from "@/lib/menu";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StepCard } from "@/components/StepCard";
import { Reveal } from "@/components/Reveal";
import { ZoneCards } from "@/components/ZoneCards";
import { ChiclayoMap } from "@/components/ChiclayoMap";
import { MoonDoodle } from "@/components/Doodles";

export const metadata: Metadata = {
  title: "Zonas de delivery",
  description:
    "Zonas de reparto de D'Madrugada en Chiclayo y alrededores. Delivery nocturno de 9 PM a 4:30 AM.",
  alternates: { canonical: "/zonas-delivery" },
};

const MIN_FEE = Math.min(...ZONES.map((z) => z.fee));

export default function ZonasPage() {
  return (
    <div className="pb-24 pt-28">
      {/* HERO */}
      <section className="mx-auto max-w-3xl px-5 text-center">
        <p className="badge-amber text-xs uppercase tracking-[0.16em]">
          Cobertura nocturna
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.25rem,7vw,4.5rem)] font-extrabold leading-[0.95] text-ink">
          ¿Llegamos a tu <span className="text-blue">zona</span>?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/80">
          Repartimos por Chiclayo y alrededores mientras todos duermen. Mira tu
          zona y cuánto cuesta el envío.
        </p>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-blue-ink">
          {ZONES.length} zonas
          <span className="mx-2 text-amber">·</span>
          desde {formatPrice(MIN_FEE)}
          <span className="mx-2 text-amber">·</span>
          hasta las 4:30 AM
        </p>
      </section>

      {/* ZONE CARDS + SEARCH */}
      <section className="mx-auto mt-14 max-w-6xl px-5">
        <ZoneCards />
      </section>

      {/* DELIVERY WINDOW */}
      <section className="mx-auto mt-20 max-w-3xl px-5">
        <Reveal>
          <div className="sticker p-8 text-center sm:p-12">
            <MoonDoodle className="animate-float-soft mx-auto h-14 w-14" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-ink">
              Ventana de reparto
            </p>
            <div className="mt-3 font-display text-[clamp(1.8rem,6vw,3.25rem)] font-extrabold leading-none text-ink">
              9:00 PM — 4:30 AM
            </div>
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
            <p className="mt-8 text-ink/80">Todos los días.</p>
            <p className="mt-1 text-sm text-muted">
              Los pedidos cierran 4:30 AM en punto — no te quedes con el antojo.
            </p>
          </div>
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="text-center font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold text-ink">
          Cómo funciona
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
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
              desc="Indícanos tu pedido y tu dirección exacta."
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
      </section>

      {/* ILLUSTRATED MAP (bottom) */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <h2 className="text-center font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold text-ink">
          Nuestro mapa de reparto
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-muted">
          Toca cada punto para ver la tarifa de envío a esa zona.
        </p>
        <div className="mt-10">
          <ChiclayoMap />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-2xl px-5 text-center">
        <p className="text-ink/80">¿Estás dentro de la zona? No esperes más.</p>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton size="lg" />
        </div>
      </section>
    </div>
  );
}
