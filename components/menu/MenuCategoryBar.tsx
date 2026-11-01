"use client";

import { useEffect, useRef, useState } from "react";

export type CategoryLink = { id: string; label: string };

type MenuCategoryBarProps = {
  links: CategoryLink[];
};

/** Sticky strip under the nav: one chip per menu section, highlighted while you're in it.
 * Replaces the floating "Jump to menu" button. */
export default function MenuCategoryBar({ links }: MenuCategoryBarProps) {
  const [activeId, setActiveId] = useState(links[0]?.id ?? "");
  const chipRefs = useRef(new Map<string, HTMLAnchorElement>());

  // Highlight the section nearest the top of the screen.
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el != null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [links]);

  // Keep the active chip in view in the horizontal strip.
  useEffect(() => {
    chipRefs.current.get(activeId)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  if (links.length === 0) return null;

  return (
    <div className="sticky top-16 z-30 border-b border-sand-line bg-ivory/95 backdrop-blur sm:top-[68px]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <nav aria-label="Menu sections" className="min-w-0 flex-1">
          <ul className="flex gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((link) => {
              const active = link.id === activeId;
              return (
                <li key={link.id}>
                  <a
                    ref={(el) => {
                      if (el) chipRefs.current.set(link.id, el);
                      else chipRefs.current.delete(link.id);
                    }}
                    href={`#${link.id}`}
                    aria-current={active ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setActiveId(link.id);
                    }}
                    className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${active ? "bg-ink text-on-ink" : "border border-sand-line bg-white text-ink hover:border-ink"}`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
