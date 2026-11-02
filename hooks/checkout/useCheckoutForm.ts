import { useState, type FormEvent } from "react";
import { postJson } from "@/lib/apiClient";
import { cartSubtotal, toCartLineRequest, useCartStore } from "@/lib/cartStore";
import type { FulfillmentWire, PlaceOrderRequest, PlaceOrderResponse } from "@/lib/orderApi";
import { calculateTaxBreakdown, taxableSubtotalOf } from "@/lib/orderPricing";
import {
  estimatePoints,
  estimateWelcomeBonus,
  redeemStepsToDollars,
  redeemStepsToPoints,
} from "@/lib/rewardsRules";
import { useCartAvailability } from "@/hooks/checkout/useCartAvailability";
import { useCustomerDetails } from "@/hooks/checkout/useCustomerDetails";
import { usePickupSchedule } from "@/hooks/checkout/usePickupSchedule";
import { usePlacedOrder } from "@/hooks/checkout/usePlacedOrder";
import { useRedeemPoints } from "@/hooks/checkout/useRedeemPoints";
import { useLiveStoreSettings } from "@/hooks/useLiveStoreSettings";
import { useRewardsMember } from "@/hooks/useRewardsMember";

/**
 * The checkout page's state and actions, put together from the focused hooks in this
 * folder. Owns the one thing that needs all of them: checking the form and placing the
 * order (/api/orders). Components under components/checkout stay presentational.
 */
export function useCheckoutForm(initialStoreSettings: StoreSettings) {
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const removeLine = useCartStore((s) => s.removeLine);

  const { unavailableLineIds, priceUpdates } = useCartAvailability(lines);
  // Staff update the wait time often when busy — follow it live on top of the page's copy.
  const { waitTime } = useLiveStoreSettings(initialStoreSettings);
  const pickup = usePickupSchedule(initialStoreSettings);
  const rewards = useRewardsMember();
  const customer = useCustomerDetails(rewards.member);

  const subTotal = cartSubtotal(lines);
  const redeem = useRedeemPoints(rewards.member, rewards.getIdToken, subTotal);
  const taxBreakDown = calculateTaxBreakdown(subTotal, redeemStepsToDollars(redeem.steps));

  const { submitState, setSubmitState, cancelOrder, cancelling, cancelError } = usePlacedOrder();
  // Set while the "extra charges at pickup" warning is open, waiting for the customer.
  const [pendingFulfillment, setPendingFulfillment] = useState<FulfillmentWire | null>(null);

  function showError(message: string) {
    setSubmitState({ status: "error", message });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (unavailableLineIds.size > 0) {
      return showError("Some items in your cart are no longer available — remove them to continue.");
    }
    if (customer.phone.length !== 10) {
      return showError("Please enter a valid 10-digit phone number.");
    }
    const chosen = pickup.resolvePickup();
    if ("error" in chosen) return showError(chosen.error);
    // One more confirmation before placing the order: free-text instructions aren't
    // priced here, so any extra charge they need is added at pickup.
    setPendingFulfillment(chosen.fulfillment);
  }

  async function placeOrder(fulfillment: FulfillmentWire) {
    setSubmitState({ status: "submitting" });

    let rewardsIdToken: string | null;
    try {
      rewardsIdToken = await rewards.getIdToken();
    } catch {
      return showError(
        "Couldn't confirm your rewards sign-in — check your connection, or sign out of rewards to order without points.",
      );
    }
    const redeemSteps = rewardsIdToken ? redeem.steps : 0;

    const request: PlaceOrderRequest = {
      lines: lines.map(toCartLineRequest),
      fulfillment,
      customerName: customer.name.trim(),
      phoneNumber: customer.phone,
      customerEmail: customer.email.trim(),
      ...(rewardsIdToken ? { rewardsIdToken } : {}),
      ...(redeemSteps > 0 ? { redeemSteps } : {}),
    };

    try {
      const result = await postJson<PlaceOrderResponse>("/api/orders", request);
      if (!result.ok) {
        showError(result.error ?? "Something went wrong. Please try again.");
        // Points may have been used elsewhere — show the current amount.
        if (redeemSteps > 0) redeem.refresh();
        return;
      }
      const saved = result.data;
      clearCart();
      const earnable = taxableSubtotalOf(saved.taxBreakDown);
      setSubmitState({
        status: "confirming",
        orderId: saved.orderId,
        order: {
          orderNumber: saved.orderNumber,
          total: saved.taxBreakDown.total,
          fulfillment: saved.fulfillment,
          rewardsPoints: rewardsIdToken
            ? estimatePoints(earnable) +
              estimateWelcomeBonus(rewards.member?.hasFirstOrder ?? null, earnable)
            : null,
          pointsUsed: redeemStepsToPoints(redeemSteps),
          discount: saved.taxBreakDown.discount?.discountAmount ?? 0,
        },
      });
    } catch {
      showError("Network error. Please try again.");
    }
  }

  function confirmInstructionsWarning() {
    if (!pendingFulfillment) return;
    setPendingFulfillment(null);
    void placeOrder(pendingFulfillment);
  }

  return {
    lines,
    removeLine,
    unavailableLineIds,
    priceUpdates,
    waitTime,
    pickup,
    customer,
    rewards,
    redeem,
    taxBreakDown,
    /** Pre-tax amount after any points discount — what points are earned on. */
    earnableSubtotal: taxableSubtotalOf(taxBreakDown),
    submitState,
    handleSubmit,
    cancelOrder,
    cancelling,
    cancelError,
    showInstructionsWarning: pendingFulfillment !== null,
    confirmInstructionsWarning,
    dismissInstructionsWarning: () => setPendingFulfillment(null),
  };
}
