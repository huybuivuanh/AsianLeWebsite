"use client";

import { useEffect } from "react";
import { useGalleryStore } from "@/stores/galleryStore";
import { useUpdatesStore } from "@/stores/updatesStore";
import { useDailySpecialsStore } from "@/stores/dailySpecialsStore";
import { useDailySpecialItemsStore } from "@/stores/dailySpecialItemsStore";

/**
 * Fetches gallery, updates, and daily specials from Firestore on first app load
 * and stores them in Zustand for global use. Renders nothing.
 * Categories and menu items are fetched on the server for the menu page (SEO, fast first paint).
 */
export default function MenuDataLoader() {
  const fetchGallery = useGalleryStore((s) => s.fetchGallery);
  const fetchUpdates = useUpdatesStore((s) => s.fetchUpdates);
  const fetchDailySpecials = useDailySpecialsStore((s) => s.fetchDailySpecials);
  const fetchDailySpecialItems = useDailySpecialItemsStore(
    (s) => s.fetchDailySpecialItems,
  );

  useEffect(() => {
    fetchGallery();
    fetchUpdates();
    fetchDailySpecials();
    fetchDailySpecialItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
