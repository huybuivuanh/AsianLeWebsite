import PageContainer from "../PageContainer";

const ADDRESS = {
  line1: "Unit #3, 1400 6 Ave E",
  city: "Prince Albert, SK S6V 2K2",
};

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?q=1400+6+Ave+E,Prince+Albert,SK+S6V+2K2&z=15&ie=UTF8&iwloc=&output=embed";

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=1400+6+Ave+E,Prince+Albert,SK+S6V+2K2";

export default function OurLocationSection() {
  return (
    <section className="border-t border-stone-200 bg-white py-16 md:py-24">
      <PageContainer>
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
              Find us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Our Location
            </h2>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start">
            <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6">
              <h3 className="font-semibold text-stone-900">Address</h3>
              <address className="mt-3 not-italic leading-relaxed text-stone-600">
                {ADDRESS.line1}
                <br />
                {ADDRESS.city}
              </address>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-amber-700 underline-offset-4 hover:text-amber-800 hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
              <iframe
                title="Asian Le Restaurant location"
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                className="absolute inset-0 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
