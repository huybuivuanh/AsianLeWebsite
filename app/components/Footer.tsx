import Link from "next/link";

const FOOTER = {
  name: "Asian Le Restaurant",
  address: {
    line1: "Unit #3, 1400 6 Ave E",
    city: "Prince Albert, SK S6V 2K2",
  },
  phone: "(306) 764-7799",
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-800 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold text-white hover:text-amber-200"
            >
              {FOOTER.name}
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-stone-500">
              Address
            </p>
            <address className="mt-2 not-italic text-stone-300">
              {FOOTER.address.line1}
              <br />
              {FOOTER.address.city}
            </address>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-stone-500">
              Phone
            </p>
            <a
              href={`tel:${FOOTER.phone.replace(/\D/g, "")}`}
              className="mt-2 block text-stone-300 hover:text-amber-200"
            >
              {FOOTER.phone}
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-800 pt-8 text-center text-sm text-stone-500">
          <p>
            © {year} {FOOTER.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
