import Image from "next/image";
import Link from "next/link";
import { HIGHLIGHTS } from "@/components/home/discoverMenuData";

/** A few favourites as photo cards, linking to the full menu. */
export default function MenuHighlightsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-brand">Discover</p>
          <h2 className="mt-3 text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Our <span className="font-accent font-normal italic">menu</span>
          </h2>
          <p className="mt-2 text-muted">A few of the dishes guests come back for.</p>
        </div>
        <Link
          href="/menu"
          className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          See our full menu
        </Link>
      </div>

      <ul className="mt-10 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((item) => (
          <li key={item.name}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand-deep">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <p className="mt-3.5 text-xs font-bold uppercase tracking-[0.16em] text-brand">
              {item.category}
            </p>
            <h3 className="mt-1 text-[19px] font-extrabold leading-snug">{item.name}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
