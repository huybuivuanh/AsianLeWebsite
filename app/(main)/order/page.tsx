import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import CartDrawer from "@/components/cart/CartDrawer";
import LiveOrderMenu from "@/components/order/LiveOrderMenu";
import { fetchOrderMenuDataForServer } from "@/lib/orderMenuData";
import { getStoreSettings } from "@/lib/storeSettings";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Order Online",
  description:
    "Order takeout online from Asian Le Restaurant in Prince Albert — pay in person when you pick up, no online payment required.",
  openGraph: {
    title: "Order Online | Asian Le Restaurant",
    description:
      "Order Chinese & Vietnamese takeout for pickup at Asian Le Restaurant, Prince Albert, SK.",
  },
};

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

      <div className="border-b border-stone-100 bg-stone-50/60">
        <PageContainer>
          <div className="flex flex-wrap items-center justify-between gap-3 py-6">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                Order for pickup
              </h1>
              <p className="mt-1 text-sm text-stone-600">
                Pay in person when you pick up — no online payment.
              </p>
            </div>
            <Link
              href="/menu"
              className="text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              ← Back to menu
            </Link>
          </div>
        </PageContainer>
      </div>

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
        <section className="bg-white py-10 md:py-14">
          <PageContainer>
            <div className="mx-auto max-w-3xl rounded-xl border border-stone-200 bg-stone-50/50 p-6 text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
                Couldn&apos;t load menu
              </p>
              <p className="mt-3 text-stone-700">{menuRes.message}</p>
              <Link
                href="/order"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50"
              >
                Try again
              </Link>
            </div>
          </PageContainer>
        </section>
      )}
    </>
  );
}
