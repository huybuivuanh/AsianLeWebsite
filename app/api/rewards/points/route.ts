import { NextRequest, NextResponse } from "next/server";
import { verifyRewardsIdToken } from "@/lib/server/rewardsAuth";
import {
  fetchMemberBalance,
  memberOpenOrdersQuery,
  pendingPointsFromDocs,
} from "@/lib/server/rewardsPoints";

export const dynamic = "force-dynamic";

/**
 * Points the signed-in member can use at checkout: balance minus points already promised
 * on their other open online orders. Display only — /api/orders checks again when saving.
 */
export async function POST(request: NextRequest) {
  let body: { rewardsIdToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const idToken = typeof body.rewardsIdToken === "string" ? body.rewardsIdToken : "";
  const memberId = idToken ? await verifyRewardsIdToken(idToken) : null;
  if (!memberId) {
    return NextResponse.json({ error: "Rewards sign-in expired." }, { status: 401 });
  }

  const [balance, openOrders] = await Promise.all([
    fetchMemberBalance(idToken, memberId),
    memberOpenOrdersQuery(memberId).get(),
  ]);
  if (balance == null) {
    return NextResponse.json({ error: "Couldn't check your points." }, { status: 502 });
  }
  const pending = pendingPointsFromDocs(openOrders.docs);
  return NextResponse.json({ balance, pending, available: Math.max(0, balance - pending) });
}
