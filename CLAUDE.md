# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Environment Variables

Firebase credentials are required to run the app. Create a `.env.local` with these keys (all prefixed `NEXT_PUBLIC_`):

```
NEXT_PUBLIC_API_KEY
NEXT_PUBLIC_AUTH_DOMAIN
NEXT_PUBLIC_PROJECT_ID
NEXT_PUBLIC_STORAGE_BUCKET
NEXT_PUBLIC_MESSAGING_SENDER_ID
NEXT_PUBLIC_APP_ID
NEXT_PUBLIC_MEASUREMENT_ID
```

Placing an order additionally requires a Firebase Admin service account (server-only, **not** prefixed `NEXT_PUBLIC_` — never exposed to the client). Generate one via Firebase Console → Project Settings → Service Accounts → Generate new private key, then paste the entire downloaded JSON as one line:

```
SERVICE_ACCOUNT_KEY      # the full service-account JSON, as a single-line string
```

Without these, `/api/orders` fails cleanly (checkout UI shows "Network error", nothing crashes) — everything else in the app works fine without them.

## Architecture

**Next.js 16 App Router** with Tailwind CSS v4, TypeScript strict mode, and Firebase (Firestore + Storage) as the backend CMS. Deployed to Vercel.

### Route structure

All pages live under `app/(main)/` using a route group (no URL segment added). `app/layout.tsx` is the root layout (Nav + Footer + JSON-LD schema + Vercel Analytics).

| Route | File |
|---|---|
| `/` | `app/(main)/page.tsx` |
| `/menu` | `app/(main)/menu/page.tsx` |
| `/gallery` | `app/(main)/gallery/page.tsx` |
| `/about-us` | `app/(main)/about-us/page.tsx` |
| `/contact-us` | `app/(main)/contact-us/page.tsx` |
| `/checkout` | `app/(main)/checkout/page.tsx` — cart checkout, pay-at-pickup |
| `POST /api/orders` | `app/api/orders/route.ts` — places an order (see below) |

### Data fetching pattern

Public pages are **async Server Components** with `export const revalidate = 900` (ISR, 15-min TTL) — except `/checkout`, which is `export const dynamic = "force-dynamic"` since store-hours/pause-ordering gating must never be stale. Data is fetched directly from Firestore on the server:

- `lib/siteData.server.ts` — updates, gallery, daily specials (home page)
- `lib/menuData.ts` — **legacy** `categories`/`menuItems` model, no longer used by any page — kept only for reference, do not build on it
- `lib/orderMenuData.ts` — `demoCategories`/`demoMenuItems`/`optionGroups`/`options` (menu page, the active model — see `ecommerce.md`)
- `lib/storeSettings.ts` — `settings/store` (hours/holidays/pause-ordering) and `menuVersion`

All wrap their loaders in React's `cache()` to deduplicate within a single request.

### Ordering feature

The `/menu` page doubles as the ordering UI (see `ecommerce.md` for the full Firestore data-model contract this reads). Key pieces:

- `lib/availability.ts` — pure logic (no Firestore): sold-out/time-window availability for items & options, store open/closed decision tree, and scheduled-pickup validation up to `MAX_SCHEDULE_DAYS_AHEAD` (30 days) via a `datetime-local` calendar+clock input. All timezone math uses `Intl.DateTimeFormat` with the store's IANA timezone — no date library dependency.
- `lib/menuOptions.ts` — resolves a menu item's option groups/options into a display-ready view model with availability computed.
- `lib/cartStore.ts` — client-side cart, Zustand + `persist` (localStorage). Snapshots name/price at add-to-cart time so the cart renders without the full menu loaded; **never trusted for money** — `/api/orders` re-derives every price from live Firestore data. Uses `skipHydration: true` + manual `rehydrate()` (in `CartDrawer`) to avoid an SSR/client hydration mismatch.
- `lib/orderPricing.ts` — GST (5%) + PST (6%) computation, Saskatchewan restaurant meal rates confirmed with the business owner.
- `lib/firebaseAdmin.ts` — trusted server-only Firestore (bypasses security rules) for the one write path that must not be reachable via the public client SDK: `orders`. Requires `SERVICE_ACCOUNT_KEY` above; never import from a Client Component.
- `app/api/orders/route.ts` — validates the cart against live Firestore data (availability, min/max option selection, pickup-time validity) and writes to `orders` via `firebaseAdmin`. See `orders-schema.md` for the Firestore shape, written for the separate admin app to read — **this repo has no admin/order-management UI**, by design (see that doc).

### Firebase collections

| Collection | Type | Used for |
|---|---|---|
| `demoCategories` | `DemoCategory` | Menu category groupings (active model) |
| `demoMenuItems` | `DemoMenuItem` | Individual menu items (active model) |
| `optionGroups` | `OptionGroup` | Reusable modifier groups |
| `options` | `ItemOption` | Individual modifier choices |
| `menuVersion` (doc `versionDoc`) | `MenuVersion` | Bumped on admin publish |
| `settings/store` (single doc) | `StoreSettings` | Hours, holidays, pause-ordering kill switch |
| `orders` | `Order` | Written by this site (`/api/orders`), read by the separate admin app |
| `categories` / `menuItems` | `FoodCategory` / `MenuItem` | **Legacy**, unused, do not build on |
| `dailySpecials` | `DailySpecial` | Day-of-week special configs |
| `dailySpecialItems` | `DailySpecialItem` | Items belonging to daily specials |
| `updates` | `ImageItem` | News/updates on home page |
| `gallery` | `ImageItem` | Gallery page photos |

### Global types

All domain types are declared globally in `types/global.d.ts` — no import needed in component files. This includes the legacy menu model, the active ordering model (`DemoCategory`, `DemoMenuItem`, `OptionGroup`, `ItemOption`, `StoreSettings`, etc. — see `ecommerce.md`), and the `Order` model this site writes (see `orders-schema.md`).

### Key lib files

- `lib/store.ts` — Single source of truth for store details (address, phone, hours, social links). Import `STORE` wherever contact info is needed.
- `lib/imagePolicy.ts` — `skipNextImageOptimization()` — pass this to `unoptimized` on `<Image>` for Firebase Storage URLs to avoid burning Vercel image optimization quota.

### Component conventions

- `"use client"` is only added when React hooks or browser APIs are needed (e.g., `Nav.tsx`, `HeroCarousel`). Everything else is a Server Component.
- Section components under `components/home/` are pure presentational; data is fetched in `app/(main)/page.tsx` and passed as props.
- `components/PageContainer.tsx` wraps content with max-width + horizontal padding.

### Styling

Tailwind CSS v4 with a stone/amber color palette (stone-900 background, amber-500 accent). No custom theme config — all utilities are inline.

### SEO

- `app/sitemap.ts` exports the sitemap.
- `app/robots.ts` exports robots config.
- Each page layout file exports `metadata` for Open Graph and Twitter cards.
- The root layout injects a `Restaurant` JSON-LD schema using data from `lib/store.ts`.
