import type { Metadata } from "next";
import { MENU } from "@/lib/menu";
import { MenuCard } from "@/components/MenuCard";
import { CategoryNav } from "@/components/CategoryNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Carta",
  description:
    "La carta de D'Madrugada: alitas, broaster, chaufas, salchipapas, hamburguesas y bebidas. Delivery en Chiclayo de 9 PM a 4:30 AM.",
  alternates: { canonical: "/carta" },
};

export default function CartaPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28">
      <header className="text-center">
        <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-extrabold uppercase leading-none">
          La carta
        </h1>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-ink">
          Todo listo para tu madrugada · precios en soles (S/)
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Precios referenciales — confirma disponibilidad al hacer tu pedido.
        </p>
      </header>

      {/* sticky category nav (smooth-scroll + active pill; sits below the fixed 64px header) */}
      <CategoryNav categories={MENU} />

      <div className="mt-12 space-y-16">
        {MENU.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-32">
            <h2 className="font-display text-2xl font-bold">
              <span className="text-blue">/</span> {cat.label}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item) => (
                <MenuCard key={item.name} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="sticker mt-20 p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">¿Listo para pedir?</h2>
        <p className="mt-2 text-muted">Escríbenos y te lo llevamos calientito.</p>
        <div className="mt-6 flex justify-center">
          <WhatsAppButton size="lg" />
        </div>
      </div>
    </div>
  );
}
