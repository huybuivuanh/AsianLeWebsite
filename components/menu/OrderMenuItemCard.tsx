"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import type { MenuItemViewModel } from "@/lib/menuOptions";
import { useLiveMenuAvailability } from "@/components/menu/LiveMenuAvailabilityProvider";
import { useMenuItemSelection } from "@/hooks/useMenuItemSelection";
import ItemDetailModal from "@/components/menu/ItemDetailModal";
import OrderingUnavailableModal from "@/components/menu/OrderingUnavailableModal";

type OrderMenuItemCardProps = MenuItemViewModel;

export default function OrderMenuItemCard({
  item,
  availability: initialAvailability,
  optionGroups: initialOptionGroups,
}: OrderMenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showOrderingUnavailable, setShowOrderingUnavailable] = useState(false);

  const { getItemAvailability, getOptionAvailability, isOrderingAvailable } =
    useLiveMenuAvailability();
  const availability = getItemAvailability(item.id, initialAvailability);
  const optionGroups = initialOptionGroups.map((og) => ({
    ...og,
    options: og.options.map((option) => ({
      ...option,
      availability: getOptionAvailability(option.id, option.availability),
    })),
  }));

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
        className="group flex w-full items-start gap-4 text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={`View details for ${item.name}`}
      >
        <div className="relative h-20 w-25 shrink-0 overflow-hidden rounded-lg bg-white">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            className={`object-cover ${availability.available ? "" : "grayscale"}`}
            sizes="100px"
            unoptimized={skipNextImageOptimization(imageSrc)}
          />
        </div>

        <div className="min-w-0 flex-1 border-b border-dotted border-stone-300 pb-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-semibold text-stone-900 group-hover:text-amber-700">
              {item.name}
            </span>
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
