"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useMenuItemsStore } from "@/stores/menuItemsStore";

/**
 * Fetches categories and menu items from Firestore on first app load
 * and stores them in Zustand for global use. Renders nothing.
 */
export default function MenuDataLoader() {
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const fetchMenuItems = useMenuItemsStore((s) => s.fetchMenuItems);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, [fetchCategories, fetchMenuItems]);

  return null;
}
