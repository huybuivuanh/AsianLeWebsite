import { Cormorant_Garamond } from "next/font/google";

/** Italic serif for Vietnamese lines. The site's accent serif (Instrument Serif) lacks
 * Vietnamese letters like ừ and ổ. Imported only where used, so other pages skip it. */
export const vietnameseSerif = Cormorant_Garamond({
  subsets: ["vietnamese"],
  weight: "500",
  style: "italic",
  display: "swap",
});
