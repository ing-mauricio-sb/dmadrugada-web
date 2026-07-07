# Prompt de refactorización — D'Madrugada: de dark "Midnight Neón" a light cartoon "Sicán"

> Documento de build. Pégalo completo en tu agente de código (o ejecútalo aquí).
> Todo el copy es verbatim en español; las instrucciones son la spec a cumplir al pie de la letra.

---

## Rol
Eres un **ingeniero front-end senior** experto en **Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind CSS v4** y en diseño de interacción/motion. Envías interfaces cartoon amigables a 60fps y sigues esta spec al pie de la letra: sin colores, fuentes ni layouts improvisados, sin defaults "del centro estadístico". **⚠️ Antes de escribir cualquier código de Next, lee la guía relevante en `node_modules/next/dist/docs/`** (esta versión de Next tiene breaking changes; lo exige `AGENTS.md`).

## Contexto
- **Qué y para quién:** *D'Madrugada* — delivery nocturno de comida en Chiclayo (9:00 PM–4:30 AM). Público: chiclayanos con antojo de madrugada; el tono debe transmitir **amistad y confianza** ("Chiclayo, ciudad de la amistad").
- **Objetivo de la web:** que el visitante **pida por WhatsApp** (única conversión) y descubra carta y cobertura. No hay backend, carrito ni auth.
- **Dónde vive:** proyecto Next.js 16 existente (`app/` router). Es un **refactor**, no un proyecto nuevo: se reutiliza toda la data (`lib/*`), helpers (`waLink`), y componentes de lógica (`Reveal`, `SmartTime`).
- **Mascota:** **Sicán**, un perro cartoon blanco (inspirado en una mascota real con ese nombre) con copete-llama ámbar, oreja/gorro azul, guiño, y **pañuelo ámbar con lunas crecientes, estrellas y huesos** (contornos en azul `#0074FF`). PNG transparente en `public/mascota.png`.

## Tarea
Refactorizar D'Madrugada de su tema **dark "Midnight Neón"** a un tema **light caricaturesco "Sicán"**: flat color-blocking (azul + ámbar + blanco), sticker cards con contorno azul, doodles nocturnos amables (luna/estrellas), y a Sicán como protagonista. Rediseñar la página de zonas (reemplazar el radar). Dirección estética: **cartoon peruano nocturno-amable**, con el riesgo deliberado de usar **contornos azules en vez de negros** (como la mascota) para una identidad propia. La interacción firma es **"Sicán te acompaña"** (tilt magnético hacia el cursor). **Respeta cada detalle de abajo exactamente.**

## Restricciones — Setup global

**Fuentes** — en `app/layout.tsx` con `next/font/google` (retirar Space Mono):
```ts
import { Fredoka, Nunito } from "next/font/google";
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const nunito  = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
// <html className={`${fredoka.variable} ${nunito.variable}`}>
```
En `app/globals.css` con `@theme inline`: `--font-display: var(--font-fredoka)` · `--font-body: var(--font-nunito)`. (Recuerda: en Tailwind v4 las fuentes next/font DEBEN ir en `@theme inline`, no en `@theme`.)

**Tokens de color** — reemplazar por completo el bloque `@theme` de `app/globals.css`. Todo color usado en el sitio debe ser uno de estos:
```
--color-paper #FFFFFF · --color-cream #FFF7E6 · --color-sky #E9F2FF
--color-blue #0074FF · --color-blue-deep #005FD6 · --color-blue-ink #0A57C2
--color-amber #FFBE00 · --color-amber-soft #FFD24D
--color-ink #0E2033 · --color-muted #5C6B82
--color-night #072142 · --color-hair #DCE7F5 · --color-wa #25D366
```
`:root { color-scheme: light }`. `html, body { background: var(--color-paper); color: var(--color-ink) }`.

**Jerarquía de color (obligatoria):** blanco/crema = lienzo dominante; **azul** = estructura/marca (titulares, contornos, links, bloques); **ámbar** = solo relleno/acento de atención (badges, luna, "Abierto ahora", tag "Top") — **nunca texto ámbar sobre blanco**; texto cuerpo = `--color-ink`. Bloques azules con texto blanco usan `--color-blue-deep` (no `#0074FF`) por contraste.

**Escala tipográfica:** titulares `font-display` (Fredoka) con `clamp()` fluido; cuerpo `font-body` (Nunito) 1rem–1.125rem. H1 hero `clamp(2.75rem, 9vw, 7rem)` `font-extrabold`; H2 sección `clamp(1.75rem, 5vw, 3.25rem)`.

