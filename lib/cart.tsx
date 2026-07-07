"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatPrice } from "@/lib/menu";

export type CartLine = { name: string; price: number; qty: number };

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: { name: string; price: number }) => void;
  inc: (name: string) => void;
  dec: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
  qtyOf: (name: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dmadrugada-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  // Loaded from localStorage only after mount → no SSR/hydration mismatch.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota / privacy mode */
    }
  }, [items, hydrated]);

  const add = useCallback((item: { name: string; price: number }) => {
    setItems((prev) => {
      const i = prev.findIndex((l) => l.name === item.name);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { name: item.name, price: item.price, qty: 1 }];
    });
  }, []);

  const inc = useCallback((name: string) => {
    setItems((prev) =>
      prev.map((l) => (l.name === name ? { ...l, qty: l.qty + 1 } : l)),
    );
  }, []);

  const dec = useCallback((name: string) => {
    setItems((prev) =>
      prev.flatMap((l) =>
        l.name === name
          ? l.qty <= 1
            ? []
            : [{ ...l, qty: l.qty - 1 }]
          : [l],
      ),
    );
  }, []);

  const remove = useCallback((name: string) => {
    setItems((prev) => prev.filter((l) => l.name !== name));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const qtyOf = useCallback(
    (name: string) => items.find((l) => l.name === name)?.qty ?? 0,
    [items],
  );

  const count = useMemo(() => items.reduce((s, l) => s + l.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, l) => s + l.price * l.qty, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    hydrated,
    open,
    setOpen,
    add,
    inc,
    dec,
    remove,
    clear,
    qtyOf,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

/** Build a nicely formatted WhatsApp order message (bold via *asterisks*). */
export function buildOrderMessage(
  items: CartLine[],
  subtotal: number,
  form: {
    name?: string;
    address?: string;
    reference?: string;
    zone?: string;
    fee?: number;
    mapsUrl?: string;
  },
): string {
  const fee = form.fee ?? 0;
  const total = subtotal + fee;
  const lines = items
    .map((l) => `• ${l.qty} × ${l.name} — ${formatPrice(l.price * l.qty)}`)
    .join("\n");

  const parts = [
    "🌙 *Nuevo pedido — D'Madrugada*",
    "",
    "🧾 *Mi pedido:*",
    lines,
    "",
    `💰 Subtotal: ${formatPrice(subtotal)}`,
    `🛵 Envío${form.zone ? ` (${form.zone})` : ""}: ${
      form.zone ? formatPrice(fee) : "por confirmar"
    }`,
    `✅ *Total: ${formatPrice(total)}*`,
    "",
    `👤 Nombre: ${form.name?.trim() || "(por confirmar)"}`,
    `📮 Distrito: ${form.zone || "(por confirmar)"}`,
    `📍 Dirección: ${form.address?.trim() || "(por confirmar)"}`,
  ];
  if (form.reference?.trim()) parts.push(`📝 Referencia: ${form.reference.trim()}`);
  if (form.mapsUrl) parts.push(`🗺️ Ubicación GPS: ${form.mapsUrl}`);
  parts.push("", "¡Gracias! 🙌");

  return parts.join("\n");
}
