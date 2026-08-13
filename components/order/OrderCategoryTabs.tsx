"use client";

import { useEffect, useRef, useState } from "react";

export type CategoryTab = { id: string; label: string };

/** Sticky horizontal category tab bar for /order — scrolls to the matching section and
 * highlights whichever section is currently in view via IntersectionObserver. Sits below
 * the site's own sticky Nav (components/Nav.tsx, ~76px tall). */
export default function OrderCategoryTabs({ tabs }: { tabs: CategoryTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiveId(topMost.target.id);
      },
      // Counts a section as "current" once it's scrolled just under the sticky
      // header+tabs stack, and stops counting near the bottom of the viewport.
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [tabs]);

  useEffect(() => {
    tabRefs.current[activeId]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeId]);

  if (tabs.length <= 1) return null;

  return (
    <div className="sticky top-20 z-30 border-b border-stone-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            href={`#${tab.id}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(tab.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeId === tab.id
                ? "bg-amber-500 text-stone-900"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>
    </div>
  );
}
