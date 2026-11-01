import Image from "next/image";

const POINTS = [
  { title: "Fresh ingredients", text: "Locally sourced and high quality." },
  { title: "Authentic recipes", text: "Traditional Chinese and Vietnamese." },
  { title: "Warm hospitality", text: "Family dinners or a quick lunch." },
];

export default function KitchenSection() {
  return (
    <section className="bg-ink text-on-ink">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 px-4 py-20 sm:px-6 md:py-24 lg:flex-row lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">Our kitchen</p>
          <h2 className="mt-3 text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Delicious <span className="font-accent font-normal italic text-gold">ingredients</span>,
            cooked to order
          </h2>
          <p className="mt-5 leading-relaxed text-on-ink-muted">
            From pantry staples to market-fresh produce, we focus on ingredients that bring every
            dish to life — each plate cooked to order for bold, fresh flavors you&apos;ll remember.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {POINTS.map((point) => (
              <li key={point.title} className="border-t border-ink-line pt-4">
                <p className="font-extrabold">{point.title}</p>
                <p className="mt-1 text-sm text-on-ink-muted">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid w-full min-w-0 flex-1 grid-cols-2 gap-4">
          <div className="relative h-56 overflow-hidden rounded-3xl bg-ink-raised sm:h-64">
            <Image src="/home/discover/Chow Mein.png" alt="Chow mein" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
          </div>
          <div className="relative mt-10 h-56 overflow-hidden rounded-3xl bg-ink-raised sm:h-64">
            <Image src="/home/discover/Fried Rice.png" alt="Chicken fried rice" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
