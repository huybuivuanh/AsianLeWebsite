import Image from "next/image";
import Link from "next/link";
import PageContainer from "../../../components/PageContainer";

const VALUE_PILLARS = [
  { label: "Fresh", sub: "Ingredients" },
  { label: "Authentic", sub: "Cuisines" },
  { label: "Experienced", sub: "Kitchen" },
  { label: "Happy", sub: "Guests" },
];

export default function AboutUs() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-stone-800 sm:min-h-[320px]">
        <Image
          src="/home/hero carousel/4.jpg"
          alt="Asian Le Restaurant exterior and signage in Prince Albert"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            About Us
          </h1>
          <p className="mt-4 text-lg text-stone-200 sm:text-xl">
            Our story and what we stand for
          </p>
        </div>
      </section>

      {/* Our History */}
      <section className="border-t border-stone-200 bg-white py-16 md:py-24">
        <PageContainer>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
              <div className="order-2 md:order-1">
                <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
                  Our story
                </p>
                <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
                  Our History
                </h2>
                <p className="mt-6 leading-relaxed text-stone-600">
                  Asian Le Restaurant opened in 2008 with a simple goal: serve
                  comforting Chinese and Vietnamese dishes that feel like home.
                  Over the years, it became a familiar stop for quick lunches,
                  family dinners, and takeout nights.
                </p>
                <p className="mt-4 leading-relaxed text-stone-600">
                  In 2019, new ownership began a new chapter with fresh energy
                  and a clear focus on quality. We improved the space, refined
                  our recipes, and strengthened our day-to-day operations so
                  every visit feels smoother, warmer, and more consistent.
                </p>
                <p className="mt-4 leading-relaxed text-stone-600">
                  Today, we’re proud to welcome you with friendly service and
                  meals made with care in Prince Albert. As a Chinese and
                  Vietnamese restaurant, we&apos;re grateful to be part of the
                  community and can&apos;t wait to serve you.
                </p>
                <p className="mt-4 leading-relaxed text-stone-600">
                  Asian Le Restaurant sẽ luôn nỗ lực nâng cao chất lượng món ăn,
                  cải thiện không gian và phục vụ tận tâm để mỗi lần ghé thăm
                  của bạn đều thật thoải mái và đáng nhớ.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/menu"
                    className="inline-block rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50"
                  >
                    View menu
                  </Link>
                  <Link
                    href="/contact-us"
                    className="inline-block rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-stone-50"
                  >
                    Contact us
                  </Link>
                </div>
              </div>
              <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-xl bg-stone-200 shadow-lg md:order-2">
                <Image
                  src="/About Us.JPG"
                  alt="Interior of Asian Le Restaurant dining area in Prince Albert"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* What We Value */}
      <section className="border-t border-stone-200 bg-stone-50 py-16 md:py-24">
        <PageContainer>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
              What we value
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Our Promise to You
            </h2>
            <p className="mt-6 leading-relaxed text-stone-600">
              We welcome every guest with a friendly, professional attitude.
              Hygiene and food safety are our top priorities — we use fresh
              ingredients and clean practices so you can dine with confidence.
              Our kitchen brings years of experience to every dish, and we are
              committed to giving you a satisfying, memorable meal.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PILLARS.map(({ label, sub }) => (
              <div
                key={label}
                className="rounded-xl border border-stone-200 bg-white px-6 py-6 text-center shadow-sm"
              >
                <p className="text-xl font-bold text-amber-700">{label}</p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wider text-stone-500">
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>
    </>
  );
}
