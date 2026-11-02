import { NextRequest, NextResponse } from "next/server";
import { calculateTaxBreakdown } from "@/lib/orderPricing";
import type { PlaceOrderResponse } from "@/lib/orderApi";
import { maxRedeemSteps, redeemStepsToDollars, redeemStepsToPoints } from "@/lib/rewardsRules";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";
import { jsonError, readJsonObject } from "@/lib/server/http";
import { buildOrderItems } from "@/lib/server/orders/buildOrderItems";
import { parseCustomerInfo } from "@/lib/server/orders/customer";
import { resolveFulfillment } from "@/lib/server/orders/fulfillment";
import { loadMenuIndex } from "@/lib/server/orders/menuIndex";
import { newOrderDoc, newOrderRef } from "@/lib/server/orders/newOrder";
import { saveOrder, type PointsRedemption } from "@/lib/server/orders/saveOrder";
import { parseRedeemSteps, resolveRewardsMember } from "@/lib/server/rewards/member";

/**
 * Places a pay-at-pickup order. Never trusts client-submitted prices — only item/option
 * ids and quantities are read from the request body; every price is re-derived from live
 * Firestore data (lib/server/orders/buildOrderItems.ts).
 *
 * Deliberately does NOT block on sold-out/availability-window state, store hours, or
 * pause-ordering — those are surfaced to the customer as UX nudges earlier in the flow
 * (menu page badges, /api/cart/availability at checkout), but honoring an order placed
 * during a pause or outside hours is the restaurant's call, not this site's. Scheduled
 * pickups still get a sanity check (lib/server/orders/fulfillment.ts).
 *
 * A signed-in rewards member is linked to the order; points they choose to use come off
 * before tax and are only taken from their balance when the Orders app completes it.
 *
 * Field names/shapes mirror the AsianLePOS app's Order model (see orders-schema.md).
 */

type IncomingOrder = {
  lines?: unknown;
  fulfillment?: unknown;
  customerName?: unknown;
  phoneNumber?: unknown;
  customerEmail?: unknown;
  rewardsIdToken?: unknown;
  redeemSteps?: unknown;
};

export async function POST(request: NextRequest) {
  const body = await readJsonObject<IncomingOrder>(request);
  if (!body) return jsonError("Invalid request body");
  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return jsonError("Your cart is empty");
  }

  const customer = parseCustomerInfo(body);
  if ("error" in customer) return jsonError(customer.error);

  const redeem = parseRedeemSteps(body.redeemSteps);
  if ("error" in redeem) return jsonError(redeem.error);

  const rewards = await resolveRewardsMember(body.rewardsIdToken);
  if ("error" in rewards) return jsonError(rewards.error, rewards.status);
  const { member } = rewards;
  if (redeem.steps > 0 && !member) return jsonError("Sign in to rewards to use your points.");

  const [menu, storeSettings] = await Promise.all([
    loadMenuIndex(),
    fetchStoreSettingsForServer(),
  ]);

  const pickup = resolveFulfillment(body.fulfillment, storeSettings, new Date());
  if ("error" in pickup) return jsonError(pickup.error);

  const cart = buildOrderItems(body.lines, menu);
  if ("error" in cart) return jsonError(cart.error);

  let redemption: PointsRedemption | null = null;
  if (member && redeem.steps > 0) {
    if (redeem.steps > maxRedeemSteps(Number.POSITIVE_INFINITY, cart.subTotal)) {
      return jsonError("Your order total is too small to use that many points.");
    }
    if (!member.profile) {
      return jsonError(
        "Couldn't check your rewards points — please try again, or order without using points.",
        503,
      );
    }
    redemption = {
      memberId: member.memberId,
      balance: member.profile.points,
      points: redeemStepsToPoints(redeem.steps),
    };
  }

  const taxBreakDown = calculateTaxBreakdown(cart.subTotal, redeemStepsToDollars(redeem.steps));
  const loyalty: OrderLoyalty | null = member
    ? {
        memberId: member.memberId,
        // Shown to staff. Falls back to the order's name if the profile couldn't be read.
        memberName: member.profile?.name || customer.customerName,
        ...(redemption ? { pointsToRedeem: redemption.points } : {}),
      }
    : null;

  const { ref, orderNumber } = newOrderRef();
  const saved = await saveOrder(
    ref,
    newOrderDoc({
      orderNumber,
      customer,
      fulfillment: pickup.fulfillment,
      orderItems: cart.orderItems,
      taxBreakDown,
      loyalty,
    }),
    redemption,
  );
  if (!saved.ok) {
    const onOtherOrders = redemption && saved.available !== redemption.balance;
    return jsonError(
      `You have ${saved.available} points available to use${
        onOtherOrders ? " (some are already on another open order)" : ""
      } — please choose a smaller amount.`,
      409,
    );
  }

  return NextResponse.json<PlaceOrderResponse>({
    orderId: ref.id,
    orderNumber,
    taxBreakDown,
    fulfillment: pickup.wire,
  });
}
