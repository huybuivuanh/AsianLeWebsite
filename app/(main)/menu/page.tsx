import Link from "next/link";
import WeeklySpecialsSection from "@/components/home/WeeklySpecialsSection";
import MenuCategoryBar from "@/components/menu/MenuCategoryBar";
import MenuListItem from "@/components/menu/MenuListItem";
import FloatingOrderButtons from "@/components/menu/FloatingOrderButtons";
import OrderPickupCta from "@/components/menu/OrderPickupCta";
import { STORE } from "@/lib/store";
import { fetchOrderMenuDataForServer } from "@/lib/orderMenuData";
import { getStoreSettings } from "@/lib/storeSettings";
import { buildMenuItemViewModel, type MenuItemViewModel } from "@/lib/menuOptions";
import { getDailySpecialsBundle, getStoreHours } from "@/lib/siteData.server";
import { dayOfWeekInTimezone } from "@/lib/utils";
import type { DayOfWeek } from "@/types/enum";

export const revalidate = 900;

// The "Daily Specials" menu category is the orderable copy of the weekly specials; on
// /menu the weekly cards already show them, so it's left out of the list.
const isDailySpecialsCategory = (c: FoodCategory) => /daily\s*special/i.test(c.name);

const telHref = `tel:${STORE.phone.replace(/\D/g, "")}`;

export default async function MenuPage() {
  const [menuRes, daily, storeSettings, hours] = await Promise.all([
    fetchOrderMenuDataForServer()
      .then((data) => ({ ok: true as const, data }))
      .catch((err) => ({
        ok: false as const,
        message: err instanceof Error ? err.message : "Failed to load menu",
      })),
    getDailySpecialsBundle(),
    getStoreSettings(),
    getStoreHours().catch(() => [] as StoreHour[]),
  ]);

  let categories: FoodCategory[] = [];
  let itemViewModels: MenuItemViewModel[] = [];
  const error = menuRes.ok ? null : menuRes.message;
  if (menuRes.ok) {
    categories = [...menuRes.data.categories]
      .filter((c) => !isDailySpecialsCategory(c))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const optionGroupsById = new Map(menuRes.data.optionGroups.map((g) => [g.id, g]));
    const optionsById = new Map(menuRes.data.options.map((o) => [o.id, o]));
    const now = new Date();
    itemViewModels = menuRes.data.menuItems.map((item) =>
      buildMenuItemViewModel(item, optionGroupsById, optionsById, storeSettings.timezone, now),
    );
  }

  const sections = categories
    .map((category) => ({
      category,
      items: itemViewModels.filter((vm) => vm.item.categoryIds?.includes(category.id)),
    }))
    .filter((s) => s.items.length > 0);

  const links = [
    { id: "daily-special", label: "Daily Specials" },
    ...sections.map(({ category }) => ({ id: `category-${category.id}`, label: category.name })),
  ];
  const today = dayOfWeekInTimezone(storeSettings.timezone) as DayOfWeek;
  const firstHours = hours[0];

  return (
    <>
      <section className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-7 px-4 pb-16 pt-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-gold">
              Chinese &amp; Vietnamese · Prince Albert
            </p>
            <h1 className="mt-3.5 text-[clamp(3rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.035em]">
              Our <span className="font-accent font-normal italic text-gold">menu</span>
            </h1>
            <p className="mt-4 text-lg text-on-ink-muted">
              Comforting classics, lunch specials and takeout favourites. Order online for pickup
              and pay in person — no online payment.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <OrderPickupCta
              storeSettings={storeSettings}
              className="inline-flex min-h-13 flex-col items-center justify-center rounded-full bg-gold px-7 leading-tight text-ink transition hover:bg-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <span className="font-bold">Order online</span>
              <span className="text-xs font-semibold text-gold-ink">Pay when you pick up</span>
            </OrderPickupCta>
            <a
              href={STORE.socialLinks.skipthedishes}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center gap-2 rounded-full bg-skip px-6 font-bold text-ink transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-skip focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Order on Skip the Dishes
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <MenuCategoryBar links={links} />

      <div className="[&_#daily-special]:scroll-mt-36">
        <WeeklySpecialsSection
          dailySpecials={daily.dailySpecials}
          dailySpecialItems={daily.dailySpecialItems}
          error={daily.error}
          today={today}
          storeSettings={storeSettings}
          showOrderCards={false}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">
        {error ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-sand-line bg-white p-8 text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brand">
              Couldn&apos;t load the menu
            </p>
            <p className="mt-3 text-body">{error}</p>
            <Link
              href="/menu"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink px-6 font-bold text-on-ink"
            >
              Try again
            </Link>
          </div>
        ) : (
          sections.map(({ category, items }) => (
            <div key={category.id} id={`category-${category.id}`} className="scroll-mt-36 pb-16">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-ink pb-3">
                <h2 className="text-[clamp(1.6rem,3vw,2rem)] font-extrabold leading-tight tracking-[-0.02em]">
                  {category.name}
                </h2>
                <span className="text-sm font-semibold text-muted">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
                {category.description ? (
                  <span className="ml-auto font-accent text-lg italic text-muted">
                    {category.description}
                  </span>
                ) : null}
              </div>
              <ul className="grid gap-x-14 md:grid-cols-2">
                {items.map((vm) => (
                  <MenuListItem key={vm.item.id} item={vm.item} availability={vm.availability} />
                ))}
              </ul>
            </div>
          ))
        )}
        <p className="border-t border-sand-line pt-8 text-center text-sm text-muted">
          Please let us know if you have any allergies or dietary restrictions.
        </p>
      </section>

      <section className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-7 px-4 py-16 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-[clamp(2rem,4vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              Ready to <span className="font-accent font-normal italic text-gold">order?</span>
            </h2>
            <p className="mt-2.5 text-on-ink-muted">
              {firstHours ? `${firstHours.days} · ${firstHours.time} · ` : ""}
              {STORE.phone}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <OrderPickupCta
              storeSettings={storeSettings}
              className="inline-flex min-h-13 flex-col items-center justify-center rounded-full bg-gold px-7 leading-tight text-ink transition hover:bg-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <span className="font-bold">Order online</span>
              <span className="text-xs font-semibold text-gold-ink">Pay when you pick up</span>
            </OrderPickupCta>
            <a
              href={STORE.socialLinks.skipthedishes}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center gap-2 rounded-full bg-skip px-6 font-bold text-ink transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-skip focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Order on Skip the Dishes
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
              </svg>
            </a>
            <a
              href={telHref}
              className="inline-flex min-h-13 items-center rounded-full border border-gold px-6 font-bold text-gold transition hover:bg-gold hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

      <FloatingOrderButtons storeSettings={storeSettings} />
    </>
  );
}
