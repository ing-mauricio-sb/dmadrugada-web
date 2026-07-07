import { SITE, IG_URL, TIKTOK_URL, FB_URL } from "@/lib/site";

// JSON-LD Restaurant schema. Hours 21:00 → 04:30 legitimately cross midnight;
// schema.org allows `closes` earlier than `opens` to mean "next day".
export const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  description:
    "Delivery de comida en la madrugada en Chiclayo. Alitas, chaufa, broaster, hamburguesas y más, de 9:00 PM a 4:30 AM.",
  servesCuisine: ["Peruana", "Comida rápida", "Antojos nocturnos"],
  areaServed: {
    "@type": "City",
    name: "Chiclayo",
    containedInPlace: { "@type": "AdministrativeArea", name: "Lambayeque, Perú" },
  },
  telephone: "+51912564796", // [draft — confirmar]
  priceRange: "S/",
  url: SITE.url,
  hasMenu: `${SITE.url}/carta`,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: SITE.opens,
      closes: SITE.closes,
    },
  ],
  sameAs: [IG_URL, TIKTOK_URL, FB_URL],
};
