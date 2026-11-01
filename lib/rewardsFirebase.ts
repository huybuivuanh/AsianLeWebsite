import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Second Firebase connection, to the separate Asian Le Rewards project (see the
 * asian-le-rewards repo). Only used in the browser, for the optional "earn points" sign-in
 * at checkout. Optional: without the NEXT_PUBLIC_REWARDS_* config the feature is hidden.
 */

const APP_NAME = "rewards";

// Each variable is read by its full name so Next.js can inline it at build time.
const config = {
  apiKey: process.env.NEXT_PUBLIC_REWARDS_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_REWARDS_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_REWARDS_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_REWARDS_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_REWARDS_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_REWARDS_APP_ID,
};

export const rewardsEnabled = Boolean(config.apiKey && config.authDomain && config.projectId);

/** Where customers create an account / see their points (the rewards web app). */
export const REWARDS_APP_URL =
  process.env.NEXT_PUBLIC_REWARDS_APP_URL ?? "https://rewards.asianle.ca";

let app: FirebaseApp | null = null;

function rewardsApp(): FirebaseApp {
  if (!rewardsEnabled) throw new Error("Rewards Firebase config is missing.");
  if (!app) {
    app = getApps().some((a) => a.name === APP_NAME)
      ? getApp(APP_NAME)
      : initializeApp(config, APP_NAME);
  }
  return app;
}

export const getRewardsAuth = (): Auth => getAuth(rewardsApp());
export const getRewardsDb = (): Firestore => getFirestore(rewardsApp());

/** members/{uid} in the rewards project — the fields the website reads. */
export type RewardsMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  /** True once a first order has been collected (members/{uid}.firstOrderId) — no welcome bonus left. */
  hasFirstOrder: boolean;
};
