import Image from "next/image";
import { STORE } from "@/lib/store";
import PageContainer from "../../../components/PageContainer";
import ContactDetails from "../../../components/contact/ContactDetails";
import ContactForm from "../../../components/contact/ContactForm";
import StoreMap from "../../../components/contact/StoreMap";

export default function ContactUs() {
  return (
    <>
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-stone-800 sm:min-h-[320px]">
        <Image
          src="/home/hero carousel/3.jpg"
          alt="background image"
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
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Visit us & get in touch
            </p>
            <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              We&apos;re here for you
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
              Stop by for a meal, give us a Call Us, or send a message below.
            </p>

            <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
              <div>
                <h3 className="mb-5 border-l-4 border-amber-500 pl-4 text-lg font-bold tracking-tight text-stone-900">
                  Contact & hours
                </h3>
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

              <div className="lg:min-w-0">
                <ContactForm />
              </div>
            </div>

            <div className="mt-16 lg:mt-20">
              <h3 className="mb-5 border-l-4 border-amber-500 pl-4 text-lg font-bold tracking-tight text-stone-900">
                Find us
              </h3>
              <StoreMap
                embedSrc={STORE.mapEmbedSrc}
                aspect="responsive"
                className="rounded-2xl shadow-sm"
              />
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
