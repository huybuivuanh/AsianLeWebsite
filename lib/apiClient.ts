import type { ApiError } from "@/lib/orderApi";

/** Result of calling one of this site's API routes from the browser. `error` is the
 * route's message for the customer, or null if it didn't send one. */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string | null };

/** POSTs JSON to one of this site's API routes. Throws only if the request itself fails
 * (no connection). */
export async function postJson<TResponse>(url: string, body?: unknown): Promise<ApiResult<TResponse>> {
  const res = await fetch(url, {
    method: "POST",
    ...(body === undefined
      ? {}
      : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  });
  const data: unknown = await res.json().catch(() => null);
  if (res.ok) return { ok: true, data: data as TResponse };
  const error = (data as Partial<ApiError> | null)?.error;
  return { ok: false, error: typeof error === "string" ? error : null };
}
