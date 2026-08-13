"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import type { MenuItemViewModel } from "@/lib/menuOptions";
import { useMenuItemSelection } from "@/hooks/useMenuItemSelection";
import ItemDetailModal from "@/components/menu/ItemDetailModal";
import OrderingUnavailableModal from "@/components/menu/OrderingUnavailableModal";

type OrderMenuItemCardProps = MenuItemViewModel & {
  /** Whether the store is currently accepting orders at all (live, from the parent). */
  isOrderingAvailable: boolean;
  /** Auto-opens this item's modal on mount — used for deep links from /menu (?item=<id>). */
  autoOpen?: boolean;
};

export default function OrderMenuItemCard({
  item,
  availability,
  optionGroups,
  isOrderingAvailable,
  autoOpen = false,
}: OrderMenuItemCardProps) {
  // Mirrors the open() handler below (gate on isOrderingAvailable, else show the
  // unavailable modal) — evaluated once on mount instead of on click. Safe as a lazy
  // initializer since isOrderingAvailable is derived synchronously from the SSR-fetched
  // storeSettings on first render, no async wait involved.
  const [isOpen, setIsOpen] = useState(() => autoOpen && isOrderingAvailable);
  const [showOrderingUnavailable, setShowOrderingUnavailable] = useState(
    () => autoOpen && !isOrderingAvailable,
  );

  const selection = useMenuItemSelection(item, optionGroups, availability);

  const open = useCallback(() => {
    if (!isOrderingAvailable) {
      setShowOrderingUnavailable(true);
      return;
    }
    selection.reset();
    setIsOpen(true);
  }, [isOrderingAvailable, selection]);
  const close = useCallback(() => setIsOpen(false), []);
  const closeOrderingUnavailable = useCallback(() => setShowOrderingUnavailable(false), []);

  const imageSrc = item.image?.url || "/Soup Bowl Icon.jpg";

  return (
    <li>
      <button
        type="button"
        onClick={open}
        className="group flex w-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={`View details for ${item.name}`}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            className={`object-cover transition duration-300 group-hover:scale-105 ${availability.available ? "" : "grayscale"}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized={skipNextImageOptimization(imageSrc)}
          />
          {!availability.available ? (
            <span className="absolute left-2 top-2 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              {availability.label}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3.5">
          <span className="line-clamp-1 font-semibold text-stone-900 group-hover:text-amber-700">
            {item.name}
          </span>
          {item.description ? (
            <p className="line-clamp-2 text-xs text-stone-500">{item.description}</p>
          ) : null}
          <span className="mt-auto pt-1 font-semibold tabular-nums text-amber-700">
            {formatPriceCAD(item.price)}
          </span>
        </div>
      </button>

      <ItemDetailModal
        open={isOpen}
        onClose={close}
        item={item}
        availability={availability}
        optionGroups={optionGroups}
        selection={selection}
        onAddedToCart={close}
      />

      <OrderingUnavailableModal
        open={showOrderingUnavailable}
        onClose={closeOrderingUnavailable}
      />
    </li>
  );
}
