import Image from "next/image";
import Link from "next/link";
import PageContainer from "../PageContainer";

const MENU_INTRO =
  "We invite you to celebrate our restaurant's delicious recipes whether you are here for a business lunch or dinner. Discover new tastes and inspired recipes from all over the world.";

const APPETIZERS = [
  {
    name: "Homemade Vietnamese Spring Rolls",
    portion: "(4)",
    price: "$7.00",
    description:
      "Crispy, Pork and Vegetables filling. Served with Homemade fish sauce vinaigrette",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=160&q=80",
  },
  {
    name: "House Breaded Panko Coconut Shrimp",
    portion: "(8)",
    price: "$12.00",
    description:
      "Special home-made with crispy tastes come with sweet chillies sauce",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=160&q=80",
  },
  {
    name: "House Special Chicken Wings",
    portion: "",
    price: "$18.00",
    description:
      "1lb of Crispy Chicken Wings. Choose your favorite flavor: Teriyaki, Honey Garlic, BBQ, Lemon Pepper, Buffalo",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=160&q=80",
  },
];

const MAIN_COURSES = [
  {
    name: "Special Vietnamese Beef Noodle Soup (Phở)",
    portion: "(M)..$12.00 ... (L)..$15.00",
    price: "",
    description:
      "Most famous Vietnamese soup, savoury, rich, aromatic. GLUTEN FREE",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=160&q=80",
  },
  {
    name: "Banh Mi (Sub)",
    portion: "",
    price: "From $10.00",
    description:
      "Grilled Chicken / Beef / Pork / Fried Tofu & Vegetables Banh Mi",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=160&q=80",
  },
  {
    name: "Chicken Pad Thai",
    portion: "",
    price: "From $15.00",
    description:
      "Chicken / Shrimp / Vegetable / Chicken & Shrimp. Add Fried Tofu for $3",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=160&q=80",
  },
  {
    name: "Mango Salad",
    portion: "",
    price: "$17.00",
    description:
      "Shredded mango, pickled carrots & Daikon, mint, onion, toasted peanut. GLUTEN FREE.",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=160&q=80",
  },
];

function MenuItemRow({
  name,
  portion,
  price,
  description,
  image,
}: {
  name: string;
  portion: string;
  price: string;
  description: string;
  image: string;
}) {
  const priceText =
    portion && price
      ? ` ${portion}..${price}`
      : portion
        ? ` ${portion}`
        : price
          ? ` ${price}`
          : "";
  return (
    <div className="flex gap-4 rounded-xl border border-stone-200/80 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:shadow-md">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-200">
        <Image src={image} alt="" fill className="object-cover" sizes="80px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-stone-900">
          {name}
          {priceText && (
            <span className="mt-1 block font-medium text-amber-700">
              {priceText.trim().replace(/^\.\./, "").replace(/\.\./g, " · ")}
            </span>
          )}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
          {description}
        </p>
      </div>
    </div>
  );
}

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
                    <MenuItemRow key={i} {...item} />
                  ))}
                </div>
                <div className="mt-8 flex justify-center lg:justify-start">
                  <Link
                    href="/menu"
                    className="inline-flex items-center rounded-lg border-2 border-stone-900 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-stone-600 focus:ring-offset-2"
                  >
                    More appetizers →
                  </Link>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200 shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
                    alt="Vietnamese spring rolls"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                </div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200 shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
                    alt="Chicken wings"
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
                    src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
                    alt="Vietnamese Pho"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                </div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200 shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
                    alt="Banh Mi"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                </div>
              </div>
              <div className="order-2 flex flex-col">
                <div className="space-y-4">
                  {MAIN_COURSES.map((item, i) => (
                    <MenuItemRow key={i} {...item} />
                  ))}
                </div>
                <div className="mt-8 flex justify-center lg:justify-start">
                  <Link
                    href="/menu"
                    className="inline-flex items-center rounded-lg border-2 border-stone-900 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-stone-600 focus:ring-offset-2"
                  >
                    More main courses →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
