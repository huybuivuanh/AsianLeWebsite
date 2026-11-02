/**
 * Asian Le Rewards settings (the separate asian-le-rewards Firebase project). Safe on the
 * server and in the browser — it only reads public NEXT_PUBLIC_* values, so server
 * components can check `rewardsEnabled` without loading the Firebase SDK.
 * Optional: without the NEXT_PUBLIC_REWARDS_* config the rewards feature is hidden.
 */

// Each variable is read by its full name so Next.js can inline it at build time.
export const REWARDS_FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_REWARDS_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_REWARDS_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_REWARDS_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_REWARDS_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_REWARDS_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_REWARDS_APP_ID,
};

export const REWARDS_PROJECT_ID = REWARDS_FIREBASE_CONFIG.projectId ?? "";

export const rewardsEnabled = Boolean(
  REWARDS_FIREBASE_CONFIG.apiKey && REWARDS_FIREBASE_CONFIG.authDomain && REWARDS_PROJECT_ID,
);

/** Where customers create an account / see their points (the rewards web app). */
export const REWARDS_APP_URL =
  process.env.NEXT_PUBLIC_REWARDS_APP_URL ?? "https://rewards.asianle.ca";
