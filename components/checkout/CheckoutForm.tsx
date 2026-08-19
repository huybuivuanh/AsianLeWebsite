"use client";

import Link from "next/link";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import PickupSection from "@/components/checkout/PickupSection";
import CustomerInfoSection from "@/components/checkout/CustomerInfoSection";
import OrderSummaryPanel from "@/components/checkout/OrderSummaryPanel";
import OrderSuccessView from "@/components/checkout/OrderSuccessView";
import EmptyCartView from "@/components/checkout/EmptyCartView";
import StoreClosedView from "@/components/checkout/StoreClosedView";

type CheckoutFormProps = {
  initialStoreSettings: StoreSettings;
};

export default function CheckoutForm({
  initialStoreSettings,
}: CheckoutFormProps) {
  const checkout = useCheckoutForm(initialStoreSettings);

  if (checkout.submitState.status === "success") {
    return (
      <OrderSuccessView
        orderNumber={checkout.submitState.orderNumber}
        total={checkout.submitState.total}
        fulfillment={checkout.submitState.fulfillment}
      />
    );
  }

  if (checkout.lines.length === 0) return <EmptyCartView />;

  if (!checkout.canOrderAtAll) return <StoreClosedView />;

  return (
    <form
      onSubmit={checkout.handleSubmit}
      className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_22rem]"
    >
      <div className="space-y-6">
        <Link
          href="/order"
          className="inline-flex items-center gap-2 rounded-full border-2 border-amber-600 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        >
          ← Back to shopping
        </Link>

        <PickupSection
          storeOpenNow={checkout.storeOpenNow}
          currentStoreTime={checkout.currentStoreTime}
          waitTime={checkout.waitTime}
          fulfillmentKind={checkout.fulfillmentKind}
          setFulfillmentKind={checkout.setFulfillmentKind}
          scheduledLocal={checkout.scheduledLocal}
          setScheduledLocal={checkout.setScheduledLocal}
          minLocal={checkout.minLocal}
          maxLocal={checkout.maxLocal}
        />

        <CustomerInfoSection
          name={checkout.name}
          setName={checkout.setName}
          phone={checkout.phone}
          setPhone={checkout.setPhone}
          email={checkout.email}
          setEmail={checkout.setEmail}
        />

        {checkout.submitState.status === "error" ? (
          <p role="alert" className="text-sm font-medium text-red-600">
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
