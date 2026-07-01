"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import { selectionRuleLabel, type MenuItemViewModel } from "@/lib/menuOptions";

type OrderMenuItemCardProps = MenuItemViewModel;

export default function OrderMenuItemCard({
  item,
  availability,
  optionGroups,
}: OrderMenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  const imageSrc = item.image?.url || "/Soup Bowl Icon.jpg";

  return (
    <li className="flex items-start gap-4">
      <button
        type="button"
        onClick={open}
        className="relative h-20 w-25 shrink-0 overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={`View details for ${item.name}`}
      >
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className={`object-cover ${availability.available ? "" : "grayscale"}`}
          sizes="100px"
          unoptimized={skipNextImageOptimization(imageSrc)}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} details`}
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-semibold text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              aria-label="Close details"
            >
              Close
            </button>
            <div className="relative aspect-[4/3] w-full bg-stone-800">
              <Image
                src={imageSrc}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
                unoptimized={skipNextImageOptimization(imageSrc)}
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-xl font-bold text-stone-900">{item.name}</h4>
                <p className="shrink-0 font-semibold tabular-nums text-amber-700">
                  {formatPriceCAD(item.price)}
                </p>
              </div>
              {item.description ? (
                <p className="mt-2 text-sm text-stone-600">{item.description}</p>
              ) : null}
              {!availability.available ? (
                <p className="mt-3 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {availability.label}
                </p>
              ) : null}

              {optionGroups.length > 0 ? (
                <div className="mt-6 space-y-5">
                  {optionGroups.map(({ group, options }) => (
                    <div key={group.id}>
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-semibold text-stone-900">{group.name}</p>
                        <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
                          {selectionRuleLabel(group)}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {options.map((option) => (
                          <li
                            key={option.id}
                            className={`flex items-center justify-between gap-3 text-sm ${
                              option.availability.available
                                ? "text-stone-700"
                                : "text-stone-400 line-through"
                            }`}
                          >
                            <span>
                              {option.name}
                              {option.id === group.defaultOptionId ? " (default)" : ""}
                            </span>
                            <span className="tabular-nums">
                              {option.price > 0 ? `+${formatPriceCAD(option.price)}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 border-b border-dotted border-stone-300 pb-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <button
            type="button"
            onClick={open}
            className="text-left text-2xl font-semibold text-stone-900 hover:text-amber-700"
          >
            {item.name}
          </button>
          {!availability.available ? (
            <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-stone-500">
              {availability.label}
            </span>
          ) : null}
        </div>
        {item.description ? (
          <p className="mt-0.5 text-sm italic text-stone-600">{item.description}</p>
        ) : null}
      </div>
      <p className="shrink-0 font-semibold tabular-nums text-amber-700">
        {formatPriceCAD(item.price)}
      </p>
    </li>
  );
}
