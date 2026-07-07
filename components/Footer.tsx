import Link from "next/link";
import { Logo } from "./Logo";
import { MoonDoodle, StarDoodle } from "./Doodles";
import { SITE, IG_URL, TIKTOK_URL, FB_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-paper">
      {/* night doodles */}
      <MoonDoodle className="pointer-events-none absolute -right-4 -top-6 h-24 w-24 opacity-90" />
      <StarDoodle className="pointer-events-none absolute left-[12%] top-10 h-6 w-6 opacity-70" />
      <StarDoodle className="pointer-events-none absolute right-[28%] bottom-16 h-4 w-4 opacity-60" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <Logo tone="paper" />
          <p className="mt-3 text-sm text-paper/70">
            {SITE.tagline} · {SITE.city}, {SITE.region}
          </p>
          <p className="mt-3 badge-amber text-sm">{SITE.hoursText}</p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-paper/60">
            Navega
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/" className="text-paper/85 transition hover:text-amber">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/carta" className="text-paper/85 transition hover:text-amber">
                Carta
              </Link>
            </li>
            <li>
              <Link
                href="/zonas-delivery"
                className="text-paper/85 transition hover:text-amber"
              >
                Zonas de delivery
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-paper/60">
            Síguenos
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/85 transition hover:text-amber"
              >
                Instagram @dmadrugadacix
              </a>
            </li>
            <li>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/85 transition hover:text-amber"
              >
                TikTok @dmadrugadacix
              </a>
            </li>
            <li>
              <a
                href={FB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/85 transition hover:text-amber"
              >
                Facebook D&apos; Madrugada
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-paper/15 px-5 py-5 text-center text-xs text-paper/60">
        © 2026 D&apos;Madrugada — Delivery nocturno en {SITE.city}, {SITE.region}.
      </div>
    </footer>
  );
}
