import PageContainer from "../PageContainer";

const ADDRESS = {
  line1: "Unit #3, 1400 6 Ave E",
  city: "Prince Albert, SK S6V 2K2",
};

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps?cid=11746207782635991944&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAEYASAB&hl=en&gl=CA&source=embed";

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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2389.9769899489197!2d-105.7397006232774!3d53.2003288722473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53017a65b9325e77%3A0xa302e9be85f27388!2sAsian%20Le!5e0!3m2!1sen!2sca!4v1773018326281!5m2!1sen!2sca"
                width="600"
                height="450"
                style={{ border: "0" }}
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
