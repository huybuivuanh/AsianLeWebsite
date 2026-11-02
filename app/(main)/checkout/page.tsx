import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";
import { STORE } from "@/lib/store";

// Store hours/pause-ordering must be current at request time, not ISR-stale.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const storeSettings = await fetchStoreSettingsForServer();

  return (
    <>
      <section className="bg-ink text-on-ink">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-11 sm:px-6 lg:px-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-gold">
            Pickup at {STORE.address.line1}
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.035em]">
            Check<span className="font-accent font-normal italic text-gold">out</span>
          </h1>
          <p className="mt-3 text-lg text-on-ink-muted">
            No payment online — you&apos;ll pay in person when you pick up.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <CheckoutForm initialStoreSettings={storeSettings} />
      </section>
    </>
  );
}
