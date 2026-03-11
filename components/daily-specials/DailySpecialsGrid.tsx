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

type DailySpecialsGridVariant = "dark" | "light";

const variantStyles = {
  dark: {
    card: "rounded-lg bg-stone-900/70 p-5 backdrop-blur-sm",
    dayName:
      "text-center text-xl font-bold uppercase tracking-wide text-amber-400",
    time: "text-center text-sm text-white/70",
    itemText: "text-base text-white",
    optionsList:
      "mt-2 list-inside list-disc space-y-0.5 pl-2 text-medium font-bold text-blue-400",
    dottedLine: "min-w-[2ch] flex-1 border-b border-dotted border-white/50",
    price: "shrink-0 text-red-500 font-bold tabular-nums",
  },
  light: {
    card: "rounded-xl border border-amber-200/50 bg-white/70 p-5 shadow-sm ring-1 ring-stone-100",
    dayName:
      "text-center text-xl font-bold uppercase tracking-wide text-amber-700",
    time: "text-center text-sm font-bold text-stone-500",
    itemText: "text-base text-stone-900",
    optionsList:
      "mt-2 list-inside list-disc space-y-0.5 pl-2 text-medium font-bold text-blue-400",
    dottedLine: "min-w-[2ch] flex-1 border-b border-dotted border-amber-200/70",
    price: "shrink-0 font-bold tabular-nums text-amber-700",
  },
} as const;

type DailySpecialsGridProps = {
  variant?: DailySpecialsGridVariant;
};

export default function DailySpecialsGrid({
  variant = "dark",
}: DailySpecialsGridProps) {
  const s = variantStyles[variant];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {DAILY_SPECIALS.map(({ id, dayOfWeek, timeRange, items }, index) => (
        <div
          key={id}
          className={`${s.card} ${index === DAILY_SPECIALS.length - 1 && DAILY_SPECIALS.length % 3 === 1 ? "lg:col-start-2" : ""}`}
        >
          <p className={s.dayName}>{DAY_NAMES[dayOfWeek - 1]}</p>
          <p className={s.time}>
            {formatTime(timeRange.startTime)} – {formatTime(timeRange.endTime)}
          </p>
          <ul className="mt-4 space-y-4">
            {items.map((item) => (
              <li key={item.id} className={s.itemText}>
                <p className="leading-snug">{item.name}</p>
                {item.options && item.options.length > 0 && (
                  <ul className={s.optionsList}>
                    {item.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className={s.dottedLine} aria-hidden />
                  <span className={s.price}>{formatPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
