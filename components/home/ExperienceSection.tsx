import Image from "next/image";
import Link from "next/link";
import PageContainer from "../PageContainer";

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-28 bg-stone-900 py-16 text-stone-100 md:py-24">
      <PageContainer>
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-800">
            <Image
              src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
              alt="Fresh ingredients and Asian dishes"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-amber-300">
              Experience
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Delicious ingredients
            </h2>
            <p className="mt-6 leading-relaxed text-stone-300">
              From ingredients familiar to every Asian food lover to those who
              cook Asian dishes at home — we create extraordinary dishes with
              absolutely fresh flavours. Under the guidance of our chefs, every
              dish is prepared to bring you unforgettable tastes.
            </p>
            <Link
              href="/menu"
              className="mt-8 inline-block rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900"
            >
              See Our Menu
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
