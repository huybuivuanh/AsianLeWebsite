import Image from "next/image";
import Link from "next/link";
import OrderPickupCta from "@/components/menu/OrderPickupCta";
import { STORE } from "@/lib/store";

// Placeholder photos — swap for the restaurant's own shots when they're ready.
const HERO_PHOTOS = [
  { src: "/home/discover/Salad Rolls.jpg", alt: "Vietnamese salad rolls", tall: false },
  { src: "/home/hero carousel/3.jpg", alt: "Chow mein with chopsticks", tall: true },
  { src: "/home/discover/Vermicelli Combo.jpg", alt: "Vermicelli combo bowl", tall: false },
];

type HeroSectionProps = {
  /** First row of the hours list, e.g. "Monday – Saturday · 11:00 AM – 8:00 PM". */
  hoursLine: string | null;
  storeSettings: StoreSettings;
};

export default function HeroSection({ hoursLine, storeSettings }: HeroSectionProps) {
  return (
    <section className="bg-ink text-on-ink">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold sm:text-[13px]">
          Chinese &amp; Vietnamese · Prince Albert, SK
        </p>
        <h1 className="mx-auto mt-5 max-w-[15em] text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[1.03] tracking-[-0.035em]">
          Where family, tradition &amp;{" "}
          <span className="font-accent font-normal italic tracking-[-0.01em] text-gold">
            great food
          </span>{" "}
          come together.
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <OrderPickupCta storeSettings={storeSettings} className="inline-flex min-h-13 items-center rounded-full bg-gold px-7 font-bold text-ink transition hover:bg-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
            Order for pickup
          </OrderPickupCta>
          <Link
            href="/reservations"
            className="inline-flex min-h-13 items-center rounded-full border border-[#4a443d] px-7 font-bold text-on-ink transition hover:border-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Reserve a table
          </Link>
        </div>
        <p className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-on-ink-muted">
          {hoursLine ? <span>{hoursLine}</span> : null}
          <span>{STORE.address.line1}</span>
        </p>

        <div className="mt-14 grid items-end gap-4 sm:grid-cols-3">
          {HERO_PHOTOS.map((photo, i) => (
            <div
              key={photo.src}
              className={`relative overflow-hidden rounded-[28px] bg-ink-raised ${photo.tall ? "h-72 sm:h-96" : "hidden h-72 sm:block"}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={i === 1}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
