"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  // Close on Escape, lock body scroll while the mobile menu is open (same
  // overlay behavior as CartDrawer), and auto-close if the viewport crosses
  // into desktop — otherwise the scroll lock would stick with no way to undo
  // it (the hamburger is hidden on md+).
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-hair bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
          <Logo />
          <span className="ml-1 hidden badge-amber text-[0.62rem] uppercase tracking-[0.12em] sm:inline-flex">
            {SITE.hoursShort}
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
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
            className="-m-2.5 grid h-11 w-11 place-items-center text-ink md:hidden"
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
        <>
          {/* backdrop — dims the page, click to close, matches CartDrawer's overlay feel */}
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="animate-fade-in fixed inset-x-0 bottom-0 top-16 z-40 bg-night/30 md:hidden"
          />
          <div className="animate-menu-drop relative z-50 border-t-2 border-hair bg-paper px-5 py-4 md:hidden">
            <nav aria-label="Navegación móvil" className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === n.href ? "page" : undefined}
                  className={`-mx-2 rounded-xl px-2 py-2.5 text-base font-semibold transition-colors ${
                    pathname === n.href
                      ? "bg-blue/5 text-blue-ink"
                      : "text-muted hover:bg-blue/5 hover:text-ink"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <WhatsAppButton size="sm" className="mt-2 w-full" />
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
