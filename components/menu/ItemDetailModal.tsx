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

const INSTRUCTIONS_MAX_LENGTH = 200;

/**
 * Full-screen "item detail page" (not a centered dialog) — covers the whole viewport with
 * its own back-button header, like a native app screen, rather than floating a card over a
 * dimmed backdrop. Centered dialogs read as cramped/fiddly on small screens; this reads as
 * a real page you navigate into and back out of.
 */
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
    instructions,
    setInstructions,
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
      overlayClassName="fixed inset-0 z-50 bg-white"
      panelClassName="flex h-full w-full flex-col"
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-stone-200 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Back to menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h4 className="min-w-0 flex-1 truncate text-center text-lg font-bold text-stone-900 sm:text-xl">
          {item.name}
        </h4>
        <div className="w-9 shrink-0" aria-hidden />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl">
          <div className="relative aspect-[4/3] w-full bg-stone-800 sm:mt-6 sm:aspect-[16/9] sm:overflow-hidden sm:rounded-2xl">
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
          <div className="px-4 pt-6 pb-5 sm:px-0">
            {item.description ? (
              <p className="text-base font-medium text-stone-700">
                {item.description}
              </p>
            ) : null}
            {item.price > 0 ? (
              <p className="mt-2 font-semibold tabular-nums text-amber-700">
                {formatPriceCAD(item.price)}
              </p>
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
                                <span
                                  className={
                                    option.availability.available
                                      ? ""
                                      : "line-through"
                                  }
                                >
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

            <div className="mt-6">
              <label
                htmlFor="item-instructions"
                className="font-semibold text-stone-900"
              >
                Special instructions{" "}
                <span className="font-normal text-stone-500">(optional)</span>
              </label>
              <textarea
                id="item-instructions"
                value={instructions}
                onChange={(e) =>
                  setInstructions(
                    e.target.value.slice(0, INSTRUCTIONS_MAX_LENGTH),
                  )
                }
                maxLength={INSTRUCTIONS_MAX_LENGTH}
                rows={2}
                placeholder="e.g. no cilantro, extra spicy"
                className="mt-2 w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="mt-1 text-right text-xs text-stone-400">
                {instructions.length}/{INSTRUCTIONS_MAX_LENGTH}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-stone-200 px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
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
