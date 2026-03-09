import Image from "next/image";
import PageContainer from "../components/PageContainer";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80";

const TITLE_BG_IMAGE =
  "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1600&q=80";

const GALLERY_ITEMS = [
  { src: PLACEHOLDER_IMAGE, caption: "Spring Rolls" },
  { src: PLACEHOLDER_IMAGE, caption: "Sizzling Ginger Orange Chicken" },
  { src: PLACEHOLDER_IMAGE, caption: "Loaded Cheese Burger" },
  { src: PLACEHOLDER_IMAGE, caption: "Pad Thai Shrimp" },
  { src: PLACEHOLDER_IMAGE, caption: "Shrimp Salad Rolls" },
  { src: PLACEHOLDER_IMAGE, caption: "Sizzling Ginger Beef" },
  { src: PLACEHOLDER_IMAGE, caption: "Saute Chicken Vermicelli Noodle" },
  { src: PLACEHOLDER_IMAGE, caption: "Sweet & Sour Pork" },
  { src: PLACEHOLDER_IMAGE, caption: "Private Dining" },
  { src: PLACEHOLDER_IMAGE, caption: "Friday Evening" },
  { src: PLACEHOLDER_IMAGE, caption: "Into the Kitchen" },
];

export default function Gallery() {
  return (
    <>
      {/* Title section with background image */}
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
            Gallery
          </h1>
          <p className="mt-4 text-lg text-stone-200 sm:text-xl">
            The most memorable moments are captured
          </p>
        </div>
      </section>

      <PageContainer>
      <div className="py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_ITEMS.map((item, i) => (
          <figure key={i} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-200">
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <figcaption className="mt-3 text-center font-medium text-stone-700">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      </div>
    </PageContainer>
    </>
  );
}
