# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js 16 — read the local docs first

This project uses **Next.js 16.2** (App Router) + **React 19** + **Tailwind CSS v4**. These have breaking changes vs. older training data. Before writing any Next.js / routing / metadata / font code, read the relevant guide under `node_modules/next/dist/docs/` (`01-app`, `02-pages`, `03-architecture`). Heed deprecation notices. This rule comes from `AGENTS.md` and is non-negotiable.

## Commands

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # production build
npm run start    # serve the build
npm run lint     # ESLint (flat config, eslint.config.mjs, next/core-web-vitals + next/typescript)
```

No test suite exists (static marketing site). TypeScript is `strict`.

## What this is

Marketing site for **D'Madrugada**, a late-night food delivery in Chiclayo, Perú (9 PM – 4:30 AM). Three routes: an immersive home (`/`), the menu (`/carta`), and delivery zones (`/zonas-delivery`). **There is no backend, no cart, no auth, no database** — every conversion is a WhatsApp deep link.

## Architecture — the big picture

**All business content lives in typed constants under `lib/`.** Do not hardcode menu items, prices, zones, phone numbers, or URLs in components — edit the source of truth:

| File | Owns |
|---|---|
| `lib/site.ts` | `WA_NUMBER`, social URLs, `SITE` (name/url/hours), and **`waLink(message)`** — the single WhatsApp deep-link builder |
| `lib/menu.ts` | `MENU` (categories → items), `MenuItem`/`MenuCategory` types, `formatPrice` |
| `lib/zones.ts` | `ZONES` (delivery areas + fees) |
| `lib/seo.ts` | `restaurantJsonLd` — schema.org Restaurant JSON-LD |

Data marked `[draft — confirmar]` in comments is placeholder business data to replace before launch (see README's "Personalizar" table). The phone number appears in **two** places — `lib/site.ts` (`WA_NUMBER`) and `lib/seo.ts` (`telephone`) — keep them in sync.

**WhatsApp is the only conversion path.** Every "Pedir" / CTA button is an `<a>` to `waLink(...)` with a prefilled Spanish message (`target="_blank" rel="noopener noreferrer"`). `MenuCard` builds a per-item message. When adding CTAs, reuse `waLink()` / `<WhatsAppButton>` — never construct wa.me URLs by hand.

**Server vs. client split is deliberate and performance-driven:**
- The **home** (`app/page.tsx`) is a stack of `"use client"` section components in `components/home/`. Only the home loads the heavy motion stack (GSAP + ScrollTrigger + Lenis via `<SmoothScroll>`).
- **`/carta` and `/zonas-delivery` are Server Components** and stay light — they render data from `lib/` with small client islands only where interactivity is needed (`CategoryNav` scroll-spy, `CoverageRadar`).
- Keep it this way: don't pull GSAP/Lenis into `/carta` or `/zonas-delivery`.

## Design system (`app/globals.css`, Tailwind v4)

- Brand tokens are CSS variables in `@theme`: `--color-bg`, `--color-blue` (#0074FF), `--color-amber` (#FFBE00), etc. Use the generated utilities (`bg-bg`, `text-amber`, `border-bg-line`, …). "Midnight Neón" dark theme, `color-scheme: dark` — the site is dark-only.
- **next/font families must be wired through `@theme inline`** (not plain `@theme`) — the variables are injected on `<html>` at runtime and plain `@theme` would snapshot them empty at build. Three families: Bricolage Grotesque (`font-display`), Inter (`font-body`/default), Space Mono (`font-mono`), all configured in `app/layout.tsx`.
- Custom utilities live in globals.css: glow effects (`glow-blue`, `glow-amber`, `ring-neon`), entrance/idle animations (`blur-rise`, `animate-bob`, `animate-float-glow`, `animate-pulse-halo`), and `.noise` grain.

## Conventions that will bite you

- **Accessibility & motion are load-bearing, not decoration.** `prefers-reduced-motion` is honored both in CSS (global override in globals.css) and in JS (`SmoothScroll`, `HeroSpotlight` bail out early). Any new animation must degrade gracefully — check the media query in JS effects and rely on the CSS reset otherwise.
- **Hydration-safe client patterns.** Anything depending on the visitor's clock or cursor must not render differently on the server. `SmartTime` returns `null` until mounted; `HeroSpotlight` ships an `INITIAL_MASK` so the hero paints near-black pre-hydration instead of flashing the full photo. Follow these patterns for time/cursor/window-dependent UI.
- **Lenis is synced to the single GSAP ticker** (no second RAF loop) so ScrollTrigger stays in phase — see `SmoothScroll.tsx`. Don't add a separate `requestAnimationFrame` loop for Lenis.
- Path alias `@/*` → repo root (e.g. `@/lib/site`, `@/components/...`).
- SEO is centralized: per-page `metadata` exports, JSON-LD injected once in `app/layout.tsx`, plus `app/sitemap.ts` / `app/robots.ts`. Adding a route means adding it to `sitemap.ts`.
- Content in **Spanish**, code/identifiers/comments in **English**.

## Deploy

Optimized for **Vercel** (Next.js autodetected). Any Node 18+ host works via `npm run build` + `npm run start`.
