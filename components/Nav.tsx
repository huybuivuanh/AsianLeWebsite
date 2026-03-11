"use client";

import { useState } from "react";
import Link from "next/link";
import { STORE } from "@/lib/store";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-800/80 bg-stone-900/95 text-stone-100 shadow-lg backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900"
        >
          <span className="hidden h-8 w-0.5 rounded-full bg-amber-500 sm:block" aria-hidden />
          <span className="text-lg font-semibold tracking-tight text-white transition group-hover:text-amber-100 sm:text-xl">
            Asian Le Restaurant
          </span>
        </Link>

        {/* Desktop: links + CTA */}
        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center gap-0.5">
            {menuLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative block px-4 py-2.5 text-sm font-medium text-stone-300 transition hover:text-amber-200"
                >
                  <span className="relative inline-block">
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber-400 transition-[width] duration-200 group-hover:w-full" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="ml-2 h-6 w-px bg-stone-600" aria-hidden />
          <a
            href={`tel:${STORE.phone.replace(/\D/g, "")}`}
            className="ml-2 inline-flex items-center rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 hover:shadow-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900"
          >
            Call to book
          </a>
        </div>

        {/* Mobile: menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={`tel:${STORE.phone.replace(/\D/g, "")}`}
            className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900"
          >
            Call
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-300 transition hover:bg-stone-800 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-stone-900"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-200 ease-out md:hidden ${mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        aria-hidden={!mobileOpen}
      >
        <div className="overflow-hidden">
          <div className="border-t border-stone-800 bg-stone-900/98 backdrop-blur-md">
            <ul className="px-4 py-4">
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg py-3.5 pl-3 text-base font-medium text-stone-200 transition hover:bg-stone-800 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-stone-800 px-4 pb-6 pt-2">
              <a
                href={`tel:${STORE.phone.replace(/\D/g, "")}`}
                className="flex w-full items-center justify-center rounded-xl bg-amber-500 py-3.5 text-base font-semibold text-stone-900 shadow-md transition hover:bg-amber-400"
                onClick={() => setMobileOpen(false)}
              >
                Call to book — {STORE.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
