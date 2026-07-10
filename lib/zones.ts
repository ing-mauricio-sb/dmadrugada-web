// DRAFT delivery zones for Chiclayo. Fees [draft — confirmar] with the business.

export type Zone = {
  name: string;
  fee: number; // soles (S/)
  note?: string;
  // Zone centroid (from OpenStreetMap) used to auto-pick the nearest zone from
  // the visitor's GPS location. Tune if the business defines exact boundaries.
  lat?: number;
  lng?: number;
};

export const ZONES: Zone[] = [
  { name: "Chiclayo Centro", fee: 4, lat: -6.7716, lng: -79.8387 },
  { name: "Santa Victoria", fee: 4, lat: -6.7812, lng: -79.8385 },
  { name: "La Victoria", fee: 5, lat: -6.8071, lng: -79.8519 },
  { name: "Federico Villarreal", fee: 5, lat: -6.7743, lng: -79.8543 },
  { name: "José Leonardo Ortiz (JLO)", fee: 6, lat: -6.7421, lng: -79.8342 },
  { name: "Pimentel", fee: 8, note: "según punto", lat: -6.8208, lng: -79.9187 },
];

/** Default map pin position when GPS is unavailable — central Chiclayo. */
export const CITY_CENTER = { lat: -6.7714, lng: -79.8409 } as const;

/** Lowercase, strip accents + parenthetical, collapse to plain words. */
export function normalize(s: string): string {
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
export function matchZoneName(candidates: (string | undefined)[]): string | null {
  const norm = candidates.filter(Boolean).map((c) => normalize(c as string));
  for (const z of ZONES) {
    const zn = normalize(z.name);
    if (zn && norm.some((c) => c.includes(zn))) return z.name;
  }
  return null;
}

/** Great-circle distance in km. */
export function distanceKm(
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

/** Nearest zone (by centroid) to a GPS point, plus its distance in km. */
export function nearestZone(
  lat: number,
  lng: number,
): { name: string | null; km: number } {
  let name: string | null = null;
  let km = Infinity;
  for (const z of ZONES) {
    if (typeof z.lat !== "number" || typeof z.lng !== "number") continue;
    const d = distanceKm(lat, lng, z.lat, z.lng);
    if (d < km) {
      km = d;
      name = z.name;
    }
  }
  return { name, km };
}
