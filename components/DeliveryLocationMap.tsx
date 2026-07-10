"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Loader2 } from "lucide-react";

export type MapChange = {
  lat: number;
  lng: number;
  accuracy?: number;
  source: "init" | "gps" | "drag" | "click";
};

type Props = {
  center: { lat: number; lng: number };
  onChange: (c: MapChange) => void;
  onLocateError?: (msg: string) => void;
  onLocating?: (busy: boolean) => void;
  className?: string;
};

/** Brand pin as an inline SVG divIcon — no marker-icon.png (avoids the classic
 *  broken-asset bug under bundlers) and matches the "Sicán" palette. */
const brandPin = L.divIcon({
  className: "",
  html: `<svg width="34" height="46" viewBox="0 0 34 46" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12 17 29 17 29s17-17 17-29C34 7.6 26.4 0 17 0z"
            fill="#0074ff" stroke="#0a57c2" stroke-width="2"/>
      <circle cx="17" cy="17" r="6.5" fill="#ffbe00"/>
    </svg>`,
  iconSize: [34, 46],
  iconAnchor: [17, 46],
});

/** Interactive Leaflet map with a draggable brand pin + GPS button.
 *  Client-only: loaded via next/dynamic({ ssr:false }) so Leaflet never runs
 *  on the server and its JS/CSS stay out of the pages that don't use it. */
export default function DeliveryLocationMap({
  center,
  onChange,
  onLocateError,
  onLocating,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [locating, setLocating] = useState(false);

  // Keep latest callbacks in refs — the init effect runs once, but Leaflet
  // listeners must always call the current props (no stale closures).
  const onChangeRef = useRef(onChange);
  const onLocateErrorRef = useRef(onLocateError);
  useEffect(() => {
    onChangeRef.current = onChange;
    onLocateErrorRef.current = onLocateError;
  });

  const clearCircle = () => {
    if (circleRef.current && mapRef.current) {
      mapRef.current.removeLayer(circleRef.current);
      circleRef.current = null;
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return; // guard StrictMode double-mount

    const map = L.map(el, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false, // avoid hijacking the drawer's scroll
    }).setView([center.lat, center.lng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    const marker = L.marker([center.lat, center.lng], {
      draggable: true,
      autoPan: true,
      icon: brandPin,
    }).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      clearCircle(); // a hand-placed pin has no GPS accuracy
      onChangeRef.current({ lat, lng, source: "drag" });
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      clearCircle();
      onChangeRef.current({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        source: "click",
      });
    });

    onChangeRef.current({ lat: center.lat, lng: center.lng, source: "init" });

    // Container just became visible (step change) → recompute tile layout.
    const raf = requestAnimationFrame(() => map.invalidateSize());

    return () => {
      cancelAnimationFrame(raf);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
    // Init once; `center` is only the initial view. eslint-disable-next-line
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLocate = () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      onLocateErrorRef.current?.("Tu navegador no soporta ubicación.");
      return;
    }
    setLocating(true);
    onLocating?.(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const map = mapRef.current;
        const marker = markerRef.current;
        if (map && marker) {
          map.setView([latitude, longitude], 17);
          marker.setLatLng([latitude, longitude]);
          clearCircle();
          circleRef.current = L.circle([latitude, longitude], {
            radius: accuracy,
            color: "#0074ff",
            weight: 1,
            fillColor: "#0074ff",
            fillOpacity: 0.12,
          }).addTo(map);
        }
        setLocating(false);
        onLocating?.(false);
        onChangeRef.current({
          lat: latitude,
          lng: longitude,
          accuracy,
          source: "gps",
        });
      },
      (err) => {
        setLocating(false);
        onLocating?.(false);
        onLocateErrorRef.current?.(
          err.code === err.PERMISSION_DENIED
            ? "Permiso denegado. Arrastra el pin hasta tu casa."
            : "No pudimos obtener tu ubicación. Arrastra el pin a tu casa.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="h-60 w-full overflow-hidden rounded-2xl border-2 border-blue"
        style={{ zIndex: 0 }}
        role="application"
        aria-label="Mapa para fijar tu ubicación de entrega"
      />
      <button
        type="button"
        onClick={handleLocate}
        disabled={locating}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue bg-blue/5 px-4 py-2.5 font-bold text-blue-ink transition hover:bg-blue/10 disabled:opacity-60"
      >
        {locating ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <MapPin className="h-5 w-5" aria-hidden="true" />
        )}
        {locating ? "Ubicando…" : "Usar mi ubicación (GPS)"}
      </button>
      <p className="mt-1.5 text-center text-xs text-muted">
        Arrastra el pin 📍 o toca el mapa para marcar tu dirección exacta.
      </p>
    </div>
  );
}
