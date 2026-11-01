"use client";

import { useState } from "react";
import Link from "next/link";
import OrderDropdown from "@/components/OrderDropdown";
import { usePathname } from "next/navigation";
import { STORE } from "@/lib/store";
import Logo from "./Logo";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact" },
];

const telHref = `tel:${STORE.phone.replace(/\D/g, "")}`;

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-line bg-ink/95 text-on-ink backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Logo />

        {/* Desktop */}
        <div className="hidden items-center gap-7 lg:flex">
          <ul className="flex items-center gap-7 text-[15px] font-medium">
            {menuLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-md py-2 transition hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${isActive ? "text-gold" : "text-on-ink"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2.5">
            <a
              href={telHref}
              aria-label={`Call us at ${STORE.phone}`}
              className="inline-flex min-h-11 items-center rounded-full border border-gold px-5 text-[15px] font-bold text-gold transition hover:bg-gold hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Call Us
            </a>
            <OrderDropdown className="inline-flex gap-1.5 min-h-11 items-center rounded-full bg-on-ink px-5 text-[15px] font-bold text-ink transition hover:bg-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
              Order online
            </OrderDropdown>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={telHref}
            aria-label={`Call us at ${STORE.phone}`}
            className="inline-flex min-h-11 items-center rounded-full border border-gold px-4 text-sm font-bold text-gold"
          >
            Call
          </a>
          <OrderDropdown onChoose={() => setMobileOpen(false)} className="inline-flex gap-1 min-h-11 items-center rounded-full bg-on-ink px-4 text-sm font-bold text-ink">
            Order
          </OrderDropdown>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-on-ink transition hover:bg-ink-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">
              {mobileOpen ? "Close menu" : "Open menu"}
            </span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-200 ease-out lg:hidden ${mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <div className="overflow-hidden">
          <div className="border-t border-ink-line px-4 pb-6 pt-3">
            <ul>
              {menuLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-xl px-3 py-3.5 text-base font-semibold transition hover:bg-ink-raised ${isActive ? "text-gold" : "text-on-ink"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <a
              href={telHref}
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-ink-line text-base font-semibold text-gold"
            >
              Call {STORE.phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
