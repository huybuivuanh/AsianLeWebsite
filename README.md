# Asian Le Website

Marketing website for **Asian Le**, a Vietnamese restaurant. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Firebase.

## Pages

| Route | Description |
|---|---|
| `/` | Home / landing page |
| `/menu` | Full menu with daily specials |
| `/gallery` | Photo gallery |
| `/about-us` | About the restaurant |
| `/contact-us` | Contact form and location info |

## Tech Stack

- **Framework**: Next.js 16 (App Router, server-side fetching)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend / CMS**: Firebase (Firestore)
- **Analytics**: Vercel Analytics + Speed Insights
- **Deployment**: Vercel

## Project Structure

```
app/
  (main)/          # Route group for all public pages
  layout.tsx       # Root layout (fonts, analytics)
  sitemap.ts       # Dynamic sitemap for SEO
  robots.ts        # robots.txt

components/
  Nav.tsx          # Top navigation
  Footer.tsx       # Site footer
  Logo.tsx         # Shared logo component
  PageContainer.tsx
  home/            # Home page sections
  menu/            # Menu components
  daily-specials/  # Daily specials section
  contact/         # Contact form components

lib/
  firebase.ts      # Firebase client config
  siteData.server.ts  # Server-side data fetching
  menuData.ts      # Menu data helpers
  store.ts         # Client state
  imagePolicy.ts   # Next.js image domain policy
  utils.ts

types/
  enum.ts
  global.d.ts
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` with your Firebase project credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
