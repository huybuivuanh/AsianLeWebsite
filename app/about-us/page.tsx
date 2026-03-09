import Image from "next/image";
import Link from "next/link";
import PageContainer from "../components/PageContainer";

const TITLE_BG_IMAGE =
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80";

const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80";

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
          src={TITLE_BG_IMAGE}
          alt=""
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
                  We specialize in serving authentic Chinese and Vietnamese
                  cuisine, with a focus on vermicelli noodle bowls, phở beef
                  soup with rice noodles, and delicious bánh mì subs. We believe
                  that the key to great food lies in using fresh, high-quality
                  ingredients.
                </p>
                <p className="mt-4 leading-relaxed text-stone-600">
                  We take pride in our commitment to customer satisfaction and
                  strive to provide every guest with a dining experience that
                  exceeds expectations. Whether you&apos;re stopping by for a
                  quick lunch or a leisurely dinner with family and friends, our
                  friendly staff will make sure your visit is a memorable one.
                </p>
                <p className="mt-4 leading-relaxed text-stone-600">
                  Thank you for choosing Asian Le for your dining experience. We
                  look forward to serving you soon!
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
                  src={ABOUT_IMAGE}
                  alt="Asian Le Restaurant"
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
