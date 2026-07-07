# D'Madrugada — Web de delivery nocturno (Chiclayo)

Sitio web para **D'Madrugada**, delivery de comida en la madrugada en Chiclayo (9:00 PM – 4:30 AM).
Home inmersiva (spotlight "linterna" + scroll cinematográfico) + carta + zonas de delivery, con
pedidos por WhatsApp.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger/SplitText · Lenis · Motion (Framer Motion) · lucide-react.

---

## Correr en local

```bash
npm install
npm run dev      # desarrollo → http://localhost:3000
npm run build    # build de producción
npm run start    # servir el build
```

---

## ⚙️ Personalizar (todo lo que hay que cambiar antes de publicar)

Los datos marcados `[draft — confirmar]` en el código son de ejemplo. Reemplázalos:

| Qué | Dónde |
|---|---|
| **Número de WhatsApp** | `lib/site.ts` → `WA_NUMBER` (formato internacional sin `+`, p. ej. `51987654321`) |
| **Dominio del sitio** (para SEO/OG) | `lib/site.ts` → `SITE.url` |
| **Carta y precios** | `lib/menu.ts` (`MENU`) |
| **Zonas de delivery y tarifas** | `lib/zones.ts` (`ZONES`) |
| **Redes sociales** | `lib/site.ts` → `IG_URL`, `TIKTOK_URL`, `FB_URL` |
| **Fotos de los platos** | `public/food/*.jpg` y `public/city-chiclayo-night.jpg` (ver `public/food/LEEME-reemplazar-fotos.txt`) — actualmente placeholders de licencia libre |
| **Imagen para redes (Open Graph)** | `public/og.jpg` (1200×630) |
| **Logo** | Header/Footer usan un ícono de luna como placeholder. Coloca el logo real y actualiza `components/Header.tsx` / `components/Footer.tsx` |

Los colores de marca (`#0074FF` azul, `#FFBE00` ámbar) y las fuentes están centralizados en
`app/globals.css` (`@theme`) y `app/layout.tsx`.

---

## Estructura

```
app/
  layout.tsx            # fuentes, metadata, JSON-LD, Header/Footer/WhatsApp
  page.tsx              # Home inmersiva
  carta/page.tsx        # Carta (limpia, rápida)
  zonas-delivery/page.tsx
  sitemap.ts, robots.ts # SEO
components/
  home/                 # secciones de la home (spotlight, reloj, secuencia de platos, etc.)
  Header, Footer, WhatsAppButton, WhatsAppFab, MenuCard, CategoryNav, Reveal, SmartTime, StepCard
lib/
  site.ts, menu.ts, zones.ts, seo.ts
public/
  food/*.jpg, og.jpg
```

## Deploy

Optimizado para **Vercel** (framework Next.js autodetectado): conecta el repo o usa `vercel`.
Cualquier host con Node 18+ también sirve (`npm run build` + `npm run start`).

## Accesibilidad y motion

- Respeta `prefers-reduced-motion` en todo el sitio (spotlight, scrolls, fades).
- Focus visible en todos los elementos interactivos.
- Solo la home usa GSAP/Lenis; `/carta` y `/zonas-delivery` son ligeras.
