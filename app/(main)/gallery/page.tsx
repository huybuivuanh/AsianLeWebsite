import Image from "next/image";
import Link from "next/link";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import OrderPickupCta from "@/components/menu/OrderPickupCta";
import { STORE } from "@/lib/store";
import { getStoreSettings } from "@/lib/storeSettings";
import { fetchGalleryForServer } from "@/lib/siteData.server";

export const revalidate = 900;

export default async function GalleryPage() {
  let items: ImageItem[] = [];
  let error: string | null = null;
  const [galleryRes, storeSettings] = await Promise.all([
    fetchGalleryForServer()
      .then((data) => ({ ok: true as const, data }))
      .catch((err) => ({
        ok: false as const,
        message: err instanceof Error ? err.message : "Failed to load gallery",
      })),
    getStoreSettings(),
  ]);
  if (galleryRes.ok) items = galleryRes.data.filter((item) => item.url);
  else error = galleryRes.message;

  return (
    <>
      <section className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:items-center md:py-16 lg:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-gold">
              Food · Dining room · Prince Albert
            </p>
            <h1 className="mt-3.5 text-[clamp(3rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.035em]">
              Our <span className="font-accent font-normal italic text-gold">gallery</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-on-ink-muted">
              A look at our kitchen&apos;s favourites and the room where we serve them. Tap any
              photo to see it bigger.
            </p>
          </div>
          <div className="relative aspect-[16/10] w-full min-w-0 flex-1 overflow-hidden rounded-[28px] bg-ink-raised md:max-w-xl">
            <Image
              src="/home/hero carousel/2.jpg"
              alt="Dishes at Asian Le Restaurant, Prince Albert"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        {error ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-sand-line bg-white p-8 text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brand">
              Couldn&apos;t load the photos
            </p>
            <p className="mt-3 text-body" role="alert">
              {error}
            </p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted">New photos are coming soon.</p>
        ) : (
          <GalleryGrid items={items} />
        )}
      </section>

      <section className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-7 px-4 py-16 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-[clamp(2rem,4vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              Hungry <span className="font-accent font-normal italic text-gold">yet?</span>
            </h2>
            <p className="mt-2.5 text-on-ink-muted">
              Order for pickup and pay when you get here, or get it delivered.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <OrderPickupCta
              storeSettings={storeSettings}
              className="inline-flex min-h-13 flex-col items-center justify-center rounded-full bg-gold px-7 leading-tight text-ink transition hover:bg-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <span className="font-bold">Order online</span>
              <span className="text-xs font-semibold text-gold-ink">Pay when you pick up</span>
            </OrderPickupCta>
            <a
              href={STORE.socialLinks.skipthedishes}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center gap-2 rounded-full bg-skip px-6 font-bold text-ink transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-skip focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Order on Skip the Dishes
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
              </svg>
            </a>
            <Link
              href="/menu"
              className="inline-flex min-h-13 items-center rounded-full border border-gold px-6 font-bold text-gold transition hover:bg-gold hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              See the menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
