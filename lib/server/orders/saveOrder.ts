import "server-only";
import type { DocumentData, DocumentReference } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { memberOpenOrdersQuery, pendingPointsFromDocs } from "@/lib/server/rewards/points";

/** Points the order wants to use, and the member's balance read just before saving. */
export type PointsRedemption = { memberId: string; balance: number; points: number };

/**
 * Saves the order. With points to use, the save runs in the same transaction as reading
 * the member's other open orders, so two orders placed at once can't both promise the
 * same points. On a shortfall nothing is saved and `available` says how many are left.
 */
export async function saveOrder(
  ref: DocumentReference,
  orderDoc: DocumentData,
  redemption: PointsRedemption | null,
): Promise<{ ok: true } | { ok: false; available: number }> {
  if (!redemption) {
    await ref.set(orderDoc);
    return { ok: true };
  }

  return adminDb.runTransaction(async (tx) => {
    const openOrders = await tx.get(memberOpenOrdersQuery(redemption.memberId));
    const left = redemption.balance - pendingPointsFromDocs(openOrders.docs);
    if (left < redemption.points) return { ok: false as const, available: Math.max(0, left) };
    tx.set(ref, orderDoc);
    return { ok: true as const };
  });
}
