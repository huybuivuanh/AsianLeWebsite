"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useMenuItemsStore } from "@/stores/menuItemsStore";
import { useGalleryStore } from "@/stores/galleryStore";

/**
 * Fetches categories, menu items, and gallery from Firestore on first app load
 * and stores them in Zustand for global use. Renders nothing.
 */
export default function MenuDataLoader() {
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const fetchMenuItems = useMenuItemsStore((s) => s.fetchMenuItems);
  const fetchGallery = useGalleryStore((s) => s.fetchGallery);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    fetchGallery();
  }, [fetchCategories, fetchMenuItems, fetchGallery]);

  return null;
}
