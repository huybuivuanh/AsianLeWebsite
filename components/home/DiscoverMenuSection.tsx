import Image from "next/image";
import Link from "next/link";
import PageContainer from "../PageContainer";
import DiscoverMenuItemRow from "@/components/home/DiscoverMenuItemRow";
import { MENU_INTRO, APPETIZERS, MAIN_COURSES } from "@/components/home/discoverMenuData";

export default function DiscoverMenuSection() {
  return (
    <section
      id="discover-menu"
      className="scroll-mt-28 border-t border-stone-200 bg-stone-50 py-16 md:py-24"
    >
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Discover
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Our Menu
          </h2>
          <p className="mt-6 leading-relaxed text-stone-600">{MENU_INTRO}</p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl space-y-20 lg:space-y-24">
          {/* Appetizer */}
          <div>
            <h3 className="mb-8 border-l-4 border-amber-500 pl-4 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              Appetizers
            </h3>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
              <div className="flex flex-col">
                <div className="space-y-4">
                  {APPETIZERS.map((item, i) => (
                    <DiscoverMenuItemRow key={i} {...item} />
                  ))}
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200 shadow-md">
                  <Image
                    src="/home/discover/Ingredients 2.jpg"
                    alt="Ingredients"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                </div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200 shadow-md">
                  <Image
                    src="/home/discover/Ingredients 3.jpg"
                    alt="Ingredients"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Courses */}
          <div>
            <h3 className="mb-8 border-l-4 border-amber-500 pl-4 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              Main Courses
            </h3>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
              <div className="order-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200 shadow-md">
                  <Image
                    src="/home/discover/Fried Rice.png"
                    alt="Chicken Fried Rice"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                </div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200 shadow-md">
                  <Image
                    src="/home/discover/Chow Mein.png"
                    alt="Chow Mein"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                </div>
              </div>
              <div className="order-2 flex flex-col">
                <div className="space-y-4">
                  {MAIN_COURSES.map((item, i) => (
                    <DiscoverMenuItemRow key={i} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/menu"
            className="inline-block rounded-md bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50"
          >
            See Our Full Menu
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
