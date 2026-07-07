"use client";

import { Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart";

/**
 * Add-to-cart control for a menu item. Shows "Añadir" until the item is in the
 * cart, then a quantity stepper. Server-safe first paint ("Añadir") — the
 * stepper only appears after the cart hydrates from localStorage.
 */
export function AddToCartButton({
  name,
  price,
}: {
  name: string;
  price: number;
}) {
  const { qtyOf, add, inc, dec, hydrated } = useCart();
  const qty = qtyOf(name);

  if (!hydrated || qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add({ name, price })}
        className="inline-flex items-center gap-1.5 rounded-full bg-blue px-4 py-1.5 text-sm font-bold text-paper transition hover:bg-blue-deep active:scale-95"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        Añadir
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border-2 border-blue p-0.5">
      <button
        type="button"
        onClick={() => dec(name)}
        aria-label={`Quitar uno de ${name}`}
        className="grid h-7 w-7 place-items-center rounded-full text-blue-ink transition hover:bg-blue/10 active:scale-90"
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
      </button>
      <span
        className="min-w-6 text-center font-display text-sm font-bold text-ink"
        aria-live="polite"
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={() => inc(name)}
        aria-label={`Agregar uno de ${name}`}
        className="grid h-7 w-7 place-items-center rounded-full text-blue-ink transition hover:bg-blue/10 active:scale-90"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}
