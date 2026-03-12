"use client";

import { useMemo } from "react";
import { useDailySpecialsStore } from "@/stores/dailySpecialsStore";
import { useDailySpecialItemsStore } from "@/stores/dailySpecialItemsStore";
import { DAY_ORDER_MONDAY_FIRST } from "@/types/enum";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(price);
}

/** Format "11:00" / "14:00" style string to "11:00 AM" / "2:00 PM" */
function formatTimeString(timeStr: string): string {
  if (!timeStr || typeof timeStr !== "string") return "";
  const [h, m] = timeStr.trim().split(":").map(Number);
  if (Number.isNaN(h)) return timeStr;
  const hours = h % 24;
  const mins = Number.isNaN(m) ? 0 : m % 60;
  const period = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${mins.toString().padStart(2, "0")} ${period}`;
}

/** "MONDAY" -> "Monday" */
function formatDayOfWeek(day: string): string {
  if (!day) return "";
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
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
  const schedules = useDailySpecialsStore((state) => state.schedules);
  const itemsById = useDailySpecialItemsStore((state) => state.items);

  const resolvedSchedules = useMemo(() => {
    const itemsMap = new Map(itemsById.map((item) => [item.id, item]));
    const resolved = schedules.map((schedule) => ({
      ...schedule,
      items: (schedule.itemIds ?? [])
        .map((id) => itemsMap.get(id))
        .filter((item): item is DailySpecialItem => item != null),
    }));
    resolved.sort((a, b) => {
      const i = DAY_ORDER_MONDAY_FIRST.indexOf(a.dayOfWeek);
      const j = DAY_ORDER_MONDAY_FIRST.indexOf(b.dayOfWeek);
      return (i === -1 ? 99 : i) - (j === -1 ? 99 : j);
    });
    return resolved;
  }, [schedules, itemsById]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resolvedSchedules.map(({ id, dayOfWeek, timeRange, items }, index) => (
        <div
          key={id}
          className={`${s.card} ${index === resolvedSchedules.length - 1 && resolvedSchedules.length % 3 === 1 ? "lg:col-start-2" : ""}`}
        >
          <p className={s.dayName}>{formatDayOfWeek(dayOfWeek)}</p>
          <p className={s.time}>
            {formatTimeString(timeRange.startTime)} –{" "}
            {formatTimeString(timeRange.endTime)}
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
