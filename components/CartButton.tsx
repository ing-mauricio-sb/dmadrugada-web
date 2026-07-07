"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

/** Header cart button with a live item-count badge. Opens the cart drawer. */
export function CartButton() {
  const { count, setOpen, hydrated } = useCart();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Ver mi pedido (${count} ${count === 1 ? "ítem" : "ítems"})`}
      className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-blue/10"
    >
      <ShoppingBag className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
      {hydrated && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-paper bg-amber px-1 text-[0.65rem] font-extrabold text-ink">
          {count}
        </span>
      )}
    </button>
  );
}
