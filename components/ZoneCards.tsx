"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ZONES } from "@/lib/zones";
import { formatPrice } from "@/lib/menu";
import { WhatsAppButton } from "./WhatsAppButton";
import { MoonDoodle } from "./Doodles";

/** Searchable, scannable grid of delivery zones with their fee. */
export function ZoneCards() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const filtered = query
    ? ZONES.filter((z) => z.name.toLowerCase().includes(query))
    : ZONES;

  return (
    <div>
      {/* focus ring lands on the pill (focus-within) — the inner input keeps
          outline-none, so keyboard users still get a visible indicator */}
      <div className="mx-auto flex max-w-md items-center gap-2 rounded-full border-2 border-blue bg-paper px-4 py-2.5 transition-shadow focus-within:shadow-[0_0_0_3px_var(--color-blue)]">
        <Search className="h-5 w-5 shrink-0 text-blue" aria-hidden="true" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca tu zona…"
          aria-label="Busca tu zona"
          className="w-full bg-transparent font-semibold text-ink placeholder:font-normal placeholder:text-muted focus:outline-none"
        />
      </div>

      {/* announce filter results without visual noise */}
      <p aria-live="polite" className="sr-only">
        {filtered.length === 0
          ? "Ninguna zona coincide con la búsqueda"
          : `${filtered.length} ${filtered.length === 1 ? "zona encontrada" : "zonas encontradas"}`}
      </p>

      {filtered.length === 0 ? (
        <div className="sticker mx-auto mt-8 max-w-md p-8 text-center">
          <MoonDoodle className="animate-float-soft mx-auto h-10 w-10" />
          <p className="mt-3 font-display text-lg font-bold text-ink">
            No encontramos esa zona
          </p>
          <p className="mt-1 text-sm text-muted">
            Escríbenos por WhatsApp y te confirmamos la cobertura al toque.
          </p>
          <div className="mt-5 flex justify-center">
            <WhatsAppButton
              size="sm"
              label="Consultar mi zona"
              message="Hola D'Madrugada 🌙, no encontré mi zona en la web. ¿Llegan hasta mi dirección?"
            />
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((z) => (
            <div
              key={z.name}
              className="sticker sticker-hover flex items-center justify-between gap-3 p-5"
            >
              <div className="min-w-0">
                <p className="font-display font-bold leading-tight text-ink">
                  {z.name}
                </p>
                {z.note && <p className="text-xs text-muted">({z.note})</p>}
              </div>
              <span className="badge-amber shrink-0 text-sm">
                {formatPrice(z.fee)}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Mientras más cerca del centro, menos pagas de envío. Tarifas
        referenciales — confirma tu dirección exacta al hacer el pedido.
      </p>
    </div>
  );
}
