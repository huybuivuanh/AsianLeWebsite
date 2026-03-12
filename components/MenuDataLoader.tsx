"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useMenuItemsStore } from "@/stores/menuItemsStore";
import { useGalleryStore } from "@/stores/galleryStore";
import { useUpdatesStore } from "@/stores/updatesStore";

/**
 * Fetches categories, menu items, gallery, and updates from Firestore on first app load
 * and stores them in Zustand for global use. Renders nothing.
 */
export default function MenuDataLoader() {
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const fetchMenuItems = useMenuItemsStore((s) => s.fetchMenuItems);
  const fetchGallery = useGalleryStore((s) => s.fetchGallery);
  const fetchUpdates = useUpdatesStore((s) => s.fetchUpdates);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    fetchGallery();
    fetchUpdates();
  }, [fetchCategories, fetchMenuItems, fetchGallery, fetchUpdates]);

  return null;
}