**Primitivos cartoon** — añadir a `globals.css` (reemplazan `.glow-*`/`.ring-neon*`/`.noise`):
```css
.sticker { background: var(--color-paper); border: 3px solid var(--color-blue);
  border-radius: 1.5rem; box-shadow: 5px 6px 0 0 var(--color-blue-ink); }
.sticker-hover { transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s; }
.sticker-hover:hover { transform: translate(-1px,-1px) rotate(-1deg); box-shadow: 2px 3px 0 0 var(--color-blue-ink); }
.badge-amber { background: var(--color-amber); color: var(--color-ink); border-radius: 999px;
  font-weight: 700; padding: .15rem .6rem; }
```

**Motion defaults:** ease `cubic-bezier(0.34,1.56,0.64,1)`, duración 0.5s, stagger 0.08s. Keyframes: `pop` (scale .8→1 + opacity), `wag` (rotate ±4°), `float-soft` (translateY ±6px, 4s), `twinkle` (opacity .4→1 en estrellas). Bloque `@media (prefers-reduced-motion: reduce)`: desactivar transforms/animaciones (conservar el reset existente).

**Root:** `<body class="flex min-h-dvh flex-col">`. `<title>` y metadata ES existentes se conservan. `app/layout.tsx`: `viewport.themeColor → "#FFFFFF"`, `colorScheme: "light"`.

## Assets (URLs exactas)
- `MASCOTA` — Sicán, PNG transparente: `/mascota.png` (usar con `next/image`, `priority` en hero).
- `FOOD` — platos existentes (neutros): `/food/hero.jpg`, `/food/alitas.jpg`, `/food/broaster.jpg`, `/food/chaufa.jpg`, `/food/burger.jpg`.
- Doodles (luna creciente, estrella, chispa, hueso) — **generar como SVG inline** con líneas `--color-blue` de 3px, estilo del pañuelo de Sicán. No usar librerías de íconos para los doodles.
- Íconos UI puntuales: `lucide-react` permitido (Bike, MessageCircle, UtensilsCrossed, Search), con `stroke` azul.

## Orden de secciones — Home (`app/page.tsx`)
1. Hero "Sicán te acompaña" · 2. Manifiesto "Mientras la ciudad duerme" · 3. Horario amable (9PM–4:30AM) · 4. Antojos (grid sticker) · 5. Marquee de sabores · 6. Cómo pedir (3 pasos) · 7. CTA final (Sicán en moto).

## Sección 1 — Hero "Sicán te acompaña"
- **Contenedor:** `relative min-h-[92dvh] overflow-hidden bg-sky` con capa de estrellas doodle + una **luna ámbar** (`--color-amber`) arriba-derecha.
- **Capas por z-index:** `z-0` cielo `--color-sky` + gradiente suave a `--color-paper` abajo; `z-10` estrellas doodle (`twinkle`) + luna; `z-20` **Sicán** (`/mascota.png`, `next/image`, grande, con `float-soft` idle y **tilt-follow**); `z-30` copy.
- **Copy (verbatim):**
  - Eyebrow: "Chiclayo · Delivery nocturno" — pill `.badge-amber` o texto `--color-blue-ink` uppercase `tracking-wide` (Fredoka).
  - H1: "Tu antojo **no duerme**" — "no duerme" en `--color-blue`; `font-display` `clamp(2.75rem,9vw,7rem)` `font-extrabold` `leading-[0.95]`.
  - Body: "Delivery en Chiclayo de 9:00 PM a 4:30 AM. Alitas, chaufa, broaster y más — calientito hasta tu puerta cuando todo lo demás ya cerró." — `text-ink/80`.
  - CTA primario: `<WhatsAppButton size="lg" />` (verde WA, se reutiliza). CTA secundario: link "Ver la carta" → `/carta`, pill `border-3 border-blue text-blue-ink hover:bg-blue/10 rounded-full`.
  - Badge en vivo: `<SmartTime />` (reutilizar la lógica; restyle a `.badge-amber` cuando abierto / gris cuando cerrado).
- **Entrada:** eyebrow→H1→body→CTAs con `pop` + stagger 0.08s.

## Sección 2 — Manifiesto "Mientras la ciudad duerme"
- Bloque de color `bg-blue-deep text-paper`, `rounded-[2.5rem]` con doodles de estrellas en las esquinas.
- Copy display grande (verbatim): "Mientras la ciudad duerme, **nosotros cocinamos**. Tu madrugada tiene quien la acompañe." — palabra clave en `--color-amber`.
- Entrada: `Reveal` (fade-up). **Sin SplitText ni ScrollTrigger.**

## Sección 3 — Horario amable
- Card `.sticker` centrada. **Luna ámbar** cartoon + display `font-display` "9:00 PM — 4:30 AM" en `--color-ink` (número grande), sub "Todos los días · pedidos cierran 4:30 AM en punto".
- Barra de progreso redondeada `bg-hair` con tramo `bg-gradient-to-r from-blue to-amber` y dos marcadores (inicio azul, fin ámbar). Labels "8 PM / madrugada / 5 AM".

