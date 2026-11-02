import { useEffect, useState } from "react";
import { postJson } from "@/lib/apiClient";
import type { RewardsPointsRequest, RewardsPointsResponse } from "@/lib/orderApi";
import { maxRedeemSteps } from "@/lib/rewardsRules";

/** Points the signed-in member can use on this order (see /api/rewards/points). */
export type RedeemAvailability =
  | { status: "off" }
  | { status: "loading" }
  | { status: "error" }
  | ({ status: "ready" } & RewardsPointsResponse);

/**
 * Using rewards points for money off ($5 per 100 points). Asks the server how many points
 * the member can use, re-checking when the member, their live balance, or `refresh()`
 * says so. `steps` never exceeds what's allowed right now, even if the cart shrank.
 */
export function useRedeemPoints(
  member: RewardsMember | null,
  getIdToken: () => Promise<string | null>,
  subTotal: number,
) {
  // The last answer from the server, and which member it was for.
  const [checked, setChecked] = useState<{ memberId: string; result: RedeemAvailability } | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [chosenSteps, setSteps] = useState(0);

  const memberId = member?.id ?? null;
  const memberPoints = member?.points;
  useEffect(() => {
    if (!memberId) return;
    let cancelled = false;
    const done = (result: RedeemAvailability) => {
      if (!cancelled) setChecked({ memberId, result });
    };
    (async () => {
      try {
        const rewardsIdToken = await getIdToken();
        if (!rewardsIdToken || cancelled) return;
        const result = await postJson<RewardsPointsResponse>("/api/rewards/points", {
          rewardsIdToken,
        } satisfies RewardsPointsRequest);
        done(result.ok ? { status: "ready", ...result.data } : { status: "error" });
      } catch {
        done({ status: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [memberId, memberPoints, refreshKey, getIdToken]);

  // While re-checking, the last answer stays on screen so the box doesn't flicker.
  const availability: RedeemAvailability = !memberId
    ? { status: "off" }
    : checked?.memberId === memberId
      ? checked.result
      : { status: "loading" };
  const maxSteps =
    availability.status === "ready" ? maxRedeemSteps(availability.available, subTotal) : 0;
  const steps = memberId ? Math.min(chosenSteps, maxSteps) : 0;

  return {
    availability,
    steps,
    maxSteps,
    setSteps,
    /** Ask the server again (e.g. after an order was refused for points). */
    refresh: () => setRefreshKey((n) => n + 1),
  };
}

export type RedeemState = ReturnType<typeof useRedeemPoints>;
