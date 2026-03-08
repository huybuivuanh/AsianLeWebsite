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
    <div className="flex gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-stone-200">
        <Image src={image} alt="" fill className="object-cover" sizes="80px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-stone-900">
          {name.toUpperCase()}
          {priceText && (
            <span className="font-normal text-stone-600">{priceText}</span>
          )}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-stone-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function DiscoverMenuSection() {
  return (
    <section className="border-t border-stone-200 bg-stone-50 py-16 md:py-24">
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-700">
            Discover
          </p>
          <h2 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            Our Menu
          </h2>
          <p className="mt-6 leading-relaxed text-stone-600">
            Explore texture, color and the ultimate tastes with our seasonal
            menu. All ingredients are fresh and carefully selected by our chefs.
            Enjoy an extraordinary dining experience.
          </p>
        </div>

        {/* Appetizer */}
        <div className="mt-14">
          <p className="text-sm font-medium uppercase tracking-widest text-stone-600">
            Our Menu
          </p>
          <h3 className="mt-1 border-b-4 border-double border-stone-300 pb-2 text-2xl font-bold uppercase tracking-wide text-stone-900 md:text-3xl">
            Appetizer
          </h3>
          <p className="mt-4 max-w-2xl text-stone-600">{MENU_INTRO}</p>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start md:gap-16">
            <div className="flex flex-col">
              <div className="space-y-8">
                {APPETIZERS.map((item, i) => (
                  <MenuItemRow key={i} {...item} />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/menu"
                  className="inline-block rounded-md border-2 border-stone-900 px-6 py-2.5 text-sm font-semibold uppercase text-stone-700 transition hover:bg-stone-900 hover:text-white"
                >
                  More Menu
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
                  alt="Vietnamese spring rolls"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
                  alt="Chicken wings"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Courses */}
        <div className="mt-20">
          <p className="text-sm font-medium uppercase tracking-widest text-stone-600">
            Our Menu
          </p>
          <h3 className="mt-1 border-b-4 border-double border-stone-300 pb-2 text-2xl font-bold uppercase tracking-wide text-stone-900 md:text-3xl">
            Main Courses
          </h3>
          <p className="mt-4 max-w-2xl text-stone-600">{MENU_INTRO}</p>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start md:gap-16">
            <div className="flex flex-col gap-6 md:order-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
                  alt="Vietnamese Pho"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80"
                  alt="Banh Mi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="flex flex-col md:order-2">
              <div className="space-y-8">
                {MAIN_COURSES.map((item, i) => (
                  <MenuItemRow key={i} {...item} />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/menu"
                  className="inline-block rounded-md border-2 border-stone-900 px-6 py-2.5 text-sm font-semibold uppercase text-stone-700 transition hover:bg-stone-900 hover:text-white"
                >
                  More Menu
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/menu"
            className="inline-block rounded-md bg-stone-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-600 focus:ring-offset-2"
          >
            View Our Menu
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
