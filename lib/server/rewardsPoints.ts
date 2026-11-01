import "server-only";
import type { Query } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
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

export function pendingPointsFromDocs(docs: { data: () => Record<string, unknown> }[]): number {
  return pendingRedeemPoints(
    docs.map((d) => d.data() as Parameters<typeof pendingRedeemPoints>[0][number]),
    OPEN_ORDER_STATUSES,
  );
}

/**
 * The member's points balance, read from the rewards project as the member themselves
 * (their sign-in token; the rewards rules let members read their own doc) — so the
 * balance comes from the rewards database, not from the browser. Null if it can't be read.
 */
export async function fetchMemberBalance(idToken: string, memberId: string): Promise<number | null> {
  const projectId = process.env.NEXT_PUBLIC_REWARDS_PROJECT_ID;
  if (!projectId) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/members/${encodeURIComponent(memberId)}?mask.fieldPaths=points`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${idToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      fields?: { points?: { integerValue?: string; doubleValue?: number } };
    };
    const raw = body.fields?.points;
    const points = raw?.integerValue != null ? Number(raw.integerValue) : raw?.doubleValue;
    return typeof points === "number" && Number.isFinite(points) ? points : null;
  } catch {
    return null;
  }
}
