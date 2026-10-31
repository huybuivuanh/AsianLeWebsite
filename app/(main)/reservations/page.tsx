import type { Metadata } from "next";
import PageContainer from "@/components/PageContainer";
import ReservationForm from "@/components/reservation/ReservationForm";
import { fetchStoreSettingsForServer } from "@/lib/storeSettings";

// Store hours/pause-ordering must be current at request time, not ISR-stale.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description:
    "Book a table at Asian Le Restaurant in Prince Albert, SK — reserve online for lunch or dinner, Chinese & Vietnamese dine-in.",
  openGraph: {
    title: "Reserve a Table | Asian Le Restaurant",
    description:
      "Book a table online for Chinese & Vietnamese dine-in at Asian Le Restaurant, Prince Albert, SK.",
  },
};

export default async function ReservationsPage() {
  const storeSettings = await fetchStoreSettingsForServer();

  return (
    <section className="bg-white py-16 md:py-24">
      <PageContainer>
        <h1 className="text-center text-3xl font-bold text-stone-900 sm:text-4xl">
          Reserve a table
        </h1>
        <p className="mx-auto mt-3 mb-10 max-w-xl text-center text-stone-600">
          Pick a time and we&apos;ll confirm your reservation right here — usually within a
          minute.
        </p>
        <ReservationForm initialStoreSettings={storeSettings} />
      </PageContainer>
    </section>
  );
}
