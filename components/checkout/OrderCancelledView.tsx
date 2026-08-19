import Link from "next/link";

export default function OrderCancelledView() {
  return (
    <div className="mx-auto max-w-xl py-8 text-center">
      <p className="text-lg font-semibold text-stone-900">
        Your order was cancelled.
      </p>
      <p className="mt-2 text-stone-600">
        No payment was taken — nothing to worry about there.
      </p>
      <Link
        href="/order"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400"
      >
        Order again
      </Link>
    </div>
  );
}
