import { NextRequest, NextResponse } from "next/server";
import type { RewardsPointsResponse } from "@/lib/orderApi";
import { jsonError, readJsonObject } from "@/lib/server/http";
import { resolveRewardsMember } from "@/lib/server/rewards/member";
import { memberOpenOrdersQuery, pendingPointsFromDocs } from "@/lib/server/rewards/points";

export const dynamic = "force-dynamic";

/**
 * Points the signed-in member can use at checkout: balance minus points already promised
 * on their other open online orders. Display only — /api/orders checks again when saving.
 */
export async function POST(request: NextRequest) {
  const body = await readJsonObject<{ rewardsIdToken?: unknown }>(request);
  if (!body) return jsonError("Invalid request body");

  const rewards = await resolveRewardsMember(body.rewardsIdToken);
  if ("error" in rewards) return jsonError(rewards.error, rewards.status);
  if (!rewards.member) return jsonError("Rewards sign-in expired.", 401);
  const { memberId, profile } = rewards.member;
  if (!profile) return jsonError("Couldn't check your points.", 502);

  const openOrders = await memberOpenOrdersQuery(memberId).get();
  const pending = pendingPointsFromDocs(openOrders.docs);
  return NextResponse.json<RewardsPointsResponse>({
    balance: profile.points,
    pending,
    available: Math.max(0, profile.points - pending),
  });
}
