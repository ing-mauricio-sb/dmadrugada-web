// Reverse-geocoding behind a swappable interface.
//
// Today we use OpenStreetMap Nominatim (free, no API key) directly from the
// browser — the right choice for a low-traffic marketing site. To move to a
// paid provider later (Google / Mapbox) with better coverage and an SLA, you
// only reimplement `proxyGeocoder` + add `app/api/geocode/route.ts` (key stays
// server-side) and set NEXT_PUBLIC_GEOCODER=proxy. No component changes —
// CartDrawer / DeliveryLocationMap only depend on the `Geocoder` interface.

export type LatLng = { lat: number; lng: number };

/** Address components we care about, normalized across providers. */
export type AddressFields = {
  road?: string;
  houseNumber?: string;
  neighbourhood?: string;
  suburb?: string;
  cityDistrict?: string;
  quarter?: string;
  residential?: string;
  city?: string;
  town?: string;
  village?: string;
};

export type ReverseResult = {
  /** Human-readable line composed from `fields` (may be ""). */
  address: string;
  /** Full provider string, kept for zone matching / fallback. */
  displayName?: string;
  fields: AddressFields;
  provider: "nominatim" | "proxy";
};

export interface Geocoder {
  reverse(
    p: LatLng,
    opts?: { signal?: AbortSignal; lang?: string },
  ): Promise<ReverseResult>;
}

/** Compose "street number, neighbourhood, city" from normalized fields. */
export function composeAddress(f: AddressFields): string {
  const road = f.road
    ? `${f.road}${f.houseNumber ? " " + f.houseNumber : ""}`
    : "";
  const barrio = f.neighbourhood || f.suburb || f.quarter || f.residential || "";
  const ciudad = f.city || f.town || f.village || "";
  return [road, barrio, ciudad].filter(Boolean).join(", ");
}

/** Google Maps deep link that opens the app with a pin at the coordinate. */
export function mapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

type NominatimResponse = {
  display_name?: string;
  address?: Record<string, string>;
};

export const nominatimGeocoder: Geocoder = {
  async reverse({ lat, lng }, opts) {
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
      `&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1` +
      `&accept-language=${opts?.lang ?? "es"}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: opts?.signal,
    });
    if (!res.ok) throw new Error("reverse geocode failed");
    const data = (await res.json()) as NominatimResponse;
    const a = data.address ?? {};
    const fields: AddressFields = {
      road: a.road ?? a.pedestrian,
      houseNumber: a.house_number,
      neighbourhood: a.neighbourhood,
      suburb: a.suburb,
      cityDistrict: a.city_district,
      quarter: a.quarter,
      residential: a.residential,
      city: a.city,
      town: a.town,
      village: a.village,
    };
    return {
      address: composeAddress(fields) || data.display_name || "",
      displayName: data.display_name,
      fields,
      provider: "nominatim",
    };
  },
};

/**
 * Placeholder for the scalable path — routes through our own backend so the
 * provider API key never reaches the browser. Wire up when migrating; until
 * then it is never selected (see `geocoder` below).
 */
export const proxyGeocoder: Geocoder = {
  async reverse({ lat, lng }, opts) {
    const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`, {
      signal: opts?.signal,
    });
    if (!res.ok) throw new Error("reverse geocode failed");
    return (await res.json()) as ReverseResult;
  },
};

/** Single selection point — swap providers without touching any component. */
export const geocoder: Geocoder =
  process.env.NEXT_PUBLIC_GEOCODER === "proxy"
    ? proxyGeocoder
    : nominatimGeocoder;
