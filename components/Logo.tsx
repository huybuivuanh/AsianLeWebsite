import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-0 focus:outline-none"
      aria-label="Asian Le Restaurant – Home"
    >
      <span className="-mr-1 text-lg font-semibold font-serif uppercase tracking-tight text-white transition group-hover:text-amber-100 sm:text-xl">
        Asian
      </span>
      <div className="relative -mx-1 h-11 w-11 shrink-0 overflow-hidden sm:h-12 sm:w-12">
        <Image
          src="/logo.png"
          alt=""
          fill
          className="object-contain"
          sizes="60px"
          unoptimized
        />
      </div>
      <span className="-ml-1 text-lg font-semibold font-serif uppercase tracking-tight text-white transition group-hover:text-amber-100 sm:text-xl">
        Le
      </span>
    </Link>
  );
}
