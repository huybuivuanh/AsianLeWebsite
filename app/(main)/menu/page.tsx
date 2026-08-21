import Image from "next/image";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import DailySpecialsGrid from "@/components/daily-specials/DailySpecialsGrid";
import MenuCategoryNav from "@/components/menu/MenuCategoryNav";
import MenuItemCard from "@/components/menu/MenuItemCard";
import FloatingOrderBar from "@/components/menu/FloatingOrderBar";
import OrderPickupCta from "@/components/menu/OrderPickupCta";
import { STORE } from "@/lib/store";
import { fetchOrderMenuDataForServer } from "@/lib/orderMenuData";
import { getStoreSettings } from "@/lib/storeSettings";
import {
  buildMenuItemViewModel,
  type MenuItemViewModel,
} from "@/lib/menuOptions";
import { getDailySpecialsBundle } from "@/lib/siteData.server";

export const revalidate = 900;

export default async function MenuPage() {
  let categories: FoodCategory[];
  let itemViewModels: MenuItemViewModel[];
  let error: string | null = null;
  let dailyError: string | null = null;

  const [menuRes, daily, storeSettings] = await Promise.all([
    fetchOrderMenuDataForServer()
      .then((data) => ({ ok: true as const, data }))
      .catch((err) => ({
        ok: false as const,
        message: err instanceof Error ? err.message : "Failed to load menu",
      })),
    getDailySpecialsBundle(),
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

  dailyError = daily.error;

  const categoriesSorted = [...categories].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  const serverCategoryLinks: { id: string; label: string }[] = [
    { id: "daily-special", label: "Daily Special" },
    ...categoriesSorted.map((c) => ({ id: `category-${c.id}`, label: c.name })),
  ];

  return (
    <>
      <MenuCategoryNav serverCategoryLinks={serverCategoryLinks} />
      <FloatingOrderBar storeSettings={storeSettings} />
      {/* Hero */}
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-stone-800 sm:min-h-[320px]">
        <Image
          src="/home/hero carousel/5.jpg"
          alt="Assorted Chinese and Vietnamese dishes at Asian Le Restaurant in Prince Albert"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Restaurant Menu
          </h1>
          <p className="mt-4 text-lg text-stone-200 sm:text-xl">
            Chinese &amp; Vietnamese favorites — lunch specials to dinner
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={STORE.socialLinks.skipthedishes}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 shadow-lg transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900 sm:gap-2 sm:px-6 sm:py-3.5 sm:text-base"
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
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/70 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-stone-900 sm:gap-2 sm:px-6 sm:py-3 sm:text-base"
            >
              Order and pay when pick up
            </OrderPickupCta>
          </div>
        </div>
      </section>

      {/* Menu content */}
      <section className="bg-white pt-16 pb-32 md:pt-24 md:pb-36">
        <PageContainer>
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
                Chinese &amp; Vietnamese restaurant
              </p>
              <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
                Lunch specials, takeout, and more in Prince Albert
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600">
                Explore the full menu at our Chinese and Vietnamese restaurant
                in Prince Albert, with comforting classics, flavourful lunch
                specials, and convenient takeout options.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
                <svg
                  className="h-4 w-4 shrink-0"
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
                Order below for pickup — pay in person, no online payment.
              </div>
            </div>

            <div id="daily-special" className="scroll-mt-28 text-center">
              <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-stone-50 to-orange-50/70 px-6 py-10 shadow-lg shadow-amber-900/5 sm:px-8 sm:py-12">
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"
                  aria-hidden
                />
                <div className="relative">
                  <h3 className="pl-4 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                    Daily Special (11:00 AM - 2:00 PM)
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">
                    Great value specials by day. Available at the times shown.
                  </p>
                  {dailyError ? (
                    <p className="mt-6 text-center text-red-600" role="alert">
                      {dailyError}
                    </p>
                  ) : null}
                  <div className="mt-8">
                    <DailySpecialsGrid
                      variant="light"
                      dailySpecials={daily.dailySpecials}
                      dailySpecialItems={daily.dailySpecialItems}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories + menu items - server-rendered for SEO and fast first paint */}
            {error ? (
              <div className="mx-auto mt-20 max-w-3xl rounded-xl border border-stone-200 bg-stone-50/50 p-6 text-center">
                <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
                  Couldn&apos;t load menu
                </p>
                <p className="mt-3 text-stone-700">{error}</p>
                <Link
                  href="/menu"
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50"
                >
                  Try again
                </Link>
              </div>
            ) : (
              <div className="mt-24 space-y-28">
                {categoriesSorted.map((category, categoryIndex) => {
                  const itemsInCategory = itemViewModels.filter(
                    (vm) =>
                      vm.item.categoryIds?.includes(category.id) ?? false,
                  );
                  return (
                    <div
                      key={category.id}
                      id={`category-${category.id}`}
                      className="scroll-mt-28 mx-auto w-full"
                    >
                      <div className="mb-8 text-center">
                        <h3 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                          {category.name}
                        </h3>
                        <div
                          className="mx-auto mt-3 h-1 w-20 rounded-full bg-amber-500/90"
                          aria-hidden
                        />
                      </div>
                      {category.description ? (
                        <p className="mx-auto mb-8 max-w-2xl text-center text-stone-600">
                          {category.description}
                        </p>
                      ) : null}
                      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                        {itemsInCategory.map((vm, itemIndex) => (
                          <MenuItemCard
                            key={vm.item.id}
                            item={vm.item}
                            availability={vm.availability}
                            priority={categoryIndex === 0 && itemIndex === 0}
                          />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-20 border-t border-stone-200 pt-8 text-center text-sm text-stone-500">
              Please let us know if you have any allergies or dietary
              restrictions.
            </p>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
