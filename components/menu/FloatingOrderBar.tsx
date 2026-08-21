import { STORE } from "@/lib/store";
import OrderPickupCta from "@/components/menu/OrderPickupCta";

/** Persistent bottom bar with the two order CTAs — stays visible while browsing the menu, so users don't have to scroll back to the hero to order. */
export default function FloatingOrderBar({
  storeSettings,
}: {
  storeSettings: StoreSettings;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-3 sm:gap-4 sm:py-4">
        <a
          href={STORE.socialLinks.skipthedishes}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 sm:gap-2 sm:px-6 sm:py-3.5 sm:text-base"
        >
          Order on Skip the Dishes
          <svg
            className="size-4 shrink-0 sm:size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <OrderPickupCta
          storeSettings={storeSettings}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-amber-600 px-4 py-1.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 sm:gap-2 sm:px-6 sm:py-3 sm:text-base"
        >
          Order and pay when pick up
        </OrderPickupCta>
      </div>
    </div>
  );
}
