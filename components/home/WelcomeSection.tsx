import Image from "next/image";
import Link from "next/link";
import PageContainer from "../PageContainer";

export default function WelcomeSection() {
  return (
    <section id="welcome" className="scroll-mt-28 border-y border-stone-200 bg-stone-50 py-16 md:py-24">
      <PageContainer>
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="order-2 md:order-1">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
              Welcome to
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Asian Le Restaurant
            </h2>
            <p className="mt-6 leading-relaxed text-stone-600">
              We specialize in serving authentic Chinese and Vietnamese cuisine,
              with a focus on vermicelli noodle bowls, phở beef soup with rice
              noodles, and delicious bánh mì subs. We believe that the key to
              great food lies in using fresh, high-quality ingredients.
            </p>
            <p className="mt-4 leading-relaxed text-stone-600">
              We take pride in our commitment to customer satisfaction and
              strive to provide every guest with a dining experience that
              exceeds expectations. Whether you&apos;re stopping by for a quick
              lunch or a leisurely dinner with family and friends, our friendly
              staff will make sure your visit is a memorable one.
            </p>
            <Link
              href="/about-us"
              className="mt-8 inline-block font-semibold text-amber-700 underline-offset-4 transition hover:text-amber-800 hover:underline"
            >
              About Us →
            </Link>
          </div>
          {/* Replace src with your restaurant image (e.g. from /public/restaurant.jpg) */}
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-lg bg-stone-200 shadow-lg md:order-2">
            <Image
              src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
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
