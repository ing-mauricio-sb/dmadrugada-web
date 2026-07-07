"use client";

import { useEffect, useState } from "react";

/**
 * Live "open now?" badge for D'Madrugada (open 21:00 → 04:30 local time).
 * Computed AFTER mount (returns null during SSR + first paint) to avoid a
 * hydration mismatch — the server has no access to the visitor's clock.
 */
export function SmartTime() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      // 21:00 = 1260 ; 04:30 = 270 (crosses midnight)
      setOpen(mins >= 1260 || mins < 270);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  if (open === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] ${
        open
          ? "bg-amber text-ink"
          : "border-2 border-hair bg-paper text-muted"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          open ? "bg-ink animate-pulse-halo" : "bg-muted"
        }`}
        aria-hidden="true"
      />
      {open ? "Abierto ahora · te llevamos tu antojo" : "Cerrado · abrimos 9:00 PM"}
    </span>
  );
}
