"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sortAlphabetically } from "@/lib/utils";
import {
  mapDocToFoodCategory,
  mapDocToMenuItem,
  mapDocToOptionGroup,
  mapDocToItemOption,
} from "@/lib/orderMenuData";
import { mapWeeklyHours, mapHolidays } from "@/lib/storeSettings";
import { buildMenuItemViewModel } from "@/lib/menuOptions";
import { isStoreOpenNow, INDEFINITE_PAUSE } from "@/lib/availability";
import PageContainer from "@/components/PageContainer";
import OrderCategoryTabs from "@/components/order/OrderCategoryTabs";
import OrderMenuItemCard from "@/components/menu/OrderMenuItemCard";

/**
 * Owns all of /order's reactive data: subscribes to categories, menuItems,
 * optionGroups, options, and settings/store via onSnapshot, and re-renders the category
 * tabs + item grid with live data — not just availability, the whole catalog (names,
 * prices, descriptions, images, category membership). The SSR-fetched initial* props are
 * only the first-paint fallback; live data takes over once the first snapshot for each
 * collection arrives. This is what makes /order avoid the 15-minute ISR staleness window
 * /menu accepts — that was the entire point of splitting /order out in the first place.
 */

// Re-evaluate availability windows (e.g. "Available 11:00-14:00") periodically, since
// nothing in Firestore changes at the moment a window opens/closes.
const TIME_RECHECK_INTERVAL_MS = 60_000;

export default function LiveOrderMenu({
  initialCategories,
  initialMenuItems,
  initialOptionGroups,
  initialOptions,
  initialStoreSettings,
  openItemId,
}: {
  initialCategories: FoodCategory[];
  initialMenuItems: MenuItem[];
  initialOptionGroups: OptionGroup[];
  initialOptions: ItemOption[];
  initialStoreSettings: StoreSettings;
  openItemId?: string;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [optionGroups, setOptionGroups] = useState(initialOptionGroups);
  const [options, setOptions] = useState(initialOptions);
  const [storeSettings, setStoreSettings] = useState(initialStoreSettings);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const unsubCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
      const mapped = snapshot.docs.map(mapDocToFoodCategory);
      setCategories([...mapped].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    });
    const unsubItems = onSnapshot(collection(db, "menuItems"), (snapshot) => {
      const mapped = snapshot.docs.map(mapDocToMenuItem);
      setMenuItems(sortAlphabetically(mapped, (item) => item.name));
    });
    const unsubOptionGroups = onSnapshot(collection(db, "optionGroups"), (snapshot) => {
      setOptionGroups(snapshot.docs.map(mapDocToOptionGroup));
    });
    const unsubOptions = onSnapshot(collection(db, "options"), (snapshot) => {
      setOptions(snapshot.docs.map(mapDocToItemOption));
    });
    const unsubStoreSettings = onSnapshot(doc(db, "settings", "store"), (snapshot) => {
      const d = snapshot.data();
      if (!d) return;
      setStoreSettings({
        pausedUntil:
          d.pausedUntil === null
            ? null
            : d.pausedUntil instanceof Timestamp
              ? d.pausedUntil.toDate()
              : INDEFINITE_PAUSE,
        timezone: typeof d.timezone === "string" ? d.timezone : initialStoreSettings.timezone,
        waitTime: typeof d.waitTime === "number" ? d.waitTime : initialStoreSettings.waitTime,
        restaurantPhoneNumber:
          typeof d.restaurantPhoneNumber === "string"
            ? d.restaurantPhoneNumber
            : initialStoreSettings.restaurantPhoneNumber,
        hours: mapWeeklyHours(d.hours),
        holidays: mapHolidays(d.holidays),
      });
    });
    const interval = setInterval(() => setNow(new Date()), TIME_RECHECK_INTERVAL_MS);
    return () => {
      unsubCategories();
      unsubItems();
      unsubOptionGroups();
      unsubOptions();
      unsubStoreSettings();
      clearInterval(interval);
    };
    // Only initialStoreSettings' timezone/waitTime are read as fallbacks inside the
    // callback (not categories/menuItems/etc, which are only ever set, never read here) —
    // listeners are meant to be set up once on mount, not torn down/recreated on every
    // live update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemViewModels = useMemo(() => {
    const optionGroupsById = new Map(optionGroups.map((g) => [g.id, g]));
    const optionsById = new Map(options.map((o) => [o.id, o]));
    return menuItems.map((item) =>
      buildMenuItemViewModel(
        item,
        optionGroupsById,
        optionsById,
        storeSettings.timezone,
        now,
      ),
    );
  }, [menuItems, optionGroups, options, storeSettings.timezone, now]);

  const isOrderingAvailable = isStoreOpenNow(storeSettings, now);

  const categoryTabs = categories.map((c) => ({
    id: `category-${c.id}`,
    label: c.name,
  }));

  return (
    <>
      <OrderCategoryTabs tabs={categoryTabs} />

      <section className="bg-white py-10 md:py-14">
        <PageContainer>
          <div className="mx-auto max-w-6xl">
            <div className="space-y-16">
              {categories.map((category, categoryIndex) => {
                const itemsInCategory = itemViewModels.filter(
                  (vm) => vm.item.categoryIds?.includes(category.id) ?? false,
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
                      {itemsInCategory.map((vm, itemIndex) => (
                        <OrderMenuItemCard
                          key={vm.item.id}
                          {...vm}
                          isOrderingAvailable={isOrderingAvailable}
                          autoOpen={vm.item.id === openItemId}
                          priority={categoryIndex === 0 && itemIndex === 0}
                        />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
