import Link from "next/link";
import { STORE } from "@/lib/store";
import { getStoreHours } from "@/lib/siteData.server";
import ContactForm from "@/components/contact/ContactForm";
import StoreMap from "@/components/contact/StoreMap";
import {
  EmailIcon,
  FacebookIcon,
  GoogleIcon,
  PhoneIcon,
  RestaurantGuruIcon,
  SkipTheDishesIcon,
  TripAdvisorIcon,
  YelpIcon,
} from "@/components/contact/ContactIcons";

/** Revalidate store hours periodically (~15 min). */
export const revalidate = 900;

const telHref = `tel:${STORE.phone.replace(/\D/g, "")}`;

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

const QUICK_ACTIONS = [
  { label: "Call us", value: STORE.phone, href: telHref, Icon: PhoneIcon, external: false },
  { label: "Email us", value: STORE.email, href: `mailto:${STORE.email}`, Icon: EmailIcon, external: false },
  { label: "Visit us", value: STORE.address.line1, href: STORE.googleMapsLink, Icon: PinIcon, external: true },
];

const ONLINE_LINKS = [
  { label: "Facebook", href: STORE.socialLinks.facebook, Icon: FacebookIcon },
  { label: "Tripadvisor", href: STORE.socialLinks.tripadvisor, Icon: TripAdvisorIcon },
  { label: "Yelp", href: STORE.socialLinks.yelp, Icon: YelpIcon },
  { label: "Restaurant Guru", href: STORE.socialLinks.restaurantguru, Icon: RestaurantGuruIcon },
];

export default async function ContactUs() {
  const hours = await getStoreHours().catch(() => [] as StoreHour[]);

  return (
    <>
      <section className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 md:py-16 lg:flex-row lg:items-end lg:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-gold">
              Visit · Call · Write
            </p>
            <h1 className="mt-3.5 text-[clamp(3rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.035em]">
              Get in <span className="font-accent font-normal italic text-gold">touch</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-on-ink-muted">
              We&apos;d love to hear from you. Stop by for a meal, give us a call, or send a
              message below.
            </p>
          </div>
          <ul className="grid min-w-0 flex-1 gap-3 sm:grid-cols-3">
            {QUICK_ACTIONS.map(({ label, value, href, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col rounded-3xl border border-ink-line bg-ink-raised p-5 transition hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-4 text-sm font-semibold text-on-ink-muted">{label}</span>
                  <span className="mt-0.5 break-words font-bold text-on-ink group-hover:text-gold">
                    {value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <ContactForm />

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-ink p-7 text-on-ink">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              Open hours
            </h2>
            <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2.5 text-sm">
              {hours.map(({ id, days, time }) => (
                <div key={id ?? days} className="contents">
                  <dt className="text-on-ink-muted">{days}</dt>
                  <dd className={`text-right font-bold ${/closed/i.test(time) ? "text-gold" : ""}`}>
                    {time}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href={telHref}
              className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-gold px-5 font-bold text-ink transition hover:bg-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Call {STORE.phone}
            </a>
          </div>

          <div className="rounded-3xl border border-sand-line bg-white p-7">
            <h2 className="text-lg font-extrabold">Booking a table?</h2>
            <p className="mt-1.5 text-sm text-body">
              Reserve online and we&apos;ll confirm it within a minute.
            </p>
            <Link
              href="/reservations"
              className="mt-4 inline-flex min-h-11 items-center rounded-full border border-ink px-5 text-sm font-bold text-ink transition hover:bg-ink hover:text-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              Reserve online →
            </Link>
          </div>

          <div className="rounded-3xl border border-sand-line bg-white p-7">
            <h2 className="text-lg font-extrabold">Find us online</h2>
            <p className="mt-1.5 text-sm text-body">Enjoyed your meal? A Google review helps us a lot.</p>
            <a
              href={STORE.socialLinks.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex min-h-11 items-center gap-2.5 rounded-full border border-sand-line bg-white px-5 text-sm font-bold text-ink shadow-[0_2px_8px_rgba(20,18,16,0.06)] transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              <GoogleIcon className="h-5 w-5 shrink-0" />
              Review us on Google
            </a>
            <a
              href={STORE.socialLinks.skipthedishes}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex min-h-11 items-center gap-2.5 rounded-full bg-skip px-5 text-sm font-bold text-ink transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              <SkipTheDishesIcon className="h-4 w-4 shrink-0" />
              Order on Skip the Dishes
            </a>
            <ul className="mt-3 flex flex-wrap gap-2">
              {ONLINE_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-2 rounded-full border border-sand-line px-3.5 text-sm font-bold text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-brand" />
                    <span className="whitespace-nowrap">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 md:py-20 lg:flex-row lg:items-center lg:px-8">
          <div className="lg:w-80 lg:shrink-0">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              Find us
            </p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              Right on <span className="font-accent font-normal italic text-gold">6th Ave E</span>
            </h2>
            <address className="mt-4 not-italic leading-relaxed text-on-ink-muted">
              {STORE.name}
              <br />
              {STORE.address.line1}
              <br />
              {STORE.address.city}
            </address>
            <a
              href={STORE.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 items-center rounded-full border border-gold px-6 font-bold text-gold transition hover:bg-gold hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Get directions →
            </a>
          </div>
          <StoreMap
            embedSrc={STORE.mapEmbedSrc}
            aspect="responsive"
            className="min-w-0 flex-1 rounded-[28px] border-ink-line bg-ink-raised"
          />
        </div>
      </section>
    </>
  );
}
