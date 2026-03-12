"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useMenuItemsStore } from "@/stores/menuItemsStore";
import { useGalleryStore } from "@/stores/galleryStore";
import { useUpdatesStore } from "@/stores/updatesStore";
import { useDailySpecialsStore } from "@/stores/dailySpecialsStore";
import { useDailySpecialItemsStore } from "@/stores/dailySpecialItemsStore";

/**
 * Fetches categories, menu items, gallery, updates, and daily specials from Firestore on first app load
 * and stores them in Zustand for global use. Renders nothing.
 */
export default function MenuDataLoader() {
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const fetchMenuItems = useMenuItemsStore((s) => s.fetchMenuItems);
  const fetchGallery = useGalleryStore((s) => s.fetchGallery);
  const fetchUpdates = useUpdatesStore((s) => s.fetchUpdates);
  const fetchDailySpecials = useDailySpecialsStore((s) => s.fetchDailySpecials);
  const fetchDailySpecialItems = useDailySpecialItemsStore(
    (s) => s.fetchDailySpecialItems,
  );

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    fetchGallery();
    fetchUpdates();
    fetchDailySpecials();
    fetchDailySpecialItems();
  }, [
    fetchCategories,
    fetchMenuItems,
    fetchGallery,
    fetchUpdates,
    fetchDailySpecials,
    fetchDailySpecialItems,
  ]);

  return null;
}
