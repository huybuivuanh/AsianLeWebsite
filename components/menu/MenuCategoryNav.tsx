"use client";

import { useState } from "react";

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export type CategoryLink = { id: string; label: string };

type MenuCategoryNavProps = {
  /** Category links from the server (menu page fetches and passes these). */
  serverCategoryLinks: CategoryLink[];
};

export default function MenuCategoryNav({
  serverCategoryLinks,
}: MenuCategoryNavProps) {
  const [open, setOpen] = useState(false);

  if (serverCategoryLinks.length <= 1) return null;

  const categoryLinks = serverCategoryLinks;

  const linkBase =
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-inset";

  return (
    <nav
      className="fixed bottom-6 right-6 z-40"
      aria-label="Menu categories"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border-2 border-amber-400 bg-amber-50 px-4 py-3 shadow-lg shadow-amber-900/15 ring-2 ring-amber-400/30 transition hover:bg-amber-100 hover:shadow-xl hover:shadow-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:gap-2.5 sm:px-5 sm:py-3"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white sm:h-10 sm:w-10">
          <svg
            className={`h-5 w-5 transition-transform sm:h-5 sm:w-5 ${open ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </span>
        <span className="text-sm font-semibold text-amber-900 sm:text-base">
          Jump to menu
        </span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-[2px]"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full right-0 z-50 mb-2 w-64 max-w-[calc(100vw-3rem)] rounded-2xl border border-stone-200/80 bg-white/95 py-3 pl-3 pr-3 shadow-xl backdrop-blur-md">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
              Jump to category
            </p>
            <ul className="max-h-[min(60vh,24rem)] overflow-y-auto">
              {categoryLinks.map(({ id, label }, i) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      scrollToSection(e, id);
                      setOpen(false);
                    }}
                    className={linkBase}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-700">
                      {i + 1}
                    </span>
                    <span className="min-w-0 break-words">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}
