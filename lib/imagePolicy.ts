/**
 * Firebase Storage URLs are high-cardinality (every menu/gallery image = unique path).
 * Passing them through Vercel Image Optimization burns transformation quota quickly.
 * Local `/public` assets stay optimized (few files, shared cache).
 */
export function skipNextImageOptimization(src: unknown): boolean {
  return (
    typeof src === "string" &&
    /^https?:\/\/firebasestorage\.googleapis\.com\//i.test(src)
  );
}
