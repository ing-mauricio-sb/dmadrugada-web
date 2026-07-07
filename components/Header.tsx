"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";
import { CartButton } from "./CartButton";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/carta", label: "Carta" },
  { href: "/zonas-delivery", label: "Zonas de delivery" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-hair bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
          <Logo />
          <span className="ml-1 hidden badge-amber text-[0.62rem] uppercase tracking-[0.12em] sm:inline-flex">
            {SITE.hoursShort}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative text-sm font-semibold transition-colors ${
                  active ? "text-blue-ink" : "text-muted hover:text-ink"
                }`}
              >
                {n.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-1 w-full rounded-full bg-amber" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <CartButton />
          <div className="hidden md:block">
            <WhatsAppButton size="sm" />
          </div>
          <button
            type="button"
            className="-m-1 p-1 text-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t-2 border-hair bg-paper px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`text-base font-semibold ${
                  pathname === n.href ? "text-blue-ink" : "text-muted"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <WhatsAppButton size="sm" className="mt-1 w-full" />
          </nav>
        </div>
      )}
    </header>
  );
}
