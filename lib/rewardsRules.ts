// Asian Le Rewards rules (pure — safe on server and client). The rewards project's
// functions (asian-le-rewards/functions/src/shared.ts) are the source of truth; these
// copies are for showing the customer what will happen and for checking an order.

/** 100 points = $5 off, at most 20 steps ($100) per order — same as the POS. */
export const POINTS_PER_REDEEM_STEP = 100;
export const DOLLARS_PER_REDEEM_STEP = 5;
export const MAX_REDEEM_STEPS = 20;

/** Extra points on a member's first order, if its pre-tax subtotal (after any points
 * discount) is at least the minimum. A smaller first order uses it up. */
export const WELCOME_BONUS_POINTS = 200;
export const WELCOME_BONUS_MIN_SUBTOTAL = 15;

/** 1 point per $1 of pre-tax subtotal (after any points discount), whole points. */
export function estimatePoints(subTotal: number): number {
  return subTotal > 0 ? Math.floor(subTotal + 1e-9) : 0;
}

/** Welcome bonus this order would get (0 if none). `hasFirstOrder` = null when signed out. */
export function estimateWelcomeBonus(hasFirstOrder: boolean | null, subTotal: number): number {
  if (hasFirstOrder !== false) return 0;
  return subTotal + 1e-9 >= WELCOME_BONUS_MIN_SUBTOTAL ? WELCOME_BONUS_POINTS : 0;
}

/** Most $5 steps usable on this order: limited by available points and the subtotal
 * (never below $0), and the per-order cap. */
export function maxRedeemSteps(availablePoints: number, subTotal: number): number {
  return Math.max(
    0,
    Math.min(
      MAX_REDEEM_STEPS,
      Math.floor(availablePoints / POINTS_PER_REDEEM_STEP),
      Math.floor((subTotal + 1e-9) / DOLLARS_PER_REDEEM_STEP),
    ),
  );
}

export const redeemStepsToPoints = (steps: number) => steps * POINTS_PER_REDEEM_STEP;
export const redeemStepsToDollars = (steps: number) => steps * DOLLARS_PER_REDEEM_STEP;

/** Points promised on a member's open online orders and not yet taken from their balance
 * (the Orders app takes them on Complete and sets `pointsRedeemed`). */
export function pendingRedeemPoints(
  orders: { status?: unknown; loyalty?: { pointsToRedeem?: unknown; pointsRedeemed?: unknown } }[],
  openStatuses: readonly string[],
): number {
  let total = 0;
  for (const o of orders) {
    if (typeof o.status !== "string" || !openStatuses.includes(o.status)) continue;
    const pending = o.loyalty?.pointsToRedeem;
    if (typeof pending !== "number" || pending <= 0) continue;
    if (o.loyalty?.pointsRedeemed != null) continue;
    total += pending;
  }
  return total;
}
