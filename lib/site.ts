// Central site constants for D'Madrugada.
// Items marked [draft — confirmar] must be replaced with the real business data.

export const WA_NUMBER = "51912564796"; // [draft — confirmar] +51 912 564 796

export const IG_URL = "https://www.instagram.com/dmadrugadacix/";
export const TIKTOK_URL = "https://www.tiktok.com/@dmadrugadacix";
export const FB_URL = "https://www.facebook.com/p/D-Madrugada-100083219564387/";

export const SITE = {
  name: "D'Madrugada",
  // [draft — confirmar dominio real]
  url: "https://dmadrugada.pe",
  tagline: "Comida en la madrugada",
  city: "Chiclayo",
  region: "Lambayeque",
  country: "Perú",
  hoursText: "9:00 PM — 4:30 AM",
  hoursShort: "9PM · 4:30AM",
  opens: "21:00",
  closes: "04:30",
} as const;

/** WhatsApp deep link with an optional prefilled Spanish message. */
export function waLink(
  message = "Hola D'Madrugada 🌙, quiero hacer un pedido:",
): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
