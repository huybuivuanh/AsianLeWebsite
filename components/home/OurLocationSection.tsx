import { STORE } from "@/lib/store";
import PageContainer from "../PageContainer";
import StoreMap from "../contact/StoreMap";

export default function OurLocationSection() {
  return (
    <section className="border-t border-stone-200 bg-white py-16 md:py-24">
      <PageContainer>
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
              Find us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Our Location
            </h2>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12 lg:items-start">
            <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6">
              <h3 className="font-semibold text-stone-900">Address</h3>
              <address className="mt-3 not-italic leading-relaxed text-stone-600">
                {STORE.address.line1}
                <br />
                {STORE.address.city}
              </address>
              <a
                href={STORE.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-amber-700 underline-offset-4 hover:text-amber-800 hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>

            <StoreMap
              embedSrc={STORE.mapEmbedSrc}
              aspect="responsive"
              className="rounded-2xl shadow-sm"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
