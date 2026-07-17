"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart, buildOrderMessage } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";
import { ZONES, CITY_CENTER, nearestZone, matchZoneName } from "@/lib/zones";
import { geocoder, mapsLink } from "@/lib/geocode";
import { waLink } from "@/lib/site";
import { WhatsAppGlyph } from "./WhatsAppGlyph";
import type { MapChange } from "./DeliveryLocationMap";

// Leaflet is heavy and touches `window`, so load it only on the client and only
// when step 2 mounts — keeps it out of the home / carta / zonas bundles.
const DeliveryLocationMap = dynamic(() => import("./DeliveryLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-60 w-full animate-pulse rounded-2xl border-2 border-hair bg-sky" />
  ),
});

/** Points beyond this distance from every zone centroid are treated as
 *  out-of-coverage (don't auto-pick a wrong district). */
const COVERAGE_KM = 12;

/** Slide-over cart: step 1 reviews the order, step 2 captures the exact
 *  delivery location, then sends everything to WhatsApp. */
export function CartDrawer() {
  const { items, subtotal, count, open, setOpen, inc, dec, remove, clear } =
    useCart();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");
  const [zone, setZone] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [geoStatus, setGeoStatus] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );

  const geoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geoAbort = useRef<AbortController | null>(null);

  // Reverse-geocode the new pin position — debounced (Nominatim ~1 req/s) with
  // an AbortController so only the latest drag wins.
  const scheduleReverse = useCallback((lat: number, lng: number) => {
    if (geoTimer.current) clearTimeout(geoTimer.current);
    setGeoStatus({ ok: true, msg: "Buscando tu dirección…" });
    geoTimer.current = setTimeout(async () => {
      geoAbort.current?.abort();
      const ctrl = new AbortController();
      geoAbort.current = ctrl;
      try {
        const r = await geocoder.reverse(
          { lat, lng },
          { signal: ctrl.signal, lang: "es" },
        );
        if (r.address) setAddress(r.address);
        const near = nearestZone(lat, lng);
        const far = near.name === null || near.km > COVERAGE_KM;
        if (far) {
          setGeoStatus({
            ok: false,
            msg: "Parece que estás fuera de nuestra cobertura. Confírmalo por WhatsApp.",
          });
          return;
        }
        const z =
          matchZoneName([
            r.fields.suburb,
            r.fields.cityDistrict,
            r.fields.neighbourhood,
            r.fields.quarter,
            r.fields.residential,
            r.fields.town,
            r.fields.village,
            r.fields.city,
            r.displayName,
          ]) ?? near.name;
        if (z) setZone(z);
        setGeoStatus({
          ok: true,
          msg: z
            ? `Dirección detectada · ${z}`
            : "Dirección detectada. Elige tu distrito.",
        });
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setGeoStatus({
          ok: false,
          msg: "No pudimos leer la dirección, escríbela a mano.",
        });
      }
    }, 700);
  }, []);

  // Map emits every pin move. `init` is ignored so a location is only recorded
  // after the customer actively places the pin (GPS / drag / tap) — that's what
  // makes the address truly mandatory.
  const onMapChange = useCallback(
    (c: MapChange) => {
      if (c.source === "init") return;
      setCoords({ lat: c.lat, lng: c.lng });
      scheduleReverse(c.lat, c.lng);
    },
    [scheduleReverse],
  );

  const onLocateError = useCallback((msg: string) => {
    setGeoStatus({ ok: false, msg });
  }, []);

  // Close and always rewind to the summary so the next open starts on step 1.
  const close = useCallback(() => {
    setOpen(false);
    setStep(1);
  }, [setOpen]);

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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Cancel pending geocode work on unmount.
  useEffect(() => {
    return () => {
      if (geoTimer.current) clearTimeout(geoTimer.current);
      geoAbort.current?.abort();
    };
  }, []);

  if (!open) return null;

  const selectedZone = ZONES.find((z) => z.name === zone) ?? null;
  const fee = selectedZone?.fee ?? 0;
  const total = subtotal + fee;
  const trimmedAddress = address.trim();
  const mapsUrl = coords ? mapsLink(coords.lat, coords.lng) : undefined;

  const canSubmit =
    count > 0 && !!selectedZone && trimmedAddress.length >= 6 && !!coords;

  const blockReason = !coords
    ? "Marca tu ubicación en el mapa"
    : trimmedAddress.length < 6
      ? "Escribe o confirma tu dirección"
      : !selectedZone
        ? "Elige tu distrito para continuar"
        : null;

  const message = buildOrderMessage(items, subtotal, {
    name,
    address,
    reference,
    zone: selectedZone?.name,
    fee,
    mapsUrl,
  });

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Mi pedido"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={close}
        className="animate-fade-in absolute inset-0 bg-night/50 backdrop-blur-sm"
      />

      {/* panel */}
      <div className="animate-slide-in-right absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-2xl">
        <header className="border-b-2 border-hair px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink">
              {step === 1 ? (
                <ShoppingBag
                  className="h-6 w-6 text-blue"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              ) : (
                <MapPin
                  className="h-6 w-6 text-blue"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              {step === 1 ? "Mi pedido" : "Datos de entrega"}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-blue/10"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {count > 0 && (
            <div className="mt-3 flex items-center gap-2" aria-hidden="true">
              <span className="h-1.5 flex-1 rounded-full bg-blue" />
              <span
                className={`h-1.5 flex-1 rounded-full ${
                  step === 2 ? "bg-blue" : "bg-hair"
                }`}
              />
              <span className="ml-1 font-mono text-xs font-bold text-muted">
                {step}/2
              </span>
            </div>
          )}
        </header>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag
              className="h-12 w-12 text-hair"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="font-display text-lg font-bold text-ink">
              Tu carrito está vacío
            </p>
            <p className="text-sm text-muted">
              Agrega tus antojos desde la carta y arma tu pedido.
            </p>
            <Link
              href="/carta"
              onClick={close}
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full border-2 border-blue px-6 text-sm font-bold text-blue-ink transition hover:bg-blue/10"
            >
              Ver la carta
            </Link>
          </div>
        ) : step === 1 ? (
          /* ---------- STEP 1 · order summary ---------- */
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
                      <Minus
                        className="h-4 w-4"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
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
                      <Plus
                        className="h-4 w-4"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
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

            <button
              type="button"
              onClick={clear}
              className="mt-4 text-sm font-semibold text-muted transition hover:text-ink"
            >
              Vaciar carrito
            </button>
          </div>
        ) : (
          /* ---------- STEP 2 · delivery details ---------- */
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mb-3 flex items-center gap-1 text-sm font-semibold text-blue-ink transition hover:text-blue"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Volver al pedido
            </button>

            <DeliveryLocationMap
              center={coords ?? CITY_CENTER}
              onChange={onMapChange}
              onLocateError={onLocateError}
            />

            {geoStatus && (
              <p
                className={`mt-2 text-xs ${
                  geoStatus.ok ? "text-blue-ink" : "text-muted"
                }`}
              >
                {geoStatus.msg}
              </p>
            )}

            <div className="mt-4 space-y-3">
              <div>
                <label
                  htmlFor="cart-address"
                  className="mb-1 block text-sm font-bold text-ink"
                >
                  Dirección <span className="text-blue">*</span>
                </label>
                <input
                  id="cart-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, referencia de la puerta"
                  aria-required="true"
                  aria-invalid={!!coords && trimmedAddress.length < 6}
                  className={`w-full rounded-xl border-2 bg-paper px-4 py-2.5 text-ink placeholder:text-muted ${
                    !!coords && trimmedAddress.length < 6
                      ? "border-amber focus:border-amber"
                      : "border-hair focus:border-blue"
                  }`}
                />
              </div>

              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                aria-label="Tu distrito"
                className={`w-full rounded-xl border-2 border-hair bg-paper px-4 py-2.5 focus:border-blue ${
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
                placeholder="Referencia (opcional): color de puerta, piso…"
                className="w-full rounded-xl border-2 border-hair bg-paper px-4 py-2.5 text-ink placeholder:text-muted focus:border-blue"
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre (opcional)"
                className="w-full rounded-xl border-2 border-hair bg-paper px-4 py-2.5 text-ink placeholder:text-muted focus:border-blue"
              />
            </div>
          </div>
        )}

        {/* ---------- footer ---------- */}
        {count > 0 && step === 1 && (
          <footer className="border-t-2 border-hair px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-display text-xl font-extrabold text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-blue py-3 font-bold text-paper shadow-[3px_4px_0_0_var(--color-blue-ink)] transition hover:-translate-y-0.5 hover:shadow-[1px_2px_0_0_var(--color-blue-ink)]"
            >
              Continuar a la entrega
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </footer>
        )}

        {count > 0 && step === 2 && (
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

            {canSubmit ? (
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
                {blockReason}
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
