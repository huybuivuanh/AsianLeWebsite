import Image from "next/image";
import Link from "next/link";
import PageContainer from "./components/PageContainer";
import HeroCarousel from "./components/HeroCarousel";

const testimonials = [
  {
    quote:
      "Bring your taste buds. The flavors are wonderful. Had Special Vietnamese Pho and Stir fried Ginger beef. Food 10 out of 10, Atmosphere 9 out of 10. Reasonable prices. Will be back for sure.",
    author: "Karen F.",
    rating: 5,
  },
  {
    quote:
      "Had a bowl of delicious Pho today — extremely tasty and filling. The hosts are so pleasant and welcoming. This is definitely our new go-to for great food.",
    author: "Cindy T.",
    rating: 5,
  },
  {
    quote:
      "Ordered the deluxe vermicelli bowl with beef. Absolutely outstanding — so fresh and well balanced. Service was very friendly. Fantastic experience!",
    author: "Krysta A.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <>
      <HeroCarousel />

      {/* Welcome to Asian Le Restaurant */}
      <section className="border-y border-stone-200 bg-stone-50 py-16 md:py-24">
        <PageContainer>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
              Welcome to
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Asian Le Restaurant
            </h2>
            <p className="mt-6 leading-relaxed text-stone-600">
              We specialize in serving authentic Chinese and Vietnamese cuisine, with a focus on
              vermicelli noodle bowls, phở beef soup with rice noodles, and delicious bánh mì subs.
              We believe that the key to great food lies in using fresh, high-quality ingredients.
            </p>
            <p className="mt-4 leading-relaxed text-stone-600">
              We take pride in our commitment to customer satisfaction and strive to provide every
              guest with a dining experience that exceeds expectations. Whether you&apos;re stopping
              by for a quick lunch or a leisurely dinner with family and friends, our friendly staff
              will make sure your visit is a memorable one.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-block font-semibold text-amber-700 underline-offset-4 transition hover:text-amber-800 hover:underline"
            >
              About Us →
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Experience - Delicious ingredients */}
      <section className="py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-200">
              <Image
                src="https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80"
                alt="Fresh ingredients and Asian dishes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
                Experience
              </p>
              <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
                Delicious ingredients
              </h2>
              <p className="mt-6 leading-relaxed text-stone-600">
                From ingredients familiar to every Asian food lover to those who cook Asian dishes at
                home — we create extraordinary dishes with absolutely fresh flavours. Under the
                guidance of our chefs, every dish is prepared to bring you unforgettable tastes.
              </p>
              <Link
                href="/menu"
                className="mt-8 inline-block rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                Order Now
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Discover Our Menu */}
      <section className="border-t border-stone-200 bg-stone-50 py-16 md:py-24">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
              Discover
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Our Menu
            </h2>
            <p className="mt-6 leading-relaxed text-stone-600">
              Explore texture, colour and the ultimate tastes with our seasonal menu. All ingredients
              are fresh and carefully selected by our chefs. Enjoy an extraordinary dining experience.
            </p>
            <Link
              href="/menu"
              className="mt-8 inline-block rounded-md bg-stone-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-600 focus:ring-offset-2"
            >
              View Our Menu
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
              What clients say
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Testimonials
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
              >
                <p className="text-stone-600">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 flex items-center justify-between">
                  <cite className="not-italic font-semibold text-stone-900">— {t.author}</cite>
                  <span className="text-amber-500" aria-label={`${t.rating} out of 5 stars`}>
                    {"★".repeat(t.rating)}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Open Hours + Reserve */}
      <section className="border-y border-stone-200 bg-stone-900 py-16 text-stone-100 md:py-24">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-300">
              Reserve a table
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Open Hours</h2>
            <dl className="mt-8 space-y-2 text-stone-300">
              <div className="flex justify-between gap-4">
                <dt>Monday – Saturday</dt>
                <dd>11 AM – 8 PM</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Sunday</dt>
                <dd>11 AM – 7 PM</dd>
              </div>
            </dl>
            <Link
              href="/contact"
              className="mt-10 inline-block rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900"
            >
              Book Now
            </Link>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
