import Image from "next/image";
import PageContainer from "../PageContainer";
import { DAILY_SPECIALS } from "@/lib/store";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(price);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

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
            {DAILY_SPECIALS.map(
              ({ id, dayOfWeek, timeRange, items }, index) => (
                <div
                  key={id}
                  className={`rounded-lg bg-stone-900/70 p-5 backdrop-blur-sm ${index === DAILY_SPECIALS.length - 1 && DAILY_SPECIALS.length % 3 === 1 ? "lg:col-start-2" : ""}`}
                >
                  <p className="text-center text-xl font-bold uppercase tracking-wide text-amber-400">
                    {DAY_NAMES[dayOfWeek - 1]}
                  </p>
                  <p className="text-center text-sm text-white/70">
                    {formatTime(timeRange.startTime)} – {formatTime(timeRange.endTime)}
                  </p>
                  <ul className="mt-4 space-y-4">
                    {items.map((item) => (
                      <li key={item.id} className="text-base text-white">
                        <p className="leading-snug">{item.name}</p>
                        {item.options && item.options.length > 0 && (
                          <ul className="mt-2 list-inside list-disc space-y-0.5 pl-2 text-medium font-bold text-blue-400">
                            {item.options.map((opt, i) => (
                              <li key={i}>{opt}</li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-0.5 flex items-baseline gap-2">
                          <span
                            className="min-w-[2ch] flex-1 border-b border-dotted border-white/50"
                            aria-hidden
                          />
                          <span className="shrink-0 text-red-500 font-bold tabular-nums">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </PageContainer>
      </div>
    </section>
  );
}
