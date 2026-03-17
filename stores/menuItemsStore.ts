import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sortAlphabetically } from "@/lib/utils";

interface MenuItemsState {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  fetchMenuItems: () => Promise<void>;
  reset: () => void;
}

export const useMenuItemsStore = create<MenuItemsState>((set) => ({
  menuItems: [],
  loading: false,
  error: null,

  reset: () => {
    set({ menuItems: [], loading: false, error: null });
  },

  fetchMenuItems: async () => {
    set({ loading: true, error: null });
    try {
      const snapshot = await getDocs(collection(db, "menuItems"));
      const menuItems: MenuItem[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        const rawPrice = d.price;
        const price =
          typeof rawPrice === "number" && Number.isFinite(rawPrice)
            ? rawPrice
            : 0;
        const rawImage = d.image;
        const image: ImageItem | undefined =
          rawImage &&
          typeof rawImage === "object" &&
          "url" in rawImage &&
          typeof (rawImage as { url: unknown }).url === "string"
            ? {
                name:
                  (typeof (rawImage as { name?: unknown }).name === "string"
                    ? (rawImage as { name: string }).name
                    : "") ?? "",
                url: (rawImage as { url: string }).url,
              }
            : undefined;
        const options = d.options as string[] | undefined;
        return {
          id: doc.id,
          name: (d.name as string) ?? "",
          description: d.description as string | undefined,
          price,
          image,
          options,
          categoryIds: d.categoryIds as string[] | undefined,
          createdAt: (d.createdAt?.toDate?.() ?? new Date()) as Date,
        };
      });
      const sortedMenuItems = sortAlphabetically<MenuItem>(
        menuItems,
        (item) => item.name,
      );
      set({ menuItems: sortedMenuItems, loading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to fetch menu items",
        loading: false,
      });
    }
  },
}));
