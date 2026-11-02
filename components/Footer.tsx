import Logo from "./Logo";
import { STORE } from "@/lib/store";

const SOCIAL_LINKS = [
  { href: STORE.socialLinks.googleReview, label: "Review us on Google" },
  { href: STORE.socialLinks.facebook, label: "Facebook" },
  { href: STORE.socialLinks.skipthedishes, label: "SkipTheDishes" },
  { href: STORE.socialLinks.tripadvisor, label: "Tripadvisor" },
  { href: STORE.socialLinks.yelp, label: "Yelp" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-line bg-ink text-on-ink-muted">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-11 text-sm sm:px-6 lg:px-8">
        <div>
          <Logo size="sm" />
          <p className="mt-2">
            {STORE.address.line1} · {STORE.address.city} ·{" "}
            <a
              href={`tel:${STORE.phone.replace(/\D/g, "")}`}
              className="text-on-ink transition hover:text-gold"
            >
              {STORE.phone}
            </a>
          </p>
          <p className="mt-1">
            © {year} {STORE.name}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-ink transition hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
