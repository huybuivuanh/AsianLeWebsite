import "server-only";
import { NextResponse } from "next/server";
import type { ApiError } from "@/lib/orderApi";

/** Shared response helpers for the API routes. */

export function jsonError(message: string, status = 400) {
  return NextResponse.json<ApiError>({ error: message }, { status });
}

/** The request's JSON body if it's an object, otherwise null (bad JSON, array, etc.). */
export async function readJsonObject<T extends object>(request: Request): Promise<T | null> {
  try {
    const body: unknown = await request.json();
    return body !== null && typeof body === "object" && !Array.isArray(body) ? (body as T) : null;
  } catch {
    return null;
  }
}
