import PageContainer from "../PageContainer";

const HIGHLIGHTS = [
  {
    title: "Fresh ingredients",
    description:
      "We use locally sourced, high-quality ingredients to bring you authentic flavours in every dish.",
  },
  {
    title: "Authentic recipes",
    description:
      "Traditional Chinese and Vietnamese recipes passed down and prepared with care by our kitchen.",
  },
  {
    title: "Warm hospitality",
    description:
      "A welcoming atmosphere for family dinners, quick lunches, and everything in between.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="border-t border-stone-800 bg-stone-900 py-16 text-stone-100 md:py-24">
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-300">
            Why dine with us
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            What we offer
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
          {HIGHLIGHTS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-stone-700 bg-stone-800/80 p-6 text-center transition hover:border-amber-500/50 hover:bg-stone-800"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                {i === 0 ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : i === 1 ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
