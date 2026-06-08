import Image from "next/image";
import Link from "next/link";
import DailySpecialsGrid from "../daily-specials/DailySpecialsGrid";
import PageContainer from "../PageContainer";

type DailySpecialSectionProps = {
  dailySpecials: DailySpecial[];
  dailySpecialItems: DailySpecialItem[];
  error?: string | null;
};

export default function DailySpecialSection({
  dailySpecials,
  dailySpecialItems,
  error,
}: DailySpecialSectionProps) {
  return (
    <section
      id="daily-special"
      className="scroll-mt-28 relative overflow-hidden py-16 md:py-24"
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="/home/Daily Special.jpg"
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
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mt-2 border-b-4 border-double border-white/40 pb-2 text-3xl font-bold uppercase tracking-wide text-amber-500 sm:text-4xl">
              Daily Special (11:00 AM - 2:00 PM)
            </h2>
            <p className="mt-6 leading-relaxed text-white/95">
              Join us for our daily specials—freshly prepared, great value, and
              perfect for a quick lunch or an easy midday treat at Asian Le
              Restaurant.
            </p>
          </div>

          {error ? (
            <p className="mx-auto mt-12 max-w-2xl text-center text-red-200" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-12">
            <DailySpecialsGrid
              variant="dark"
              dailySpecials={dailySpecials}
              dailySpecialItems={dailySpecialItems}
            />
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/menu"
              className="inline-block rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900"
            >
              See Our Menu
            </Link>
          </div>
        </PageContainer>
      </div>
    </section>
  );
}
