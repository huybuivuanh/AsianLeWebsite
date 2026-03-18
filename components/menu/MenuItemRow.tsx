"use client";

import Image from "next/image";
import { formatPriceCAD } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";

type MenuItemRowProps = {
  item: MenuItem;
  index: number;
};

export default function MenuItemRow({ item }: MenuItemRowProps) {
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

  return (
    <li className="flex items-start gap-4">
      <button
        type="button"
        onClick={open}
        className="relative h-20 w-25 shrink-0 overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={`View larger image of ${item.name}`}
      >
        <Image
          src={item.image?.url || "/Soup Bowl Icon.jpg"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="100px"
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} image preview`}
          onClick={close}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-stone-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-semibold text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/80"
              aria-label="Close image preview"
            >
              Close
            </button>
            <div className="relative aspect-[4/3] w-full bg-stone-800">
              <Image
                src={item.image?.url || "/Soup Bowl Icon.jpg"}
                alt={item.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 border-b border-dotted border-stone-300 pb-1">
        <p className="text-2xl font-semibold text-stone-900">{item.name}</p>
        {item.description ? (
          <p className="mt-0.5 text-sm italic text-stone-600">
            {item.description}
          </p>
        ) : null}
        {item.options && item.options.length > 0 ? (
          <ul className="mt-1.5 list-inside list-disc space-y-0.5 pl-2 text-medium font-bold text-amber-500">
            {item.options.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <p className="shrink-0 font-semibold tabular-nums text-amber-700">
        {item.price > 0 ? formatPriceCAD(item.price) : ""}
      </p>
    </li>
  );
}