## Sección 4 — Antojos (grid sticker)
- H2 "Antojos que no esperan". Grid `sm:grid-cols-2 lg:grid-cols-4` de **sticker cards** (`.sticker .sticker-hover`) para los platos `tag: "top"` de `MENU` (`lib/menu.ts`).
- Cada card: foto `/food/*.jpg` (`rounded-2xl`), nombre `font-display`, `desc` `text-muted`, precio en `.badge-amber` (`formatPrice`), botón "Pedir" → ``waLink(`Hola D'Madrugada 🌙, quiero: 1x ${item.name}`)`` (`target="_blank" rel="noopener noreferrer"`).
- Link "Ver toda la carta →" a `/carta` (`text-blue-ink`).

## Sección 5 — Marquee de sabores
- Dos filas de **pills redondeadas** con nombres de sabores ("Alitas BBQ", "Chaufa", "Broaster", "Salchipapa", "Hamburguesa", …) que se desplazan en direcciones opuestas; fila 1 borde azul, fila 2 relleno ámbar. Parallax ligero por scroll (transform, listener passive). Separadores con `SparkleDoodle`.

## Sección 6 — Cómo pedir (3 pasos)
- 3 **sticker cards** (`StepCard` restyle) con `Reveal` stagger. Contenido verbatim existente:
  1. "01 · Elige tu antojo" — "Revisa la carta y arma tu pedido." (UtensilsCrossed)
  2. "02 · Escríbenos al WhatsApp" — "Indícanos tu pedido y tu dirección exacta." (MessageCircle)
  3. "03 · Recíbelo caliente" — "Llegamos a tu puerta en la madrugada." (Bike)
- Número en `--color-blue`, ícono en un círculo `bg-amber` con `stroke` ink.

## Sección 7 — CTA final (Sicán en moto)
- Bloque `bg-cream` `rounded-[2.5rem]` con **Sicán** (`/mascota.png`) y doodles.
- H2 (verbatim): "El hambre **no espera**." — "no espera" en `--color-blue`. Sub "Escríbenos y te lo llevamos calientito." + `<WhatsAppButton size="lg" />`.

## Página Carta (`app/carta/page.tsx` + `MenuCard` + `CategoryNav`)
- Fondo `--color-paper`. H1 "La carta" (Fredoka). `CategoryNav`: pills redondeadas — activa `bg-blue text-paper`, inactiva `border-hair text-muted hover:border-blue`. `MenuCard` → `.sticker .sticker-hover`, precio en `.badge-amber`, tag "Top" en `.badge-amber`, botón "Pedir" azul outline. Se conserva `MENU`, `formatPrice`, `waLink`.

## Página Zonas (`app/zonas-delivery/page.tsx`) — REDISEÑO
Reemplaza `CoverageRadar`. Orden:
1. **Hero:** eyebrow "Cobertura nocturna" (`badge-amber`), H1 "¿Llegamos a tu **zona**?" ("zona" en `--color-blue`), sub "Repartimos por Chiclayo y alrededores mientras todos duermen. Mira tu zona y cuánto cuesta el envío." + stat "`{ZONES.length}` zonas · desde `{formatPrice(MIN_FEE)}` · hasta las 4:30 AM".
2. **`<ZoneCards />`** (arriba, contenido principal — componente nuevo, `"use client"`):
   - Input de búsqueda (lucide `Search`) que **filtra `ZONES`** por nombre en vivo.
   - Grid `sm:grid-cols-2 lg:grid-cols-3` de sticker cards: nombre de zona, `note` si existe ("según punto"), y tarifa en `.badge-amber` (`formatPrice(z.fee)`). Agrupar/etiquetar por tier de precio ("Más cerca, más barato").
   - Reutiliza `ZONES` de `lib/zones.ts` y `formatPrice`.
3. **Ventana de reparto amable:** misma card de horario de la Home (9PM–4:30AM, luna, barra azul→ámbar). Copy "Los pedidos cierran 4:30 AM en punto — no te quedes con el antojo."
4. **Cómo funciona:** los 3 `StepCard` (reutilizar sección 6).
5. **`<ChiclayoMap />`** (ABAJO — componente nuevo, el ancla visual que reemplaza al radar):
   - **Mapa ilustrado cartoon de Chiclayo** en **SVG** (líneas `--color-blue` 3px, relleno suave `--color-sky`/`--color-cream`), formas amables (no geográfico exacto).
   - **Cocina de D'Madrugada al centro** (marcador con Sicán/luna ámbar). Un **pin por zona** de `ZONES` posicionado de forma legible (no encimados); al **hover/tap** el pin crece y muestra un tooltip con `z.name` + `formatPrice(z.fee)`.
   - Debe incluir las 6 zonas (Centro, Santa Victoria, La Victoria, Federico Villarreal, JLO, Pimentel "según punto").
   - `"use client"` si hay hover/tap interactivo; respetar `prefers-reduced-motion`.
