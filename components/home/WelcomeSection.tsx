import Image from "next/image";
import Link from "next/link";
import PageContainer from "../PageContainer";

export default function WelcomeSection() {
  return (
    <section
      id="welcome"
      className="scroll-mt-28 border-y border-stone-200 bg-stone-50 py-16 md:py-24"
    >
      <PageContainer>
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="order-2 md:order-1">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
              Welcome to
            </p>
            <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
              Asian Le Restaurant
            </h2>
            <p className="mt-6 leading-relaxed text-stone-600">
              A cozy spot for Chinese and Vietnamese favorites, made fresh and
              served with care. We&apos;re best known for our flavorful fried
              rice and hearty vermicelli bowls—comforting classics made with
              quality ingredients.
            </p>
            <p className="mt-4 leading-relaxed text-stone-600">
              Whether you&apos;re grabbing a quick lunch or settling in for
              dinner, you&apos;ll be welcomed like family. We&apos;re proud to
              be your local go-to for comforting meals, warm hospitality, and a
              relaxed dining experience you&apos;ll want to come back to.
            </p>
            <p className="mt-4 leading-relaxed text-stone-600">
              Chào mừng bạn đến với Asian Le Restaurant! Chúng tôi rất hân hạnh
              được đón tiếp bạn với những món ăn nóng hổi, nguyên liệu tươi ngon
              và phong cách phục vụ thân thiện, ấm áp như ở nhà.
            </p>
            <Link
              href="/about-us"
              className="mt-8 inline-block font-semibold text-amber-700 underline-offset-4 transition hover:text-amber-800 hover:underline"
            >
              About Us →
            </Link>
          </div>
          {/* Replace src with your restaurant image (e.g. from /public/restaurant.jpg) */}
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-lg bg-stone-200 shadow-lg md:order-2">
            <Image
              src="/home/Welcome.JPG"
              alt="Dining room interior at Asian Le Restaurant, Prince Albert SK"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
