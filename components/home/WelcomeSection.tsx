import Image from "next/image";
import Link from "next/link";
import { vietnameseSerif } from "@/lib/fonts";

export default function WelcomeSection() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:flex-row lg:gap-16 lg:px-8">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brand">Welcome to</p>
        <h2 className="mt-3 text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
          Asian Le <span className="font-accent font-normal italic">Restaurant</span>
        </h2>
        <p className="mt-6 leading-relaxed text-body">
          A cozy spot for Chinese and Vietnamese favorites, made fresh and served with care.
          We&apos;re best known for our flavorful fried rice and hearty vermicelli bowls —
          comforting classics made with quality ingredients.
        </p>
        <p className="mt-4 leading-relaxed text-body">
          Whether you&apos;re grabbing a quick lunch or settling in for dinner, you&apos;ll be
          welcomed like family. We&apos;re proud to be your local go-to for comforting meals and
          warm hospitality.
        </p>
        <p
          lang="vi"
          className={`${vietnameseSerif.className} mt-5 text-[24px] leading-snug text-[#2a2520]`}
        >
          “Mời bạn ghé Asian Le Restaurant — món ăn nóng hổi, nguyên liệu tươi ngon, ấm áp
          như ở nhà.”
        </p>
        <Link
          href="/about-us"
          className="mt-6 inline-block rounded-md font-bold text-brand transition hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          About us →
        </Link>
      </div>
      <div className="relative aspect-[4/3] w-full min-w-0 flex-1 overflow-hidden rounded-[32px] bg-sand-deep">
        <Image
          src="/home/Opening Hours.JPG"
          alt="The dining room at Asian Le Restaurant"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
