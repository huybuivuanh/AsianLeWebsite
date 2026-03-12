import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UpdatesState {
  items: ImageItem[];
  loading: boolean;
  error: string | null;
  fetchUpdates: () => Promise<void>;
  reset: () => void;
}

export const useUpdatesStore = create<UpdatesState>((set) => ({
  items: [],
  loading: false,
  error: null,

  reset: () => {
    set({ items: [], loading: false, error: null });
  },

  fetchUpdates: async () => {
    set({ loading: true, error: null });
    try {
      const snapshot = await getDocs(collection(db, "updates"));
      const items: ImageItem[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        const name = typeof d.name === "string" ? d.name : "";
        const url = typeof d.url === "string" ? d.url : "";
        return {
          id: doc.id,
          name,
          url,
        };
      });
      set({ items, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch updates",
        loading: false,
      });
    }
  },
}));
