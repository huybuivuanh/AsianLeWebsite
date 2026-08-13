import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import OrderCategoryTabs from "@/components/order/OrderCategoryTabs";
import OrderMenuItemCard from "@/components/menu/OrderMenuItemCard";
import { LiveMenuAvailabilityProvider } from "@/components/menu/LiveMenuAvailabilityProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import { fetchOrderMenuDataForServer } from "@/lib/orderMenuData";
import { getStoreSettings } from "@/lib/storeSettings";
import {
  buildMenuItemViewModel,
  type MenuItemViewModel,
} from "@/lib/menuOptions";

export const revalidate = 900;

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item: openItemId } = await searchParams;

  let categories: DemoCategory[];
  let itemViewModels: MenuItemViewModel[];
  let error: string | null = null;

  const [menuRes, storeSettings] = await Promise.all([
    fetchOrderMenuDataForServer()
      .then((data) => ({ ok: true as const, data }))
      .catch((err) => ({
        ok: false as const,
        message: err instanceof Error ? err.message : "Failed to load menu",
      })),
    getStoreSettings(),
  ]);

  if (menuRes.ok) {
    categories = menuRes.data.categories;
    const optionGroupsById = new Map(
      menuRes.data.optionGroups.map((g) => [g.id, g]),
    );
    const optionsById = new Map(menuRes.data.options.map((o) => [o.id, o]));
    const now = new Date();
    itemViewModels = menuRes.data.menuItems.map((item) =>
      buildMenuItemViewModel(
        item,
        optionGroupsById,
        optionsById,
        storeSettings.timezone,
        now,
      ),
    );
  } else {
    error = menuRes.message;
    categories = [];
    itemViewModels = [];
  }

  const categoriesSorted = [...categories].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  const categoryTabs = categoriesSorted.map((c) => ({
    id: `category-${c.id}`,
    label: c.name,
  }));

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

      {!error ? <OrderCategoryTabs tabs={categoryTabs} /> : null}

      <section className="bg-white py-10 md:py-14">
        <PageContainer>
          <div className="mx-auto max-w-6xl">
            {error ? (
              <div className="mx-auto mt-4 max-w-3xl rounded-xl border border-stone-200 bg-stone-50/50 p-6 text-center">
                <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
                  Couldn&apos;t load menu
                </p>
                <p className="mt-3 text-stone-700">{error}</p>
                <Link
                  href="/order"
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50"
                >
                  Try again
                </Link>
              </div>
            ) : (
              <LiveMenuAvailabilityProvider storeSettings={storeSettings}>
                <div className="space-y-16">
                  {categoriesSorted.map((category) => {
                    const itemsInCategory = itemViewModels.filter(
                      (vm) =>
                        vm.item.categoryIds?.includes(category.id) ?? false,
                    );
                    return (
                      <div
                        key={category.id}
                        id={`category-${category.id}`}
                        className="scroll-mt-40 mx-auto w-full"
                      >
                        <div className="mb-5 text-center">
                          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                            {category.name}
                          </h2>
                          {category.description ? (
                            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-stone-600">
                              {category.description}
                            </p>
                          ) : null}
                        </div>
                        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                          {itemsInCategory.map((vm) => (
                            <OrderMenuItemCard
                              key={vm.item.id}
                              {...vm}
                              autoOpen={vm.item.id === openItemId}
                            />
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </LiveMenuAvailabilityProvider>
            )}
          </div>
        </PageContainer>
      </section>
    </>
  );
}
