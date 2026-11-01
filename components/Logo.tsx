import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  /** "md" for the nav, "sm" for the footer. */
  size?: "md" | "sm";
};

/** "ASIAN [Vietnam map] LE" — the map is the logo mark (public/logo.png). */
export default function Logo({ size = "md" }: LogoProps) {
  const text = size === "md" ? "text-xl sm:text-2xl" : "text-lg";
  const mark = size === "md" ? "h-10 w-7 sm:h-11 sm:w-8" : "h-8 w-6";

  return (
    <Link
      href="/"
      className="group flex items-center gap-1 rounded-md text-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      aria-label="Asian Le Restaurant – Home"
    >
      <span className={`${text} font-extrabold tracking-wide transition group-hover:text-gold`}>
        ASIAN
      </span>
      <span className={`relative shrink-0 ${mark}`}>
        <Image src="/logo.png" alt="" fill className="object-contain" sizes="40px" unoptimized />
      </span>
      <span className={`${text} font-extrabold tracking-wide transition group-hover:text-gold`}>
        LE
      </span>
    </Link>
  );
}
