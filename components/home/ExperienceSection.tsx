import Image from "next/image";
import PageContainer from "../PageContainer";

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="scroll-mt-28 bg-stone-900 py-16 text-stone-100 md:py-24"
    >
      <PageContainer>
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-800">
            <Image
              src="/home/Ingredients.jpg"
              alt="Fresh ingredients and Asian dishes"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-amber-300">
              Experience
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Delicious ingredients
            </h2>
            <p className="mt-6 leading-relaxed text-stone-300">
              From pantry staples to vibrant market-fresh produce, we focus on
              ingredients that bring every dish to life. Guided by our chefs,
              each plate is cooked to order for bold, fresh flavors you’ll
              remember.
            </p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
