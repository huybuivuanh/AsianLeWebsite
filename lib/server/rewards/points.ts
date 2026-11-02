import "server-only";
import type { Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { REWARDS_PROJECT_ID } from "@/lib/rewardsConfig";
import { pendingRedeemPoints } from "@/lib/rewardsRules";
import { OrderStatus } from "@/types/enum";

/**
 * Points a member can use on a new online order = their rewards balance minus points
 * already promised on their other open online orders (taken only on Complete, so they're
 * still in the balance). See lib/rewardsRules.ts.
 */

/** Orders whose promised points haven't been taken or released yet. */
export const OPEN_ORDER_STATUSES = [
  OrderStatus.New,
  OrderStatus.InProgress,
  OrderStatus.ReadyForPickup,
] as const;

/** The member's open online orders (this site's `orders`). */
export function memberOpenOrdersQuery(memberId: string): Query {
  return adminDb
    .collection("orders")
    .where("loyalty.memberId", "==", memberId)
    .where("status", "in", [...OPEN_ORDER_STATUSES]);
}

/** Points promised on these open orders and not yet taken. */
export function pendingPointsFromDocs(docs: QueryDocumentSnapshot[]): number {
  return pendingRedeemPoints(
    docs.map((d) => d.data() as Parameters<typeof pendingRedeemPoints>[0][number]),
    OPEN_ORDER_STATUSES,
  );
}

export type MemberProfile = { name: string; points: number };

type FirestoreRestValue = { stringValue?: string; integerValue?: string; doubleValue?: number };

/**
 * The member's name and points balance, read from the rewards project as the member
 * themselves (their sign-in token; the rewards rules let members read their own doc) — so
 * they come from the rewards database, not from the browser. Null if it can't be read.
 */
export async function fetchMemberProfile(
  idToken: string,
  memberId: string,
): Promise<MemberProfile | null> {
  if (!REWARDS_PROJECT_ID) return null;
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(REWARDS_PROJECT_ID)}` +
    `/databases/(default)/documents/members/${encodeURIComponent(memberId)}` +
    `?mask.fieldPaths=points&mask.fieldPaths=name`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${idToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      fields?: { points?: FirestoreRestValue; name?: FirestoreRestValue };
    };
    const rawPoints = body.fields?.points;
    const points =
      rawPoints?.integerValue != null ? Number(rawPoints.integerValue) : rawPoints?.doubleValue;
    if (typeof points !== "number" || !Number.isFinite(points)) return null;
    return { name: body.fields?.name?.stringValue?.trim() ?? "", points };
  } catch {
    return null;
  }
}
