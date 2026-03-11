"use client";

import Image from "next/image";
import { useMemo } from "react";
import PageContainer from "../../../components/PageContainer";
import DailySpecialsGrid from "../../../components/daily-specials/DailySpecialsGrid";
import MenuItemRow from "../../../components/menu/MenuItemRow";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useMenuItemsStore } from "@/stores/menuItemsStore";

const TITLE_BG_IMAGE =
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80";

export default function Menu() {
  const categories = useCategoriesStore((s) => s.categories);
  const categoriesLoading = useCategoriesStore((s) => s.loading);
  const categoriesError = useCategoriesStore((s) => s.error);

  const menuItems = useMenuItemsStore((s) => s.menuItems);
  const itemsLoading = useMenuItemsStore((s) => s.loading);
  const itemsError = useMenuItemsStore((s) => s.error);

  const loading = categoriesLoading || itemsLoading;
  const error = categoriesError ?? itemsError;

  const categoriesSorted = useMemo(
    () => [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [categories],
  );

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-stone-800 sm:min-h-[320px]">
        <Image
          src={TITLE_BG_IMAGE}
          alt=""
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
        </div>
      </section>

      {/* Menu by category */}
      <section className="border-t border-stone-200 bg-white py-16 md:py-24">
        <PageContainer>
          {/* Daily Specials */}
          <div className="relative mt-24 overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-stone-50 to-orange-50/70 px-6 py-10 shadow-lg shadow-amber-900/5 sm:px-8 sm:py-12">
            {/* Decorative top accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
            <div className="relative">
              <h2 className="mt-2 text-center text-2xl font-bold uppercase tracking-wide text-stone-900 sm:text-3xl">
                Daily Special
              </h2>
              <div
                className="mx-auto mt-3 h-px w-16 bg-amber-400/60"
                aria-hidden
              />
              <p className="mt-4 text-center text-sm leading-relaxed text-stone-600">
                Great value specials by day. Available at the times shown.
              </p>
              <div className="mt-8">
                <DailySpecialsGrid variant="light" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
                Loading menu
              </p>
              <p className="mt-3 text-stone-600">Please wait a moment.</p>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-3xl rounded-xl border border-stone-200 bg-stone-50/50 p-6 text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
                Couldn&apos;t load menu
              </p>
              <p className="mt-3 text-stone-700">{error}</p>
              <button
                type="button"
                onClick={() => {
                  useCategoriesStore.getState().fetchCategories();
                  useMenuItemsStore.getState().fetchMenuItems();
                }}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="mx-auto max-w-6xl space-y-24">
              {categoriesSorted.map((category) => {
                const itemsInCategory = menuItems.filter((item) => {
                  const byCategoryItemIds =
                    category.itemIds?.includes(item.id ?? "") ?? false;
                  const byItemCategoryIds =
                    item.categoryIds?.includes(category.id ?? "") ?? false;
                  return byCategoryItemIds || byItemCategoryIds;
                });
                return (
                  <div key={category.id}>
                    <div className="pb-2">
                      <h2 className="text-center text-2xl font-bold uppercase tracking-wide text-stone-900 sm:text-3xl">
                        {category.name}
                      </h2>
                      {category.description ? (
                        <p className="mt-2 text-center text-stone-600">
                          {category.description}
                        </p>
                      ) : null}
                    </div>

                    <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
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

          <p className="mt-16 border-t border-stone-200 pt-8 text-center text-sm text-stone-500">
            Please let us know if you have any allergies or dietary
            restrictions.
          </p>
        </PageContainer>
      </section>
    </>
  );
}
