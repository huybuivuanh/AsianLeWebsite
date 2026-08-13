"use client";

import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import { selectionRuleLabel, type MenuItemViewModel } from "@/lib/menuOptions";
import type { AvailabilityStatus } from "@/lib/availability";
import type { MenuItemSelection } from "@/hooks/useMenuItemSelection";

type ItemDetailModalProps = {
  open: boolean;
  onClose: () => void;
  item: MenuItemViewModel["item"];
  availability: AvailabilityStatus;
  optionGroups: MenuItemViewModel["optionGroups"];
  selection: MenuItemSelection;
  onAddedToCart: () => void;
};

export default function ItemDetailModal({
  open,
  onClose,
  item,
  availability,
  optionGroups,
  selection,
  onAddedToCart,
}: ItemDetailModalProps) {
  const imageSrc = item.image?.url || "/Soup Bowl Icon.jpg";
  const {
    itemQuantity,
    setItemQuantity,
    selections,
    selectSingle,
    toggleMulti,
    setOptionQuantity,
    total,
    canAddToCart,
    addToCart,
  } = selection;

  function handleAddToCart() {
    if (addToCart()) onAddedToCart();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={`${item.name} details`}
      panelClassName="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
    >
      <button
        type="button"
        onClick={onClose}
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
          {item.price > 0 ? (
            <p className="shrink-0 font-semibold tabular-nums text-amber-700">
              {formatPriceCAD(item.price)}
            </p>
          ) : null}
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
            {optionGroups.map(({ group, options }) => {
              const selected = selections[group.id] ?? [];
              const isSingle = group.maxSelection <= 1;
              const atMax = selected.length >= group.maxSelection;
              return (
                <fieldset key={group.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <legend className="font-semibold text-stone-900">
                      {group.name}
                    </legend>
                    <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
                      {selectionRuleLabel(group)}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {options.map((option) => {
                      const isSelected = selected.some(
                        (s) => s.optionId === option.id,
                      );
                      const selectedQty =
                        selected.find((s) => s.optionId === option.id)
                          ?.quantity ?? 1;
                      const disabled =
                        !option.availability.available ||
                        (!isSingle && !isSelected && atMax);
                      return (
                        <li
                          key={option.id}
                          className={`flex items-center justify-between gap-3 text-sm ${
                            option.availability.available
                              ? "text-stone-700"
                              : "text-stone-400"
                          }`}
                        >
                          <label className="flex flex-1 items-center gap-2">
                            <input
                              type={isSingle ? "radio" : "checkbox"}
                              name={`group-${group.id}`}
                              checked={isSelected}
                              disabled={disabled}
                              onChange={() =>
                                isSingle
                                  ? selectSingle(
                                      group.id,
                                      option.id,
                                      group.minSelection === 0,
                                    )
                                  : toggleMulti(
                                      group.id,
                                      option.id,
                                      group.maxSelection,
                                    )
                              }
                              className="h-4 w-4 accent-amber-600"
                            />
                            <span className={option.availability.available ? "" : "line-through"}>
                              {option.name}
                              {!option.availability.available
                                ? ` (${option.availability.label})`
                                : ""}
                            </span>
                          </label>
                          {isSelected && group.multipleOptionQuantity ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setOptionQuantity(
                                    group.id,
                                    option.id,
                                    selectedQty - 1,
                                  )
                                }
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                                aria-label={`Decrease ${option.name} quantity`}
                              >
                                −
                              </button>
                              <span className="w-4 text-center tabular-nums">
                                {selectedQty}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setOptionQuantity(
                                    group.id,
                                    option.id,
                                    selectedQty + 1,
                                  )
                                }
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                                aria-label={`Increase ${option.name} quantity`}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="tabular-nums">
                              {option.price > 0
                                ? `+${formatPriceCAD(option.price)}`
                                : ""}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              );
            })}
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-stone-200 pt-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center font-medium tabular-nums">
              {itemQuantity}
            </span>
            <button
              type="button"
              onClick={() => setItemQuantity((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="flex-1 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
          >
            {availability.available
              ? `Add to cart — ${formatPriceCAD(total)}`
              : availability.label}
          </button>
        </div>
      </div>
    </Modal>
  );
}
