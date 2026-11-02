import type { Metadata } from "next";
import Link from "next/link";
import CartDrawer from "@/components/cart/CartDrawer";
import LiveOrderMenu from "@/components/order/LiveOrderMenu";
import WaitTimeBadge from "@/components/order/WaitTimeBadge";
import { fetchOrderMenuDataForServer } from "@/lib/orderMenuData";
import { getStoreSettings } from "@/lib/storeSettings";
import { STORE } from "@/lib/store";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 900;

export const metadata: Metadata = pageMetadata({
  path: "/order",
  title: "Order Online",
  description:
    "Order takeout online from Asian Le Restaurant in Prince Albert — pay in person when you pick up, no online payment required.",
  ogTitle: "Order Online | Asian Le Restaurant",
  ogDescription:
    "Order Chinese & Vietnamese takeout for pickup at Asian Le Restaurant, Prince Albert, SK.",
});

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item: openItemId } = await searchParams;

  const [menuRes, storeSettings] = await Promise.all([
    fetchOrderMenuDataForServer()
      .then((data) => ({ ok: true as const, data }))
      .catch((err) => ({
        ok: false as const,
        message: err instanceof Error ? err.message : "Failed to load menu",
      })),
    getStoreSettings(),
  ]);

  return (
    <>
      <CartDrawer />

      <section className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-7 px-4 pb-14 pt-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-gold">
              Takeout · {STORE.address.line1}
            </p>
            <h1 className="mt-3.5 text-[clamp(2.75rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.035em]">
              Order for <span className="font-accent font-normal italic text-gold">pickup</span>
            </h1>
            <p className="mt-4 text-lg text-on-ink-muted">
              Pick your dishes, place the order, and{" "}
              <strong className="font-bold text-on-ink">pay in person when you pick up</strong> —
              no online payment.
            </p>
            <div className="mt-5">
              <WaitTimeBadge initialStoreSettings={storeSettings} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="inline-flex min-h-12 items-center rounded-full border border-ink-line px-5 text-sm font-bold text-on-ink transition hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              ← Full menu
            </Link>
            <a
              href={STORE.socialLinks.skipthedishes}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-skip px-5 text-sm font-bold text-ink transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-skip focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Want delivery? Skip the Dishes
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {menuRes.ok ? (
        <LiveOrderMenu
          initialCategories={menuRes.data.categories}
          initialMenuItems={menuRes.data.menuItems}
          initialOptionGroups={menuRes.data.optionGroups}
          initialOptions={menuRes.data.options}
          initialStoreSettings={storeSettings}
          openItemId={openItemId}
        />
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-3xl border border-sand-line bg-white p-8 text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brand">
              Couldn&apos;t load the menu
            </p>
            <p className="mt-3 text-body">{menuRes.message}</p>
            <Link
              href="/order"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink px-6 font-bold text-on-ink transition hover:bg-brand-dark"
            >
              Try again
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
