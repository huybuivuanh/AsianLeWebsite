import { formatPriceCAD } from "@/lib/utils";

type CartTriggerButtonProps = {
  itemCount: number;
  subtotal: number;
  onClick: () => void;
};

/** Floating "View order" pill on /order, shown once something is in the cart. */
export default function CartTriggerButton({
  itemCount,
  subtotal,
  onClick,
}: CartTriggerButtonProps) {
  if (itemCount === 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed inset-x-3 bottom-4 z-40 flex min-h-14 items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-6 text-on-ink shadow-[0_10px_30px_rgba(20,18,16,0.35)] transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
      aria-label={`View your order, ${itemCount} item${itemCount === 1 ? "" : "s"}, ${formatPriceCAD(subtotal)}`}
    >
      <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-gold px-2 text-sm font-extrabold tabular-nums text-ink">
        {itemCount}
      </span>
      <span className="flex flex-1 flex-col items-start leading-tight">
        <span className="text-sm font-bold">View order</span>
        <span className="text-[11px] font-semibold text-on-ink-muted">Pay when you pick up</span>
      </span>
      <span className="pl-3 font-extrabold tabular-nums text-gold">{formatPriceCAD(subtotal)}</span>
    </button>
  );
}
