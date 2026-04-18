# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev        # Dev server at localhost:4321
pnpm run build      # Production build → ./dist/
pnpm run preview    # Preview built site
pnpx astro check   # TypeScript checking (no test suite configured)
```

## Architecture

**STAURANT** is an Astro 5 PWA for tracking restaurants and dishes. It uses Supabase for auth + data, with a client-side cache layer for near-instant UI updates.

### Data flow

1. **Auth check** on every page load via `supabase.auth.getSession()` (reads localStorage — synchronous).
2. **`initCache(userId)`** in `src/lib/data.ts` loads all user data from Supabase on first page load, stores in `localStorage` under `staurant_cache_v2`.
3. **All subsequent reads** hit the cache synchronously — zero latency.
4. **Writes** update the cache immediately, then fire a background `bgSync()` call to Supabase without blocking the UI (optimistic updates).
5. **Custom events** (`restaurant:created`, `dish:updated`, etc.) decouple the data layer from UI — handlers live in page `<script>` blocks and re-render HTML directly.

### Key files

| File | Role |
|---|---|
| `src/lib/data.ts` | Cache management, all CRUD functions, background sync |
| `src/lib/supabase.ts` | Supabase client singleton |
| `src/scripts/store.ts` | Event bus helpers + HTML card renderers |
| `src/layouts/Layout1.astro` | Root layout: meta, fonts, ViewTransitions, header |
| `src/styles/global.css` | CSS reset, variables, typography, base utilities |
| `src/styles/project.css` | STAURANT-specific component styles |

### Pages

- `src/pages/index.astro` — Restaurant list with visited/pending tabs and sort controls
- `src/pages/restaurante.astro` — Restaurant detail + dish management (`?id=…`)
- `src/pages/login.astro` — Auth (login + register tab switcher)
- `src/pages/perfil.astro` — User profile + logout

### Interactivity pattern

All pages use the `astro:page-load` / `astro:after-swap` lifecycle:
- `astro:after-swap` — Pre-render from cache before the ViewTransition animation starts
- `astro:page-load` — Wire up event listeners and interactive logic

Every page sets up an `AbortController` to clean up listeners on navigation (prevents duplicate handlers across soft navigations).

### CSS architecture

- **`global.css`** — Variables, reset, typography, layout helpers (`.flex-column`, `.flex-row`, `.boton`, `.boton2`, `.cards-grid`), modal overlay
- **`project.css`** — Component-specific styles (cards, badges, forms, modals)
- **Scoped `<style>` blocks** — Used sparingly for component-specific overrides

Design tokens in `global.css`:
```css
--clr-primary: #546b41        /* brand green */
--clr-white: #fff8ec          /* off-white background */
--clr-text: #363630
--border-radius: 12px
--transition: 0.12s ease
```

Rating badge classes: `.badge-low` (≤4, pink), `.badge-mid` (5–7, yellow), `.badge-high` (8+, green).

### PWA

Configured via `@vite-pwa/astro` in `astro.config.mjs`. Static assets are Workbox-cached; Supabase API calls use `NetworkOnly` (never cached). No offline fallback — app requires network for auth/data.

### Environment variables

```
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
```

Both are public (`PUBLIC_` prefix) and safe to expose in the browser bundle.

### TypeScript

Extends `astro/tsconfigs/strict`. No `any` types; null checks enforced. Run `npx astro check` to verify before committing.

### bgSync y callbacks asíncronos

`bgSync` en `data.ts` ejecuta operaciones Supabase en segundo plano. Siempre usa `Promise.resolve(fn())` en lugar de `fn().catch(...)` directo, para que funcione aunque `fn` no retorne una promesa:

```typescript
// ✅ Correcto
function bgSync(fn: () => unknown): void {
  Promise.resolve(fn()).catch((err) => console.error("[staurant sync]", err));
}

// ❌ Rompe si fn() retorna undefined
function bgSync(fn: () => Promise<unknown>): void {
  fn().catch((err) => console.error("[staurant sync]", err));
}
```

Aplica este mismo patrón en cualquier otro lugar donde se llame `.catch()` sobre el resultado de una función cuyo tipo de retorno no está 100% garantizado como `Promise`.
