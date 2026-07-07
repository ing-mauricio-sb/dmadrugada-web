"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ZONES } from "@/lib/zones";
import { formatPrice } from "@/lib/menu";

/** Searchable, scannable grid of delivery zones with their fee. */
export function ZoneCards() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const filtered = query
    ? ZONES.filter((z) => z.name.toLowerCase().includes(query))
    : ZONES;

  return (
    <div>
      <div className="mx-auto flex max-w-md items-center gap-2 rounded-full border-2 border-blue bg-paper px-4 py-2.5">
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

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-muted">
          No encontramos esa zona. Escríbenos por WhatsApp y la confirmamos.
        </p>
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
