"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const SECTION_LINKS = [
  { id: "welcome", label: "Welcome" },
  { id: "daily-special", label: "Daily Special" },
  { id: "news-updates", label: "Updates" },
  { id: "open-hours", label: "Hours" },
  { id: "experience", label: "Experience" },
  { id: "discover-menu", label: "Menu Highlights" },
  { id: "testimonials", label: "Testimonials" },
  { id: "our-location", label: "Location" },
] as const;

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function NavLinks({
  onLinkClick,
  linkClassName,
}: {
  onLinkClick?: () => void;
  linkClassName: string;
}) {
  return (
    <>
      {SECTION_LINKS.map(({ id, label }, i) => (
        <li key={id}>
          <a
            href={`#${id}`}
            onClick={(e) => {
              scrollToSection(e, id);
              onLinkClick?.();
            }}
            className={linkClassName}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-700">
              {i + 1}
            </span>
            <span className="truncate">{label}</span>
          </a>
        </li>
      ))}
    </>
  );
}

export default function HomeSectionNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname !== "/") return null;

  return (
    <>
      {/* Desktop: fixed right sidebar */}
      <nav
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
        aria-label="Page sections"
      >
        <div className="relative overflow-hidden rounded-l-2xl border-y border-l border-stone-200/80 bg-white/90 py-4 pl-4 pr-4 shadow-[0_0_24px_-4px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <div
            className="absolute left-0 top-0 h-full w-1 rounded-l-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600"
            aria-hidden
          />
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
            On this page
          </p>
          <ul className="flex flex-col gap-0.5">
            <NavLinks linkClassName="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-amber-50 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-inset" />
          </ul>
        </div>
      </nav>

      {/* Mobile: floating button + dropdown */}
      <div
        className="fixed bottom-6 right-6 z-40 lg:hidden"
        aria-label="Page sections"
      >
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-200/80 bg-white/95 shadow-lg backdrop-blur-md transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          aria-expanded={mobileOpen}
          aria-haspopup="true"
        >
          <svg
            className={`h-6 w-6 text-amber-600 transition-transform ${mobileOpen ? "rotate-90" : ""}`}
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
        </button>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-[2px]"
              aria-hidden
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute bottom-full right-0 z-50 mb-2 w-56 rounded-2xl border border-stone-200/80 bg-white/95 py-3 pl-3 pr-2 shadow-xl backdrop-blur-md">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
                Jump to section
              </p>
              <ul className="max-h-[60vh] overflow-y-auto">
                <NavLinks
                  onLinkClick={() => setMobileOpen(false)}
                  linkClassName="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-amber-50 hover:text-amber-800"
                />
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
}
