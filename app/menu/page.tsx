import Image from "next/image";
import PageContainer from "../components/PageContainer";
import { menuItems, foodCategories } from "@/lib/store";
import MenuItemRow from "../components/menu/MenuItemRow";

const TITLE_BG_IMAGE =
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80";

export default function Menu() {
  const categoriesSorted = [...foodCategories].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
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
          <div className="mx-auto max-w-6xl space-y-16">
            {categoriesSorted.map((category, catIndex) => {
              const itemsInCategory = menuItems.filter(
                (item) =>
                  item.categoryIds?.includes(category.id ?? "") ||
                  (category.itemIds?.includes(item.id ?? "") ?? false),
              );

              return (
                <div key={category.id ?? catIndex}>
                  <div className="border-b-2 border-stone-800 pb-2">
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-stone-900 sm:text-3xl">
                      {category.name}
                    </h2>
                    {category.description ? (
                      <p className="mt-2 text-stone-600">
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

          <p className="mt-16 border-t border-stone-200 pt-8 text-center text-sm text-stone-500">
            Please let us know about any allergies (e.g. gluten, peanuts,
            cilantro).
          </p>
        </PageContainer>
      </section>
    </>
  );
}
