import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { SITE } from "@/lib/site";
import { restaurantJsonLd } from "@/lib/seo";

// Fredoka (rounded, friendly display) + Nunito (warm humanist body) — both
// variable fonts, so no explicit weights needed.
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "D'Madrugada — Delivery de comida en la madrugada | Chiclayo (9PM–4:30AM)",
    template: "%s · D'Madrugada",
  },
  description:
    "Antojos nocturnos con delivery en Chiclayo de 9:00 PM a 4:30 AM. Alitas, chaufa, broaster, hamburguesas y más — pide por WhatsApp.",
  keywords: [
    "delivery Chiclayo",
    "comida madrugada Chiclayo",
    "delivery nocturno Chiclayo",
    "alitas Chiclayo",
    "chaufa delivery",
    "D'Madrugada",
  ],
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE.url,
    siteName: SITE.name,
    title: "D'Madrugada — Comida en la madrugada · Chiclayo",
    description:
      "Delivery nocturno en Chiclayo de 9:00 PM a 4:30 AM. Tu antojo no duerme.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "D'Madrugada — delivery nocturno en Chiclayo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "D'Madrugada — Comida en la madrugada · Chiclayo",
    description: "Delivery nocturno en Chiclayo de 9:00 PM a 4:30 AM.",
    images: ["/og.jpg"],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-PE"
      className={`${fredoka.variable} ${nunito.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFab />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
