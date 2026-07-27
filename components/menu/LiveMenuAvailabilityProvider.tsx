"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mapAvailability, mapSoldOut } from "@/lib/orderMenuData";
import { getAvailabilityStatus, type AvailabilityStatus } from "@/lib/availability";

/**
 * Live-patches item/option availability on top of the SSR-rendered `/menu` page —
 * the page itself stays server-rendered (ISR) for SEO/first paint; this just overlays
 * real-time sold-out/availability-window state from two collection-level Firestore
 * listeners, so staff toggling sold-out reflects immediately instead of waiting up to
 * `revalidate`'s 15-minute window. Falls back to the SSR-computed status passed in by
 * each card until the first snapshot arrives.
 */

type RawEntity = { availability?: MenuItemAvailability; soldOut?: MenuItemSoldOut };

type LiveMenuAvailabilityContextValue = {
  getItemAvailability: (itemId: string, fallback: AvailabilityStatus) => AvailabilityStatus;
  getOptionAvailability: (optionId: string, fallback: AvailabilityStatus) => AvailabilityStatus;
};

const LiveMenuAvailabilityContext = createContext<LiveMenuAvailabilityContextValue | null>(null);

// Re-evaluate availability windows (e.g. "Available 11:00-14:00") periodically, since
// nothing in Firestore changes at the moment a window opens/closes.
const TIME_RECHECK_INTERVAL_MS = 60_000;

export function LiveMenuAvailabilityProvider({
  timezone,
  children,
}: {
  timezone: string;
  children: ReactNode;
}) {
  const [itemsById, setItemsById] = useState<Map<string, RawEntity> | null>(null);
  const [optionsById, setOptionsById] = useState<Map<string, RawEntity> | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const unsubItems = onSnapshot(collection(db, "demoMenuItems"), (snapshot) => {
      const map = new Map<string, RawEntity>();
      for (const doc of snapshot.docs) {
        const d = doc.data();
        map.set(doc.id, { availability: mapAvailability(d.availability), soldOut: mapSoldOut(d.soldOut) });
      }
      setItemsById(map);
    });
    const unsubOptions = onSnapshot(collection(db, "options"), (snapshot) => {
      const map = new Map<string, RawEntity>();
      for (const doc of snapshot.docs) {
        const d = doc.data();
        map.set(doc.id, { availability: mapAvailability(d.availability), soldOut: mapSoldOut(d.soldOut) });
      }
      setOptionsById(map);
    });
    const interval = setInterval(() => setNow(new Date()), TIME_RECHECK_INTERVAL_MS);
    return () => {
      unsubItems();
      unsubOptions();
      clearInterval(interval);
    };
  }, []);

  const value: LiveMenuAvailabilityContextValue = {
    getItemAvailability: (itemId, fallback) => {
      const entity = itemsById?.get(itemId);
      return entity ? getAvailabilityStatus(entity, timezone, now) : fallback;
    },
    getOptionAvailability: (optionId, fallback) => {
      const entity = optionsById?.get(optionId);
      return entity ? getAvailabilityStatus(entity, timezone, now) : fallback;
    },
  };

  return (
    <LiveMenuAvailabilityContext.Provider value={value}>
      {children}
    </LiveMenuAvailabilityContext.Provider>
  );
}

/** Safe to use outside the provider (e.g. in tests) — just returns the SSR fallback. */
export function useLiveMenuAvailability(): LiveMenuAvailabilityContextValue {
  const ctx = useContext(LiveMenuAvailabilityContext);
  return (
    ctx ?? {
      getItemAvailability: (_itemId, fallback) => fallback,
      getOptionAvailability: (_optionId, fallback) => fallback,
    }
  );
}
