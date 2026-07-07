"use client";

import { useEffect, useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, Loader2 } from "lucide-react";
import { useCart, buildOrderMessage } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";
import { ZONES } from "@/lib/zones";
import { waLink } from "@/lib/site";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

/** Lowercase, strip accents + parenthetical, collapse to plain words. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Best-effort: pick one of our ZONES if a geocoded field contains its name. */
function matchZoneName(candidates: (string | undefined)[]): string | null {
  const norm = candidates.filter(Boolean).map((c) => normalize(c as string));
  for (const z of ZONES) {
    const zn = normalize(z.name);
    if (zn && norm.some((c) => c.includes(zn))) return z.name;
  }
  return null;
}

/** Great-circle distance in km. */
function distanceKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) *
      Math.cos(toRad(bLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Nearest zone (by centroid) to a GPS point — always returns a district. */
function nearestZone(lat: number, lng: number): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  for (const z of ZONES) {
    if (typeof z.lat !== "number" || typeof z.lng !== "number") continue;
    const d = distanceKm(lat, lng, z.lat, z.lng);
    if (d < bestD) {
      bestD = d;
      best = z.name;
    }
  }
  return best;
}

type NominatimResult = {
  display_name?: string;
  address?: Record<string, string>;
};

/** Reverse-geocode via OpenStreetMap Nominatim (free, no API key). */
async function reverseGeocode(lat: number, lon: number): Promise<NominatimResult> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=es`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("reverse geocode failed");
  return res.json();
}

/** Slide-over cart with quantity steppers and WhatsApp checkout. */
export function CartDrawer() {
  const { items, subtotal, count, open, setOpen, inc, dec, remove, clear } =
    useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");
  const [zone, setZone] = useState("");
  const [locating, setLocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocate = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeoStatus({ ok: false, msg: "Tu navegador no soporta ubicación." });
      return;
    }
    setLocating(true);
    setGeoStatus(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        const near = nearestZone(latitude, longitude);
        try {
          const data = await reverseGeocode(latitude, longitude);
          const a = data.address ?? {};
          const road = a.road
            ? `${a.road}${a.house_number ? " " + a.house_number : ""}`
            : "";
          const barrio =
            a.neighbourhood || a.suburb || a.quarter || a.residential || "";
          const ciudad = a.city || a.town || a.village || "";
          const composed = [road, barrio, ciudad].filter(Boolean).join(", ");
          if (composed || data.display_name)
            setAddress(composed || data.display_name || "");
          // Prefer an exact name match; otherwise fall back to nearest centroid.
          const zoneName =
            matchZoneName([
              a.suburb,
              a.city_district,
              a.neighbourhood,
              a.quarter,
              a.residential,
              a.town,
              a.village,
              a.city,
              data.display_name,
            ]) ?? near;
          if (zoneName) setZone(zoneName);
          setGeoStatus({
            ok: true,
            msg: zoneName
              ? `Ubicación detectada · ${zoneName}`
              : "Ubicación detectada. Revisa tu dirección y elige tu distrito.",
          });
        } catch {
          if (near) setZone(near);
          setGeoStatus({
            ok: true,
            msg: near
              ? `Ubicación detectada · ${near}. Escribe tu dirección.`
              : "Ubicación GPS guardada. Escribe tu dirección y elige tu distrito.",
          });
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setGeoStatus({
          ok: false,
          msg:
            err.code === err.PERMISSION_DENIED
              ? "Permiso denegado. Actívalo o escribe tu dirección."
              : "No pudimos obtener tu ubicación. Escribe tu dirección.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const selectedZone = ZONES.find((z) => z.name === zone) ?? null;
  const fee = selectedZone?.fee ?? 0;
  const total = subtotal + fee;
  const mapsUrl = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
    : undefined;
  const message = buildOrderMessage(items, subtotal, {
    name,
    address,
    reference,
    zone: selectedZone?.name,
    fee,
    mapsUrl,
  });

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Mi pedido">
      {/* backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-night/50 backdrop-blur-sm"
      />

      {/* panel */}
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-2xl">
        <header className="flex items-center justify-between border-b-2 border-hair px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
            <ShoppingBag className="h-6 w-6 text-blue" strokeWidth={2} aria-hidden="true" />
            Mi pedido
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-blue/10"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </header>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-hair" strokeWidth={1.5} aria-hidden="true" />
            <p className="font-display text-lg font-bold text-ink">
              Tu carrito está vacío
            </p>
            <p className="text-sm text-muted">
              Agrega tus antojos desde la carta y arma tu pedido.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="space-y-3">
              {items.map((l) => (
                <li
                  key={l.name}
                  className="flex items-center gap-3 rounded-2xl border-2 border-hair p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-bold text-ink">
                      {l.name}
                    </p>
                    <p className="text-sm text-muted">
                      {formatPrice(l.price)} c/u ·{" "}
                      <span className="font-bold text-blue-ink">
                        {formatPrice(l.price * l.qty)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border-2 border-blue p-0.5">
                    <button
                      type="button"
                      onClick={() => dec(l.name)}
                      aria-label={`Quitar uno de ${l.name}`}
                      className="grid h-7 w-7 place-items-center rounded-full text-blue-ink transition hover:bg-blue/10 active:scale-90"
                    >
                      <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <span className="min-w-6 text-center font-display text-sm font-bold text-ink">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => inc(l.name)}
                      aria-label={`Agregar uno de ${l.name}`}
                      className="grid h-7 w-7 place-items-center rounded-full text-blue-ink transition hover:bg-blue/10 active:scale-90"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(l.name)}
                    aria-label={`Eliminar ${l.name}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-blue/10 hover:text-ink"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>

            {/* delivery details */}
            <div className="mt-6 space-y-3">
              <p className="font-display font-bold text-ink">Datos de entrega</p>
              <button
                type="button"
                onClick={handleLocate}
                disabled={locating}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue bg-blue/5 px-4 py-2.5 font-bold text-blue-ink transition hover:bg-blue/10 disabled:opacity-60"
              >
                {locating ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                )}
                {locating ? "Ubicando…" : "Usar mi ubicación (GPS)"}
              </button>
              {geoStatus && (
                <p
                  className={`text-xs ${
                    geoStatus.ok ? "text-blue-ink" : "text-muted"
                  }`}
                >
                  {geoStatus.msg}
                </p>
              )}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-xl border-2 border-hair bg-paper px-4 py-2.5 text-ink placeholder:text-muted focus:border-blue focus:outline-none"
              />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tu dirección"
                className="w-full rounded-xl border-2 border-hair bg-paper px-4 py-2.5 text-ink placeholder:text-muted focus:border-blue focus:outline-none"
              />
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                aria-label="Tu distrito"
                className={`w-full rounded-xl border-2 border-hair bg-paper px-4 py-2.5 focus:border-blue focus:outline-none ${
                  zone ? "text-ink" : "text-muted"
                }`}
              >
                <option value="">Selecciona tu distrito…</option>
                {ZONES.map((z) => (
                  <option key={z.name} value={z.name}>
                    {z.name} — {formatPrice(z.fee)}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Referencia (opcional)"
                className="w-full rounded-xl border-2 border-hair bg-paper px-4 py-2.5 text-ink placeholder:text-muted focus:border-blue focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={clear}
              className="mt-4 text-sm font-semibold text-muted transition hover:text-ink"
            >
              Vaciar carrito
            </button>
          </div>
        )}

        {count > 0 && (
          <footer className="border-t-2 border-hair px-5 py-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">
                  Envío{selectedZone ? ` · ${selectedZone.name}` : ""}
                </span>
                <span className="font-semibold text-ink">
                  {selectedZone ? formatPrice(fee) : "Elige tu distrito"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t-2 border-hair pt-2">
                <span className="font-display font-bold text-ink">Total</span>
                <span className="font-display text-2xl font-extrabold text-ink">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {selectedZone ? (
              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-wa py-3 font-bold text-ink shadow-[3px_4px_0_0_var(--color-ink)] transition hover:-translate-y-0.5 hover:shadow-[1px_2px_0_0_var(--color-ink)]"
              >
                <WhatsAppGlyph className="h-5 w-5" />
                Enviar pedido por WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-full border-2 border-hair py-3 font-bold text-muted"
              >
                Elige tu distrito para continuar
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
