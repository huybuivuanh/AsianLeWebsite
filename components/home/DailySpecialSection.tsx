import Image from "next/image";
import PageContainer from "../PageContainer";
import { DAILY_SPECIALS } from "@/lib/store";

export default function DailySpecialSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
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

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DAILY_SPECIALS.map(({ dayOfWeek, items }, index) => (
              <div
                key={dayOfWeek}
                className={`rounded-lg bg-stone-900/70 p-5 backdrop-blur-sm ${index === 6 ? "lg:col-start-2" : ""}`}
              >
                <p className="text-center text-lg font-bold uppercase tracking-wide text-amber-400">
                  {dayOfWeek}
                </p>
                <ul className="mt-4 space-y-3">
                  {items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-baseline gap-2 text-sm text-white"
                    >
                      <span className="min-w-0 shrink overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.name}
                      </span>
                      <span
                        className="min-w-[2ch] flex-1 border-b border-dotted border-white/50"
                        aria-hidden
                      />
                      <span className="shrink-0 font-medium tabular-nums">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>
    </section>
  );
}
