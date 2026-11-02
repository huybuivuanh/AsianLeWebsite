import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { REWARDS_FIREBASE_CONFIG, rewardsEnabled } from "@/lib/rewardsConfig";

/**
 * Second Firebase connection, to the separate Asian Le Rewards project (see the
 * asian-le-rewards repo). Only used in the browser, for the optional rewards sign-in at
 * checkout (see lib/rewardsClient.ts).
 */

const APP_NAME = "rewards";

let app: FirebaseApp | null = null;

function rewardsApp(): FirebaseApp {
  if (!rewardsEnabled) throw new Error("Rewards Firebase config is missing.");
  if (!app) {
    app = getApps().some((a) => a.name === APP_NAME)
      ? getApp(APP_NAME)
      : initializeApp(REWARDS_FIREBASE_CONFIG, APP_NAME);
  }
  return app;
}

export const getRewardsAuth = (): Auth => getAuth(rewardsApp());
export const getRewardsDb = (): Firestore => getFirestore(rewardsApp());
