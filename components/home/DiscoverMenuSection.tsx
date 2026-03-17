import Image from "next/image";
import PageContainer from "../PageContainer";

const MENU_INTRO =
  "We invite you to celebrate our restaurant's delicious recipes whether you are here for a business lunch or dinner. Discover new tastes and inspired recipes from all over the world.";

const APPETIZERS = [
  {
    name: "Vietnamese Spring Rolls",
    description:
      "Crispy rolls filled with seasoned pork and vegetables, served with our house fish-sauce dipping vinaigrette.",
    image: "/home/discover/Spring Rolls.png",
  },
  {
    name: "Vietnamese Salad Rolls",
    description:
      "Fresh rice-paper rolls filled with rice noodles, crisp lettuce, and shrimp, served with our creamy peanut dipping sauce.",
    image: "/home/discover/Salad Rolls.jpg",
  },
  {
    name: "Boneless Dry Ribs",
    description:
      "Tender pork bites, lightly breaded and deep-fried until golden and crisp.",
    image: "/home/discover/Dry Ribs.jpg",
  },
  {
    name: "Deep Fried Shrimps",
    description:
      "Lightly battered shrimp, fried to a crisp and served with sweet & sour sauce.",
    image: "/home/discover/Shrimps.jpg",
  },
  {
    name: "Chicken Balls",
    description: "Crispy chicken balls served with classic sweet & sour sauce.",
    image: "/home/discover/Chicken Balls.jpg",
  },
  {
    name: "Deluxe Wonton Soup",
    description:
      "A comforting, savory broth with tender wontons, shrimp, pork, and garden vegetables.",
    image: "/home/discover/Wonton Soup.png",
  },
];

const MAIN_COURSES = [
  {
    name: "Vermicelli Combo",
    description:
      "Rice vermicelli with lettuce, cucumber, and bean sprouts, topped with a mix of chicken, beef, pork, shrimp, plus a spring roll. Finished with fish sauce and crushed peanuts.",
    image: "/home/discover/Vermicelli Combo.jpg",
  },
  {
    name: "Special Bird Nest",
    description:
      "Crispy egg noodles topped with a savory mix of chicken, beef, pork, and shrimp.",
    image: "/home/discover/Special Bnest.jpg",
  },
  {
    name: "Dinner For One",
    description:
      "A satisfying combo of an egg roll or spring roll, chicken fried rice, and boneless dry ribs.",
    image: "/home/discover/DN1B.png",
  },
  {
    name: "Butter Garlic Fried Shrimps",
    description:
      "Lightly battered shrimp, fried crisp and tossed in rich butter-garlic sauce.",
    image: "/home/discover/Butter Shrimps.jpg",
  },
  {
    name: "Chicken Fried Rice",
    description:
      "Our signature fried rice, wok-tossed with eggs, carrots, and tender chicken.",
    image: "/home/discover/Fried Rice.png",
  },
  {
    name: "Singapore Noodles",
    description:
      "Stir-fried noodles tossed with curry seasoning, mixed vegetables, bean sprouts, and a combination of chicken, beef, pork, and shrimp.",
    image: "/home/discover/Singapore Noodles.jpg",
  },
];

function MenuItemRow({
  name,
  description,
  image,
}: {
  name: string;
  description: string;
  image: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-stone-200/80 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:shadow-md">
      <div className="relative h-20 w-25 shrink-0 overflow-hidden rounded-lg bg-stone-200">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-stone-900">{name}</p>
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
                    <MenuItemRow key={i} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
