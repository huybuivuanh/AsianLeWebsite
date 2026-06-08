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

### Data fetching pattern

All pages are **async Server Components** with `export const revalidate = 900` (ISR, 15-min TTL). Data is fetched directly from Firestore on the server:

- `lib/siteData.server.ts` — updates, gallery, daily specials (home page)
- `lib/menuData.ts` — food categories and menu items (menu page)

Both files wrap their loaders in React's `cache()` to deduplicate within a single request (e.g., daily specials are fetched once even though both the home page and menu page need them).

### Firebase collections

| Collection | Type | Used for |
|---|---|---|
| `categories` | `FoodCategory` | Menu category groupings |
| `menuItems` | `MenuItem` | Individual menu items |
| `dailySpecials` | `DailySpecial` | Day-of-week special configs |
| `dailySpecialItems` | `DailySpecialItem` | Items belonging to daily specials |
| `updates` | `ImageItem` | News/updates on home page |
| `gallery` | `ImageItem` | Gallery page photos |

### Global types

All domain types (`FoodCategory`, `MenuItem`, `DailySpecial`, `DailySpecialItem`, `ImageItem`, `TimeRange`) are declared globally in `types/global.d.ts` — no import needed in component files.

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
