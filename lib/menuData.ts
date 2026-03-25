import { cache } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sortAlphabetically } from "@/lib/utils";

/**
 * Server-side menu data fetching for SEO and fast first paint.
 * Use from Server Components only (e.g. menu page).
 */

function mapDocToCategory(
  doc: QueryDocumentSnapshot<DocumentData>,
): FoodCategory {
  const d = doc.data();
  return {
    id: doc.id,
    name: (d.name as string) ?? "",
    description: d.description as string | undefined,
    itemIds: d.itemIds as string[] | undefined,
    order: (d.order as number) ?? 0,
    createdAt: (d.createdAt?.toDate?.() ?? new Date()) as Date,
  };
}

function mapDocToMenuItem(
  doc: QueryDocumentSnapshot<DocumentData>,
): MenuItem {
  const d = doc.data();
  const rawPrice = d.price;
  const price =
    typeof rawPrice === "number" && Number.isFinite(rawPrice) ? rawPrice : 0;
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
}

export async function fetchCategoriesForServer(): Promise<FoodCategory[]> {
  const q = query(collection(db, "categories"), orderBy("order"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDocToCategory);
}

export async function fetchMenuItemsForServer(): Promise<MenuItem[]> {
  const q = query(collection(db, "menuItems"), orderBy("name"));
  const snapshot = await getDocs(q);
  const menuItems = snapshot.docs.map(mapDocToMenuItem);
  return sortAlphabetically(menuItems, (item) => item.name);
}

async function loadMenuDataForServer(): Promise<{
  categories: FoodCategory[];
  menuItems: MenuItem[];
}> {
  const [categories, menuItems] = await Promise.all([
    fetchCategoriesForServer(),
    fetchMenuItemsForServer(),
  ]);
  return { categories, menuItems };
}

/** Deduped per request when referenced from multiple server components. */
export const fetchMenuDataForServer = cache(loadMenuDataForServer);
