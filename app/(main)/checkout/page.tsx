import PageContainer from "@/components/PageContainer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";

// Store hours/pause-ordering must be current at request time, not ISR-stale.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const storeSettings = await fetchStoreSettingsForServer();

  return (
    <section className="bg-white py-16 md:py-24">
      <PageContainer>
        <h1 className="mb-10 text-center text-3xl font-bold text-stone-900 sm:text-4xl">
          Checkout
        </h1>
        <CheckoutForm initialStoreSettings={storeSettings} />
      </PageContainer>
    </section>
  );
}
