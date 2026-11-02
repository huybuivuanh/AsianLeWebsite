import Image from "next/image";
import Link from "next/link";
import { STORE } from "@/lib/store";

const MILESTONES = [
  { year: "2008", title: "We open our doors", text: "Comforting Chinese and Vietnamese dishes that feel like home." },
  { year: "2019", title: "A new chapter", text: "New ownership refreshes the space, the recipes and the service." },
  { year: "Today", title: "Your local go-to", text: "Quick lunches, family dinners and takeout nights in Prince Albert." },
];

const VALUE_PILLARS = [
  { label: "Fresh", sub: "Ingredients", text: "Fresh produce and clean, careful food-safety practices." },
  { label: "Authentic", sub: "Cuisines", text: "Traditional Chinese and Vietnamese recipes." },
  { label: "Experienced", sub: "Kitchen", text: "Years of experience behind every plate." },
  { label: "Happy", sub: "Guests", text: "A friendly, professional welcome every visit." },
];

export default function AboutUs() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 md:flex-row md:items-center md:py-16 lg:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-gold">
              Since 2008 · Prince Albert
            </p>
            <h1 className="mt-3.5 text-[clamp(3rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.035em]">
              About <span className="font-accent font-normal italic text-gold">us</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-on-ink-muted">
              Our story, and what we stand for — Chinese and Vietnamese cooking made with care.
            </p>
          </div>
          <div className="relative aspect-[16/10] w-full min-w-0 flex-1 overflow-hidden rounded-[28px] bg-ink-raised md:max-w-xl">
            <Image
              src="/home/hero carousel/4.jpg"
              alt="Asian Le Restaurant exterior and signage in Prince Albert"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brand">Our story</p>
            <h2 className="mt-3 text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              Our <span className="font-accent font-normal italic">history</span>
            </h2>
            <p className="mt-6 leading-relaxed text-body">
              Asian Le Restaurant opened in 2008 with a simple goal: serve comforting Chinese and
              Vietnamese dishes that feel like home. Over the years, it became a familiar stop for
              quick lunches, family dinners, and takeout nights.
            </p>
            <p className="mt-4 leading-relaxed text-body">
              In 2019, new ownership began a new chapter with fresh energy and a clear focus on
              quality. We improved the space, refined our recipes, and strengthened our day-to-day
              operations so every visit feels smoother, warmer, and more consistent.
            </p>
            <p className="mt-4 leading-relaxed text-body">
              Today, we&apos;re proud to welcome you with friendly service and meals made with care
              in Prince Albert. As a Chinese and Vietnamese restaurant, we&apos;re grateful to be
              part of the community and can&apos;t wait to serve you.
            </p>
            <p lang="vi" className="mt-5 font-accent text-[22px] italic leading-snug text-[#2a2520]">
              “Asian Le Restaurant sẽ luôn nỗ lực nâng cao chất lượng món ăn, cải thiện không gian
              và phục vụ tận tâm để mỗi lần ghé thăm của bạn đều thật thoải mái và đáng nhớ.”
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full min-w-0 flex-1 overflow-hidden rounded-[32px] bg-sand-deep">
            <Image
              src="/About Us.JPG"
              alt="Interior of Asian Le Restaurant dining area in Prince Albert"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <ol className="mt-16 grid gap-4 md:grid-cols-3">
          {MILESTONES.map((m) => (
            <li key={m.year} className="rounded-3xl border border-sand-line bg-white p-6 sm:p-7">
              <p className="text-3xl font-extrabold tracking-tight text-brand">{m.year}</p>
              <p className="mt-2 text-lg font-extrabold">{m.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{m.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Our promise */}
      <section className="bg-ink text-on-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              What we value
            </p>
            <h2 className="mt-3 text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              Our promise <span className="font-accent font-normal italic text-gold">to you</span>
            </h2>
            <p className="mt-5 leading-relaxed text-on-ink-muted">
              We welcome every guest with a friendly, professional attitude. Hygiene and food
              safety are our top priorities — we use fresh ingredients and clean practices so you
              can dine with confidence. Our kitchen brings years of experience to every dish, and
              we are committed to giving you a satisfying, memorable meal.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PILLARS.map(({ label, sub, text }, i) => (
              <li key={label} className="rounded-3xl border border-ink-line bg-ink-raised p-6">
                <p className="text-sm font-extrabold tabular-nums text-gold">0{i + 1}</p>
                <p className="mt-3 text-2xl font-extrabold">{label}</p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{sub}</p>
                <p className="mt-3 text-sm leading-relaxed text-on-ink-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Come see us */}
      <section className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-7 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div>
          <h2 className="text-[clamp(2rem,4vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Come <span className="font-accent font-normal italic text-brand">see us</span>
          </h2>
          <p className="mt-2.5 text-body">
            {STORE.address.line1}, {STORE.address.city} · {STORE.phone}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            View menu
          </Link>
          <Link
            href="/reservations"
            className="inline-flex min-h-12 items-center rounded-full border border-ink px-6 font-bold text-ink transition hover:bg-ink hover:text-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            Reserve a table
          </Link>
          <Link
            href="/contact-us"
            className="inline-flex min-h-12 items-center rounded-full border border-sand-line bg-white px-6 font-bold text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
