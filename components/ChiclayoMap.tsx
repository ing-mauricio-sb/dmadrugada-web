"use client";

import { useState } from "react";
import { ZONES } from "@/lib/zones";
import { formatPrice } from "@/lib/menu";
import { MoonDoodle } from "./Doodles";

// Friendly (not geographic) placement for each zone, as % of the map box.
const POS = [
  { x: 46, y: 60 }, // Chiclayo Centro
  { x: 63, y: 41 }, // Santa Victoria
  { x: 33, y: 45 }, // La Victoria
  { x: 65, y: 64 }, // Federico Villarreal
  { x: 42, y: 26 }, // José Leonardo Ortiz (JLO)
  { x: 80, y: 76 }, // Pimentel
];

const CENTER = { x: 50, y: 50 };
// viewBox space for the connector lines / landmass.
const VW = 400;
const VH = 300;

export function ChiclayoMap() {
  const [active, setActive] = useState<number | null>(null);

  const pins = ZONES.map((z, i) => ({ ...z, ...(POS[i] ?? CENTER) }));

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* stylized landmass */}
        <path
          d="M60 46 C120 14 300 14 350 62 C392 104 388 214 338 252 C278 296 112 296 62 250 C18 208 16 92 60 46 Z"
          className="fill-sky stroke-blue"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {/* dashed routes from kitchen to each zone */}
        {pins.map((p) => (
          <line
            key={p.name}
            x1={(CENTER.x / 100) * VW}
            y1={(CENTER.y / 100) * VH}
            x2={(p.x / 100) * VW}
            y2={(p.y / 100) * VH}
            className="stroke-blue/40"
            strokeWidth={2}
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* kitchen marker (center) */}
      <div
        className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
      >
        <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-blue bg-amber shadow-[2px_3px_0_0_var(--color-blue-ink)]">
          <MoonDoodle className="h-6 w-6" />
        </span>
        <span className="mt-1 whitespace-nowrap rounded-full bg-paper px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-blue-ink">
          Cocina
        </span>
      </div>

      {/* zone pins */}
      {pins.map((p, i) => {
        const isActive = active === i;
        return (
          <button
            key={p.name}
            type="button"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((v) => (v === i ? null : v))}
            onFocus={() => setActive(i)}
            onBlur={() => setActive((v) => (v === i ? null : v))}
            onClick={() => setActive((v) => (v === i ? null : i))}
            aria-label={`${p.name}: envío ${formatPrice(p.fee)}`}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span
              className={`block rounded-full border-2 border-paper bg-blue transition-transform ${
                isActive ? "h-5 w-5 scale-110" : "h-3.5 w-3.5"
              }`}
              style={{ boxShadow: "0 2px 5px rgba(10,87,194,0.35)" }}
            />
            {isActive && (
              <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border-2 border-blue bg-paper px-3 py-1.5 text-center shadow-[3px_4px_0_0_var(--color-blue-ink)]">
                <span className="block text-sm font-bold text-ink">
                  {p.name}
                </span>
                <span className="badge-amber mt-0.5 text-xs">
                  {formatPrice(p.fee)}
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
