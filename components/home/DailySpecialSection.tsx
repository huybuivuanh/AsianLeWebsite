import Image from "next/image";
import DailySpecialsGrid from "../daily-specials/DailySpecialsGrid";
import PageContainer from "../PageContainer";

export default function DailySpecialSection() {
  return (
    <section id="daily-special" className="scroll-mt-28 relative overflow-hidden py-16 md:py-24">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-stone-900/75" />
      </div>

      <div className="relative z-10">
        <PageContainer>
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-white/90">
              Happy customers
            </p>
            <h2 className="mt-2 border-b-4 border-double border-white/40 pb-2 text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
              Daily Special
            </h2>
            <p className="mt-6 leading-relaxed text-white/95">
              From experiences with satisfied customers, the Chef introduces
              great value daily specials so you can choose your favourite dishes
              each day at Asian Le Restaurant.
            </p>
          </div>

          <div className="mt-12">
            <DailySpecialsGrid variant="dark" />
          </div>
        </PageContainer>
      </div>
    </section>
  );
}
