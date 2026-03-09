import Image from "next/image";
import { STORE } from "@/lib/store";
import PageContainer from "../components/PageContainer";
import ContactDetails from "../components/contact/ContactDetails";
import StoreMap from "../components/contact/StoreMap";

const TITLE_BG_IMAGE =
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80";

export default function ContactUs() {
  return (
    <>
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-stone-800 sm:min-h-[320px]">
        <Image
          src={TITLE_BG_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-stone-900/60" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-stone-200 sm:text-xl">
            We&apos;d love to hear from you
          </p>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white py-16 md:py-24">
        <PageContainer>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
              <div className="lg:col-span-2">
                <ContactDetails
                  contact={{
                    address: STORE.address,
                    phone: STORE.phone,
                    email: STORE.email,
                    hours: STORE.hours,
                  }}
                  socialLinks={STORE.socialLinks}
                  googleMapsLink={STORE.googleMapsLink}
                />
              </div>
              <div className="lg:col-span-3">
                <div className="sticky top-4">
                  <StoreMap
                    embedSrc={STORE.mapEmbedSrc}
                    aspect="responsive"
                  />
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
