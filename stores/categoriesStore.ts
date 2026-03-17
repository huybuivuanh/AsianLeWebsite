import { create } from "zustand";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CategoriesState {
  categories: FoodCategory[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  fetchCategories: () => Promise<void>;
  reset: () => void;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  initialized: false,

  reset: () => {
    set({ categories: [], loading: false, error: null, initialized: false });
  },

  fetchCategories: async () => {
    if (get().initialized) return;

    set({ loading: true, error: null });
    try {
      const q = query(collection(db, "categories"), orderBy("order"));
      const snapshot = await getDocs(q);
      const categories: FoodCategory[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: (d.name as string) ?? "",
          description: d.description as string | undefined,
          itemIds: d.itemIds as string[] | undefined,
          order: (d.order as number) ?? 0,
          createdAt: d.createdAt?.toDate?.() ?? undefined,
        };
      });
      set({ categories, loading: false, initialized: true });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch categories",
        loading: false,
        initialized: false,
      });
    }
  },
}));
