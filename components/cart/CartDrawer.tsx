"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import {
  useCartStore,
  cartItemCount,
  cartSubtotal,
  lineTotal,
} from "@/lib/cartStore";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const itemCount = cartItemCount(lines);
  const subtotal = cartSubtotal(lines);

  return (
    <>
      {itemCount > 0 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3.5 text-white shadow-lg shadow-stone-900/25 transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          <span className="text-sm font-semibold tabular-nums">
            {formatPriceCAD(subtotal)}
          </span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-stone-900">
            {itemCount}
          </span>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="Cart"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <h2 className="text-lg font-bold text-stone-900">Your order</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <p className="text-center text-sm text-stone-500">
                  Your cart is empty.
                </p>
              ) : (
                <ul className="space-y-4">
                  {lines.map((line) => (
                    <li
                      key={line.id}
                      className="flex gap-3 border-b border-stone-100 pb-4"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {line.imageUrl ? (
                          <Image
                            src={line.imageUrl}
                            alt={line.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            unoptimized={skipNextImageOptimization(line.imageUrl)}
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-stone-900">{line.name}</p>
                          <p className="shrink-0 font-semibold tabular-nums text-amber-700">
                            {formatPriceCAD(lineTotal(line))}
                          </p>
                        </div>
                        {line.options.length > 0 ? (
                          <ul className="mt-1 space-y-0.5 text-xs text-stone-500">
                            {line.options.map((s) => (
                              <li key={s.optionId}>
                                {s.name}
                                {s.quantity > 1 ? ` x${s.quantity}` : ""}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(line.id, line.quantity - 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                              aria-label={`Decrease ${line.name} quantity`}
                            >
                              −
                            </button>
                            <span className="w-4 text-center text-sm tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(line.id, line.quantity + 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                              aria-label={`Increase ${line.name} quantity`}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLine(line.id)}
                            className="text-xs font-medium text-stone-400 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 ? (
              <div className="border-t border-stone-200 px-5 py-4">
                <div className="flex items-center justify-between text-base font-semibold text-stone-900">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatPriceCAD(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">Pay at pickup.</p>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="mt-3 block w-full rounded-full bg-amber-500 px-5 py-3 text-center text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400"
                >
                  Checkout
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
