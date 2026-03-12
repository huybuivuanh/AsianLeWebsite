import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DayOfWeek } from "@/types/enum";

interface DailySpecialsState {
  schedules: DailySpecial[];
  loading: boolean;
  error: string | null;
  fetchDailySpecials: () => Promise<void>;
  reset: () => void;
}

const DAY_VALUES = Object.values(DayOfWeek) as string[];

export const useDailySpecialsStore = create<DailySpecialsState>((set) => ({
  schedules: [],
  loading: false,
  error: null,

  reset: () => {
    set({ schedules: [], loading: false, error: null });
  },

  fetchDailySpecials: async () => {
    set({ loading: true, error: null });
    try {
      const snapshot = await getDocs(collection(db, "dailySpecials"));
      const schedules: DailySpecial[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        const rawRange = d.timeRange;
        const timeRange: TimeRange =
          rawRange &&
          typeof rawRange === "object" &&
          "startTime" in rawRange &&
          "endTime" in rawRange
            ? {
                startTime:
                  typeof (rawRange as { startTime: unknown }).startTime ===
                  "string"
                    ? (rawRange as { startTime: string }).startTime
                    : "",
                endTime:
                  typeof (rawRange as { endTime: unknown }).endTime === "string"
                    ? (rawRange as { endTime: string }).endTime
                    : "",
              }
            : { startTime: "", endTime: "" };
        const dayOfWeek =
          typeof d.dayOfWeek === "string" && DAY_VALUES.includes(d.dayOfWeek)
            ? (d.dayOfWeek as DayOfWeek)
            : DayOfWeek.MONDAY;
        return {
          id: doc.id,
          dayOfWeek,
          timeRange,
          itemIds: Array.isArray(d.itemIds)
            ? (d.itemIds as string[]).filter((id) => typeof id === "string")
            : undefined,
          createdAt: (d.createdAt?.toDate?.() ?? new Date()) as Date,
        };
      });
      set({ schedules, loading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to fetch daily specials",
        loading: false,
      });
    }
  },
}));
