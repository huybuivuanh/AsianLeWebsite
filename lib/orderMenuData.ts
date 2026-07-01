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
import { mapImageItemField, sortAlphabetically } from "@/lib/utils";
import { KitchenType } from "@/types/enum";

/**
 * Server-side fetchers for the ordering data model (demoCategories / demoMenuItems /
 * optionGroups / options), per ecommerce.md. Use from Server Components only.
 */

const KITCHEN_TYPES: KitchenType[] = Object.values(KitchenType);

function mapAvailability(raw: unknown): MenuItemAvailability | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const start = (raw as { start?: unknown }).start;
  const end = (raw as { end?: unknown }).end;
  if (typeof start !== "string" || typeof end !== "string") return undefined;
  return { start, end };
}

function mapSoldOut(raw: unknown): MenuItemSoldOut | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as { since?: { toDate?: () => Date }; hours?: unknown; indefinite?: unknown };
  return {
    since: r.since?.toDate?.() ?? new Date(),
    hours: typeof r.hours === "number" ? r.hours : undefined,
    indefinite: r.indefinite === true,
  };
}

function mapStringArray(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const filtered = raw.filter((v): v is string => typeof v === "string");
  return filtered.length > 0 ? filtered : undefined;
}

/** Normalizes optionGroupIds to `{optionGroupId, order}[]`, sorted by order ascending.
 * Legacy docs may store plain `string[]` — those get index-based order. */
function normalizeOptionGroupRefs(raw: unknown): OptionGroupId[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const refs = raw
    .map((entry, index): OptionGroupId | null => {
      if (typeof entry === "string") return { optionGroupId: entry, order: index };
      if (entry && typeof entry === "object" && typeof (entry as { optionGroupId?: unknown }).optionGroupId === "string") {
        const order = (entry as { order?: unknown }).order;
        return {
          optionGroupId: (entry as { optionGroupId: string }).optionGroupId,
          order: typeof order === "number" ? order : index,
        };
      }
      return null;
    })
    .filter((v): v is OptionGroupId => v !== null);
  return refs.length > 0 ? refs.sort((a, b) => a.order - b.order) : undefined;
}

function mapDocToDemoCategory(doc: QueryDocumentSnapshot<DocumentData>): DemoCategory {
  const d = doc.data();
  return {
    id: doc.id,
    name: (d.name as string) ?? "",
    description: d.description as string | undefined,
    itemIds: mapStringArray(d.itemIds),
    order: typeof d.order === "number" ? d.order : 0,
    createdAt: (d.createdAt?.toDate?.() ?? new Date()) as Date,
  };
}

function mapDocToDemoMenuItem(doc: QueryDocumentSnapshot<DocumentData>): DemoMenuItem {
  const d = doc.data();
  const price = typeof d.price === "number" && Number.isFinite(d.price) ? d.price : 0;
  const kitchenType = KITCHEN_TYPES.includes(d.kitchenType)
    ? (d.kitchenType as KitchenType)
    : KitchenType.OTHER;
  return {
    id: doc.id,
    name: (d.name as string) ?? "",
    description: d.description as string | undefined,
    price,
    image: mapImageItemField(d.image),
    optionGroupIds: normalizeOptionGroupRefs(d.optionGroupIds),
    categoryIds: mapStringArray(d.categoryIds),
    kitchenType,
    availability: mapAvailability(d.availability),
    soldOut: mapSoldOut(d.soldOut),
    createdAt: (d.createdAt?.toDate?.() ?? new Date()) as Date,
  };
}

function mapDocToOptionGroup(doc: QueryDocumentSnapshot<DocumentData>): OptionGroup {
  const d = doc.data();
  return {
    id: doc.id,
    name: (d.name as string) ?? "",
    minSelection: typeof d.minSelection === "number" ? d.minSelection : 0,
    maxSelection: typeof d.maxSelection === "number" ? d.maxSelection : 1,
    multipleOptionQuantity: d.multipleOptionQuantity === true,
    optionIds: mapStringArray(d.optionIds),
    itemIds: mapStringArray(d.itemIds),
    defaultOptionId: typeof d.defaultOptionId === "string" ? d.defaultOptionId : undefined,
    createdAt: (d.createdAt?.toDate?.() ?? new Date()) as Date,
  };
}

function mapDocToItemOption(doc: QueryDocumentSnapshot<DocumentData>): ItemOption {
  const d = doc.data();
  const price = typeof d.price === "number" && Number.isFinite(d.price) ? d.price : 0;
  return {
    id: doc.id,
    name: (d.name as string) ?? "",
    price,
    groupIds: mapStringArray(d.groupIds),
    availability: mapAvailability(d.availability),
    soldOut: mapSoldOut(d.soldOut),
    createdAt: (d.createdAt?.toDate?.() ?? new Date()) as Date,
  };
}

export async function fetchDemoCategoriesForServer(): Promise<DemoCategory[]> {
  const q = query(collection(db, "demoCategories"), orderBy("order"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDocToDemoCategory);
}

export async function fetchDemoMenuItemsForServer(): Promise<DemoMenuItem[]> {
  const snapshot = await getDocs(collection(db, "demoMenuItems"));
  const items = snapshot.docs.map(mapDocToDemoMenuItem);
  return sortAlphabetically(items, (item) => item.name);
}

export async function fetchOptionGroupsForServer(): Promise<OptionGroup[]> {
  const snapshot = await getDocs(collection(db, "optionGroups"));
  return snapshot.docs.map(mapDocToOptionGroup);
}

export async function fetchItemOptionsForServer(): Promise<ItemOption[]> {
  const snapshot = await getDocs(collection(db, "options"));
  return snapshot.docs.map(mapDocToItemOption);
}

async function loadOrderMenuDataForServer(): Promise<{
  categories: DemoCategory[];
  menuItems: DemoMenuItem[];
  optionGroups: OptionGroup[];
  options: ItemOption[];
}> {
  const [categories, menuItems, optionGroups, options] = await Promise.all([
    fetchDemoCategoriesForServer(),
    fetchDemoMenuItemsForServer(),
    fetchOptionGroupsForServer(),
    fetchItemOptionsForServer(),
  ]);
  return { categories, menuItems, optionGroups, options };
}

/** Deduped per request when referenced from multiple server components. */
export const fetchOrderMenuDataForServer = cache(loadOrderMenuDataForServer);