6. **CTA:** "¿Estás dentro de la zona? No esperes más." + `<WhatsAppButton size="lg" />`.

## Interacción firma — "Sicán te acompaña" (mecánica, como algoritmo)
- **Refs/estado:** `mascotRef` (contenedor de `/mascota.png`); `mouse={x,y}` raw; `smooth={x,y}` eased; `rafRef`.
- **Listeners:** `mousemove` en `window` guarda `e.clientX/clientY`. Detectar `matchMedia("(hover:none)")` y `prefers-reduced-motion`.
- **Loop (RAF):** lerp `smooth.x += (mouse.x - smooth.x) * 0.08` (idem y). Calcular vector desde el centro de la mascota; **cap** a ±8px de traslación y ±4° de rotación (`tilt = clamp(dx/40, -4, 4)`). Aplicar `transform: translate(smoothClamped) rotate(tilt deg)` a `mascotRef`, combinado con idle `float-soft`.
- **Fallbacks:** touch/no-hover → solo `float-soft` idle. `prefers-reduced-motion` → sin transform, estático.
- **Cleanup:** remover listener + `cancelAnimationFrame` en el cleanup de `useEffect`.

## Componentes reutilizables (spec)
- **`<Logo>`** (nuevo): `/mascota.png` (h-9/h-10) + wordmark "D'Madrugada" en Fredoka `font-extrabold` `--color-ink` con "D'" en `--color-blue`. Reemplaza el `Moon` de `Header`/`Footer`.
- **`<WhatsAppButton>`** (reutilizar): pill `bg-wa text-ink`… mantener glyph y `waLink`; ajustar sombra a estilo sticker suave.
- **`<Reveal>`** (reutilizar tal cual): entradas `whileInView` con `useReducedMotion`.
- **`<MoonDoodle> <StarDoodle> <SparkleDoodle> <BoneDoodle>`** (nuevos): SVG inline, líneas azules, tomados del pañuelo de Sicán.
- **`<ZoneCards>` `<ChiclayoMap>`** (nuevos, spec arriba).

## Responsividad
- Mobile-first, breakpoints Tailwind (sm 640 / md 768 / lg 1024). `100dvh`/`min-h-[92dvh]` en hero.
- Sicán se reduce y recoloca en mobile (sobre el copy, no detrás). Marquee y grids reflow a 1 columna. Mapa SVG con `viewBox` fluido (`w-full h-auto`), tooltips que no desbordan.
- Tipografía fluida con `clamp()` en todos los titulares.

## Dependencias
Se conservan: `next 16.2`, `react 19`, `tailwindcss ^4`, `motion ^12` (para `Reveal`), `lenis ^1.3` (smooth-scroll opcional), `lucide-react`. **Retirar dependencia visual de** GSAP `ScrollTrigger`/`SplitText` pinned (se pueden dejar instalados pero sin usar los scrubs cinematográficos). Añadir fuentes `Fredoka`/`Nunito` vía `next/font/google` (sin dependencia extra).

## Formato y criterios de aceptación (solo "done" cuando todos pasan)
- [ ] `npm run build` y `npm run lint` sin errores; TS strict OK.
- [ ] Cero superficies oscuras residuales; todos los colores salen de los tokens light definidos (sin `#05070f`, sin `.glow-*`/`.ring-neon`/`.noise`).
- [ ] Fredoka en titulares, Nunito en cuerpo; Space Mono retirado.
- [ ] Sicán aparece como logo (header + footer) y protagonista (hero + CTA); el tilt-follow funciona suave en desktop, idle en touch, estático en reduced-motion.
- [ ] Página de zonas: `ZoneCards` (con búsqueda) arriba y `ChiclayoMap` ilustrado abajo con las 6 zonas y sus tarifas; radar eliminado.
- [ ] Jerarquía de color respetada; **ningún texto ámbar sobre blanco**; blanco solo sobre `--color-blue-deep`/`--color-night`.
- [ ] Sin overflow horizontal a 375 / 768 / 1440 px.
- [ ] `prefers-reduced-motion` desactiva rebotes/parallax/tilt; focus visible en todo interactivo; `waLink` con `target="_blank" rel="noopener noreferrer"` intacto.
- [ ] Se reutilizó `lib/*` y `Reveal`/`SmartTime` sin duplicar lógica.

**Cumple cada detalle de arriba exactamente.**
