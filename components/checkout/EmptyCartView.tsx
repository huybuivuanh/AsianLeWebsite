import Link from "next/link";

export default function EmptyCartView() {
  return (
    <div className="mx-auto max-w-xl py-8 text-center">
      <p className="text-lg text-stone-600">Your cart is empty.</p>
      <Link
        href="/menu"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400"
      >
        Browse the menu
      </Link>
    </div>
  );
}
