"use client";

import { useMemo } from "react";
import { useDailySpecialsStore } from "@/stores/dailySpecialsStore";
import { useDailySpecialItemsStore } from "@/stores/dailySpecialItemsStore";
import { DAY_ORDER_MONDAY_FIRST } from "@/types/enum";
import {
  formatDayOfWeekLabel,
  formatPriceCAD,
  formatTimeHHmmTo12h,
  sortAlphabetically,
} from "@/lib/utils";

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
    dottedLine:
      "min-w-[3ch] flex-1 border-b border-dotted border-red-500 bg-red-500",
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
  const dailySpecials = useDailySpecialsStore((state) => state.dailySpecials);
  const dailySpecialItems = useDailySpecialItemsStore((state) => state.items);

  const dailySpecialItemsById = useMemo(() => {
    return new Map(dailySpecialItems.map((item) => [item.id, item]));
  }, [dailySpecialItems]);

  const sortedDailySpecials = useMemo(() => {
    const sorted = [...dailySpecials];
    sorted.sort((a, b) => {
      const i = DAY_ORDER_MONDAY_FIRST.indexOf(a.dayOfWeek);
      const j = DAY_ORDER_MONDAY_FIRST.indexOf(b.dayOfWeek);
      return (i === -1 ? 99 : i) - (j === -1 ? 99 : j);
    });
    return sorted;
  }, [dailySpecials]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedDailySpecials.map(
        ({ id, dayOfWeek, timeRange, itemIds }, index) => {
          const items = (itemIds ?? [])
            .map((itemId) => dailySpecialItemsById.get(itemId))
            .filter((item): item is DailySpecialItem => item != null);
          return (
            <div
              key={id}
              className={`${s.card} ${index === sortedDailySpecials.length - 1 && sortedDailySpecials.length % 3 === 1 ? "lg:col-start-2" : ""}`}
            >
              <p className={s.dayName}>{formatDayOfWeekLabel(dayOfWeek)}</p>
              <p className={s.time}>
                {formatTimeHHmmTo12h(timeRange.startTime)} –{" "}
                {formatTimeHHmmTo12h(timeRange.endTime)}
              </p>
              <ul className="mt-4 space-y-4 text-left">
                {sortAlphabetically<DailySpecialItem>(
                  items,
                  (item) => item.name,
                ).map((item) => (
                  <li key={item.id} className={s.itemText}>
                    <p className="leading-snug">{item.name}</p>
                    {item.options && item.options.length > 0 && (
                      <ul className={`${s.optionsList} text-left`}>
                        {item.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-0.5 flex items-baseline gap-2">
                      <span className={s.dottedLine} aria-hidden />
                      <span className={s.price}>
                        {formatPriceCAD(item.price)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        },
      )}
    </div>
  );
}
