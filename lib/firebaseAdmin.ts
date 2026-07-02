import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Trusted server-only Firestore access (bypasses security rules) — used for
 * writes that must not be reachable via the public client SDK, e.g. orders.
 * Never import this from a Client Component.
 */

function getAdminApp() {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  const raw = process.env.SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "Missing Firebase Admin credentials — set SERVICE_ACCOUNT_KEY to the service account JSON (Firebase Console → Project Settings → Service Accounts → Generate new private key).",
    );
  }

  let serviceAccount: object;
  try {
    serviceAccount = JSON.parse(raw);
  } catch {
    throw new Error("SERVICE_ACCOUNT_KEY is not valid JSON.");
  }

  // cert() accepts either snake_case (raw downloaded JSON) or camelCase keys — no remapping needed.
  return initializeApp({ credential: cert(serviceAccount) });
}

export const adminDb = getFirestore(getAdminApp());
