import type { Metadata } from "next";
import Image from "next/image";
import ReservationForm from "@/components/reservation/ReservationForm";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";
import { getStoreHours } from "@/lib/siteData.server";
import { STORE } from "@/lib/store";

// Store hours/pause-ordering must be current at request time, not ISR-stale.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description:
    "Book a table at Asian Le Restaurant in Prince Albert, SK — reserve online for lunch or dinner, Chinese & Vietnamese dine-in.",
  openGraph: {
    title: "Reserve a Table | Asian Le Restaurant",
    description:
      "Book a table online for Chinese & Vietnamese dine-in at Asian Le Restaurant, Prince Albert, SK.",
  },
};

const callHref = `tel:${STORE.phone.replace(/\D/g, "")}`;

const STEPS = [
  "Pick a day, time and party size.",
  "We confirm it right on this page — usually within a minute — and send you an email and a text.",
  "See you soon! Need a change? Just call us.",
];

export default async function ReservationsPage() {
  const [storeSettings, hours] = await Promise.all([
    fetchStoreSettingsForServer(),
    getStoreHours().catch(() => [] as StoreHour[]),
  ]);

  return (
    <>
      <section className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:items-center md:py-16 lg:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-gold">
              Dine in · Prince Albert
            </p>
            <h1 className="mt-3.5 text-[clamp(3rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.035em]">
              Reserve a <span className="font-accent font-normal italic text-gold">table</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-on-ink-muted">
              Pick a time and we&apos;ll confirm your reservation right here — usually within a
              minute.
            </p>
          </div>
          <div className="relative aspect-[16/10] w-full min-w-0 flex-1 overflow-hidden rounded-[28px] bg-ink-raised md:max-w-xl">
            <Image
              src="/home/Opening Hours.JPG"
              alt="The dining room at Asian Le Restaurant"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <ReservationForm initialStoreSettings={storeSettings} />

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-ink p-7 text-on-ink">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              Open hours
            </h2>
            <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2.5 text-sm">
              {hours.map(({ id, days, time }) => (
                <div key={id} className="contents">
                  <dt className="text-on-ink-muted">{days}</dt>
                  <dd className={`text-right font-bold ${/closed/i.test(time) ? "text-gold" : ""}`}>
                    {time}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-sand-line bg-white p-7">
            <h2 className="text-lg font-extrabold">Large party?</h2>
            <p className="mt-1.5 text-sm text-body">
              Book online and we&apos;ll call to confirm — or call us directly.
            </p>
            <a
              href={callHref}
              className="mt-4 inline-flex min-h-11 items-center rounded-full border border-ink px-5 text-sm font-bold text-ink transition hover:bg-ink hover:text-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              Call {STORE.phone}
            </a>
          </div>

          <div className="rounded-3xl border border-sand-line bg-white p-7">
            <h2 className="text-lg font-extrabold">How it works</h2>
            <ol className="mt-3 space-y-3">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-body">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-sand-line bg-white p-7">
            <h2 className="text-lg font-extrabold">Find us</h2>
            <address className="mt-1.5 text-sm not-italic text-body">
              {STORE.address.line1}
              <br />
              {STORE.address.city}
            </address>
            <a
              href={STORE.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-md text-sm font-bold text-brand transition hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Open in Google Maps →
            </a>
          </div>
        </aside>
      </section>
    </>
  );
}
