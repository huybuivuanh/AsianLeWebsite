import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import { lineTotal, type CartLine } from "@/lib/cartStore";

type CartDrawerPanelProps = {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  subtotal: number;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
};

export default function CartDrawerPanel({
  open,
  onClose,
  lines,
  subtotal,
  updateQuantity,
  removeLine,
}: CartDrawerPanelProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel="Cart"
      overlayClassName="fixed inset-0 z-50 flex justify-end bg-black/50"
      panelClassName="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
        <h2 className="text-lg font-bold text-stone-900">Your order</h2>
        <button
          type="button"
          onClick={onClose}
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
                  {line.options && line.options.length > 0 ? (
                    <ul className="mt-1 space-y-0.5 text-xs text-stone-500">
                      {line.options.map((s) => (
                        <li key={s.optionId}>
                          {s.name}
                          {s.quantity > 1 ? ` x${s.quantity}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {line.instructions ? (
                    <p className="mt-1 text-xs italic text-stone-500">
                      &ldquo;{line.instructions}&rdquo;
                    </p>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
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
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
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
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              No payment now — you&apos;ll pay in person when you pick up
              your order.
            </span>
          </div>
          <Link
            href="/checkout"
            onClick={onClose}
            className="mt-3 block w-full rounded-full bg-amber-500 px-5 py-3 text-center text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400"
          >
            Checkout
          </Link>
        </div>
      ) : null}
    </Modal>
  );
}
