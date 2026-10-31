import "server-only";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/**
 * Verifies a sign-in token from the rewards project (asian-le-rewards), so an order can be
 * linked to a member without trusting the browser. Checking a token only needs the
 * project id (Google's public keys do the rest) — no rewards service account here.
 */

const APP_NAME = "rewards";

function rewardsAdminApp() {
  const existing = getApps().find((a) => a.name === APP_NAME);
  if (existing) return existing;
  const projectId = process.env.NEXT_PUBLIC_REWARDS_PROJECT_ID;
  if (!projectId) throw new Error("NEXT_PUBLIC_REWARDS_PROJECT_ID is not set.");
  return initializeApp({ projectId }, APP_NAME);
}

/** The member's uid (= members/{uid} id) if the token is valid, otherwise null. */
export async function verifyRewardsIdToken(idToken: string): Promise<string | null> {
  try {
    const decoded = await getAuth(rewardsAdminApp()).verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    return null;
  }
}
