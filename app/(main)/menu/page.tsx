import Image from "next/image";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import DailySpecialsGrid from "@/components/daily-specials/DailySpecialsGrid";
import MenuCategoryNav from "@/components/menu/MenuCategoryNav";
import MenuItemRow from "@/components/menu/MenuItemRow";
import { STORE } from "@/lib/store";
import { fetchMenuDataForServer } from "@/lib/menuData";

export default async function MenuPage() {
  let categories: FoodCategory[];
  let menuItems: MenuItem[];
  let error: string | null = null;

  try {
    const data = await fetchMenuDataForServer();
    categories = data.categories;
    menuItems = data.menuItems;
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Failed to load menu";
    categories = [];
    menuItems = [];
  }

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
            Enjoy one of our delicious plates
          </p>
          <a
            href={STORE.socialLinks.skipthedishes}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-base font-semibold text-stone-900 shadow-lg transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900"
          >
            Order on Skip the Dishes
            <svg
              className="size-5"
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
        </div>
      </section>

      {/* Menu content */}
      <section className="bg-white py-16 md:py-24">
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
            </div>

            {/* Daily Specials - still client-fetched for now */}
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
                  <div className="mt-8">
                    <DailySpecialsGrid variant="light" />
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
                {categoriesSorted.map((category) => {
                  const itemsInCategory = menuItems.filter((item) => {
                    const byCategoryItemIds =
                      category.itemIds?.includes(item.id ?? "") ?? false;
                    const byItemCategoryIds =
                      item.categoryIds?.includes(category.id ?? "") ?? false;
                    return byCategoryItemIds || byItemCategoryIds;
                  });
                  return (
                    <div
                      key={category.id}
                      id={`category-${category.id}`}
                      className="scroll-mt-28 mx-auto w-full max-w-5xl"
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
                      <ul className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
                        {itemsInCategory.map((item, itemIndex) => (
                          <MenuItemRow
                            key={item.id ?? itemIndex}
                            item={item}
                            index={itemIndex}
                          />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Order online CTA */}
            <div className="relative mt-20 overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-stone-50 to-orange-50/70 px-8 py-12 text-center shadow-lg shadow-amber-900/5 sm:px-12">
              <div
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"
                aria-hidden
              />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Order online
                </p>
                <a
                  href={STORE.socialLinks.skipthedishes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3.5 text-base font-semibold text-stone-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 hover:shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50"
                >
                  Order on Skip the Dishes
                  <svg
                    className="size-5"
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
              </div>
            </div>

            <p className="mt-16 border-t border-stone-200 pt-8 text-center text-sm text-stone-500">
              Please let us know if you have any allergies or dietary
              restrictions.
            </p>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
