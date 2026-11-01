import Image from "next/image";
import { STORE } from "@/lib/store";
import StoreMap from "../contact/StoreMap";

type VisitSectionProps = {
  /** Firestore `hours` rows, e.g. { days: "Monday – Saturday", time: "11:00 AM – 8:00 PM" }. */
  hours: StoreHour[];
};

/** Hours, address and contact next to the map, with the storefront photo above. */
export default function VisitSection({ hours }: VisitSectionProps) {
  return (
    <section id="visit" className="scroll-mt-20 bg-ink text-on-ink">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
          Visit us
        </p>
        <h2 className="mt-3 text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
          Join us for lunch or{" "}
          <span className="font-accent font-normal italic text-gold">
            dinner
          </span>
        </h2>

        {/* Storefront — to be replaced with a professional photo. */}
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[32px] bg-ink-raised sm:aspect-[21/9]">
          <Image
            src="/home/Welcome.JPG"
            alt="The Asian Le Restaurant storefront"
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col rounded-[32px] border border-ink-line bg-ink-raised p-8 sm:p-10">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              Open hours
            </h3>
            <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-5 gap-y-3.5">
              {hours.map(({ id, days, time }) => (
                <div key={id} className="contents">
                  <dt className="text-on-ink-muted">{days}</dt>
                  <dd
                    className={`text-right font-bold ${/closed/i.test(time) ? "text-gold" : ""}`}
                  >
                    {time}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 border-t border-ink-line pt-6">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
                Address &amp; contact
              </h3>
              <address className="mt-3 text-[17px] not-italic">
                {STORE.address.line1}
                <br />
                {STORE.address.city}
              </address>
              <p className="mt-2">
                <a
                  href={`tel:${STORE.phone.replace(/\D/g, "")}`}
                  className="font-bold text-on-ink hover:text-gold"
                >
                  {STORE.phone}
                </a>{" "}
                <span className="text-on-ink-muted">· {STORE.email}</span>
              </p>
              <a
                href={STORE.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-md font-bold text-gold transition hover:text-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
          <div className="min-h-[22rem] flex-[1.4] overflow-hidden rounded-[32px]">
            <StoreMap
              embedSrc={STORE.mapEmbedSrc}
              className="h-full rounded-[32px] border-ink-line bg-ink-raised"
              aspect="4/3"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
