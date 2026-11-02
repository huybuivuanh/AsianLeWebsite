import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import PayAtPickupNote from "@/components/checkout/PayAtPickupNote";
import { skipNextImageOptimization } from "@/lib/imagePolicy";
import { formatPriceCAD } from "@/lib/utils";
import { lineBasePrice, lineTotal, type CartLine } from "@/lib/cartStore";

const PLACEHOLDER = "/Soup Bowl Icon.jpg";

type CartDrawerPanelProps = {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  subtotal: number;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
};

const stepperClass =
  "flex h-8 w-8 items-center justify-center rounded-full border border-sand-line bg-white font-bold text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";

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
      ariaLabel="Your order"
      overlayClassName="fixed inset-0 z-50 flex justify-end bg-black/60"
      panelClassName="flex h-full w-full max-w-md flex-col bg-ivory text-ink shadow-2xl"
    >
      <div className="flex items-center justify-between bg-ink px-5 py-4 text-on-ink">
        <h2 className="text-xl font-extrabold">
          Your <span className="font-accent font-normal italic text-gold">order</span>
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-ink-muted transition hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-2">
        {lines.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">Nothing here yet.</p>
        ) : (
          <ul className="divide-y divide-sand-line">
            {lines.map((line) => {
              const basePrice = lineBasePrice(line);
              const src = line.imageUrl || PLACEHOLDER;
              return (
                <li key={line.id} className="flex gap-3.5 py-4">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-sand-deep">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized={skipNextImageOptimization(src)}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-extrabold leading-snug">{line.name}</p>
                      <span className="shrink-0 font-extrabold tabular-nums text-brand">
                        {formatPriceCAD(lineTotal(line))}
                      </span>
                    </div>
                    {basePrice !== 0 && (line.options.length > 0 || line.quantity > 1) ? (
                      <div className="mt-1 flex justify-between gap-2 text-xs text-muted">
                        <span>Item price</span>
                        <span className="shrink-0 tabular-nums">{formatPriceCAD(basePrice)}</span>
                      </div>
                    ) : null}
                    {line.options && line.options.length > 0 ? (
                      <ul className="mt-0.5 space-y-0.5 text-xs text-muted">
                        {line.options.map((s) => (
                          <li key={s.optionId} className="flex justify-between gap-2">
                            <span>
                              {s.name}
                              {s.quantity > 1 ? ` ×${s.quantity}` : ""}
                            </span>
                            {s.price > 0 ? (
                              <span className="shrink-0 tabular-nums">
                                {formatPriceCAD(s.price * s.quantity)}
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {line.instructions ? (
                      <p className="mt-1 text-xs italic text-body">&ldquo;{line.instructions}&rdquo;</p>
                    ) : null}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          className={stepperClass}
                          aria-label={`Decrease ${line.name} quantity`}
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-bold tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          className={stepperClass}
                          aria-label={`Increase ${line.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="min-h-8 rounded-full px-2 text-xs font-bold text-muted transition hover:text-brand"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {lines.length > 0 ? (
        <div className="border-t border-sand-line bg-white px-5 py-4">
          <div className="flex items-center justify-between text-lg font-extrabold">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatPriceCAD(subtotal)}</span>
          </div>
          <p className="text-xs text-muted">Taxes are added at checkout.</p>
          <PayAtPickupNote className="mt-3" />
          <Link
            href="/checkout"
            onClick={onClose}
            className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-5 font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            Go to checkout
          </Link>
        </div>
      ) : null}
    </Modal>
  );
}
