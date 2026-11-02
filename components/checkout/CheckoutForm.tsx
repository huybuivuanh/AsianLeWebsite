"use client";

import Link, { useLinkStatus } from "next/link";
import { useCheckoutForm } from "@/hooks/checkout/useCheckoutForm";
import PickupSection from "@/components/checkout/PickupSection";
import CustomerInfoSection from "@/components/checkout/CustomerInfoSection";
import RewardsSection from "@/components/checkout/rewards/RewardsSection";
import OrderSummaryPanel from "@/components/checkout/OrderSummaryPanel";
import InstructionsWarningModal from "@/components/checkout/InstructionsWarningModal";
import OrderConfirmingView from "@/components/checkout/OrderConfirmingView";
import OrderSuccessView from "@/components/checkout/OrderSuccessView";
import OrderCancelledView from "@/components/checkout/OrderCancelledView";
import EmptyCartView from "@/components/checkout/EmptyCartView";
import StoreClosedView from "@/components/checkout/StoreClosedView";

type CheckoutFormProps = {
  initialStoreSettings: StoreSettings;
};

function BackToShoppingSpinner() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function CheckoutForm({
  initialStoreSettings,
}: CheckoutFormProps) {
  const checkout = useCheckoutForm(initialStoreSettings);
  const { pickup, customer } = checkout;

  if (checkout.submitState.status === "confirming") {
    return (
      <OrderConfirmingView
        onCancel={checkout.cancelOrder}
        cancelling={checkout.cancelling}
        cancelError={checkout.cancelError}
      />
    );
  }

  if (checkout.submitState.status === "success") {
    return (
      <OrderSuccessView {...checkout.submitState.order} readyBy={checkout.submitState.readyBy} />
    );
  }

  if (checkout.submitState.status === "cancelled") {
    return <OrderCancelledView />;
  }

  if (checkout.lines.length === 0) return <EmptyCartView />;

  if (!pickup.canOrderAtAll) return <StoreClosedView />;

  return (
    <form
      onSubmit={checkout.handleSubmit}
      className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]"
    >
      <InstructionsWarningModal
        open={checkout.showInstructionsWarning}
        onConfirm={checkout.confirmInstructionsWarning}
        onCancel={checkout.dismissInstructionsWarning}
      />
      <div className="space-y-5">
        <Link
          href="/order"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-sand-line bg-white px-5 text-sm font-bold text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          ← Keep ordering
          <BackToShoppingSpinner />
        </Link>

        <PickupSection
          storeOpenNow={pickup.storeOpenNow}
          currentStoreTime={pickup.currentStoreTime}
          waitTime={checkout.waitTime}
          fulfillmentKind={pickup.fulfillmentKind}
          setFulfillmentKind={pickup.setFulfillmentKind}
          scheduledLocal={pickup.scheduledLocal}
          setScheduledLocal={pickup.setScheduledLocal}
          minLocal={pickup.minLocal}
          maxLocal={pickup.maxLocal}
        />

        <RewardsSection
          rewards={checkout.rewards}
          subTotal={checkout.earnableSubtotal}
          redeem={checkout.redeem}
        />

        <CustomerInfoSection
          name={customer.name}
          setName={customer.setName}
          phone={customer.phone}
          setPhone={customer.setPhone}
          email={customer.email}
          setEmail={customer.setEmail}
        />

        {checkout.submitState.status === "error" ? (
          <p role="alert" className="rounded-2xl border border-brand/30 bg-white px-4 py-3 text-sm font-bold text-brand">
            {checkout.submitState.message}
          </p>
        ) : null}
      </div>

      <OrderSummaryPanel
        lines={checkout.lines}
        unavailableLineIds={checkout.unavailableLineIds}
        priceUpdates={checkout.priceUpdates}
        removeLine={checkout.removeLine}
        taxBreakDown={checkout.taxBreakDown}
        submitState={checkout.submitState}
      />
    </form>
  );
}
