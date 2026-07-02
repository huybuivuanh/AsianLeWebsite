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

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials — set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
    );
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export const adminDb = getFirestore(getAdminApp());
