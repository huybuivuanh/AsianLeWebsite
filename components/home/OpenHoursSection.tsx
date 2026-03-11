import Image from "next/image";
import Link from "next/link";
import { STORE } from "@/lib/store";
import PageContainer from "../PageContainer";
import StoreHours from "../contact/StoreHours";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80";

export default function OpenHoursSection() {
  return (
    <section
      id="open-hours"
      className="scroll-mt-28 border-y border-stone-200 bg-stone-50 py-16 md:py-24"
    >
      <PageContainer>
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <div className="order-2 md:order-1">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
              Reserve a table
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Open Hours
            </h2>
            <p className="mt-4 text-stone-600">
              Join us for lunch or dinner. We look forward to serving you.
            </p>
            <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <StoreHours hours={STORE.hours} bordered className="space-y-4" />
            </div>
            <Link
              href="/contact-us"
              className="mt-8 inline-block rounded-lg bg-amber-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50"
            >
              Book Now
            </Link>
          </div>
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-xl bg-stone-200 shadow-md md:order-2">
            <Image
              src={PLACEHOLDER_IMAGE}
              alt="Asian Le Restaurant"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
