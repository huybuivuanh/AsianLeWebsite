import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface DailySpecialItemsState {
  items: DailySpecialItem[];
  loading: boolean;
  error: string | null;
  fetchDailySpecialItems: () => Promise<void>;
  reset: () => void;
}

export const useDailySpecialItemsStore = create<DailySpecialItemsState>(
  (set) => ({
    items: [],
    loading: false,
    error: null,

    reset: () => {
      set({ items: [], loading: false, error: null });
    },

    fetchDailySpecialItems: async () => {
      set({ loading: true, error: null });
      try {
        const snapshot = await getDocs(
          collection(db, "dailySpecialItems"),
        );
        const items: DailySpecialItem[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          const price =
            typeof d.price === "number" && Number.isFinite(d.price)
              ? d.price
              : 0;
          return {
            id: doc.id,
            name: typeof d.name === "string" ? d.name : "",
            price,
            options: Array.isArray(d.options)
              ? (d.options as string[]).filter((o) => typeof o === "string")
              : undefined,
            dayOfWeekIds: Array.isArray(d.dayOfWeekIds)
              ? (d.dayOfWeekIds as string[]).filter((id) => typeof id === "string")
              : undefined,
            createdAt: (d.createdAt?.toDate?.() ?? new Date()) as Date,
          };
        });
        set({ items, loading: false });
      } catch (err) {
        set({
          error:
            err instanceof Error
              ? err.message
              : "Failed to fetch daily special items",
          loading: false,
        });
      }
    },
  }),
);
