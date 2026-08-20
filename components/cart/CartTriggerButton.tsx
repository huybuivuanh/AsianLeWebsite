import { formatPriceCAD } from "@/lib/utils";

type CartTriggerButtonProps = {
  itemCount: number;
  subtotal: number;
  onClick: () => void;
};

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
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3.5 text-white shadow-lg shadow-stone-900/25 transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
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
  );
}
