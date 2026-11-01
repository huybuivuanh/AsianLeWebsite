import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  getRewardsAuth,
  getRewardsDb,
  rewardsEnabled,
  type RewardsMember,
} from "@/lib/rewardsFirebase";

export type RewardsStatus =
  | "disabled" // no rewards config — hide the feature
  | "loading"
  | "signed-out"
  | "no-profile" // signed in, but never finished sign-up in the rewards app
  | "member";

const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/user-not-found": "No account found for this email.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-email": "Enter your email address.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "No internet connection. Check your connection and try again.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups and try again.",
  "auth/account-exists-with-different-credential":
    "This email already has an account. Sign in with your email and password.",
};

function authErrorMessage(error: unknown, fallback: string): string {
  const code = (error as { code?: unknown })?.code;
  return typeof code === "string" && AUTH_ERRORS[code] ? AUTH_ERRORS[code] : fallback;
}

/** Ignore the user closing the Google window themselves. */
function isPopupClosed(error: unknown): boolean {
  const code = (error as { code?: unknown })?.code;
  return code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request";
}

/**
 * Rewards sign-in for checkout: the signed-in rewards user and their live member doc
 * (members/{uid} — rules let members read their own), plus sign-in/out actions.
 */
export function useRewardsMember() {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<RewardsMember | null>(null);
  const [status, setStatus] = useState<RewardsStatus>(rewardsEnabled ? "loading" : "disabled");

  useEffect(() => {
    if (!rewardsEnabled) return;
    let unsubMember: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(getRewardsAuth(), (nextUser) => {
      unsubMember?.();
      unsubMember = null;
      setUser(nextUser);
      setMember(null);
      if (!nextUser) {
        setStatus("signed-out");
        return;
      }
      setStatus("loading");
      unsubMember = onSnapshot(
        doc(getRewardsDb(), "members", nextUser.uid),
        (snap) => {
          if (!snap.exists()) {
            setStatus("no-profile");
            return;
          }
          const d = snap.data();
          setMember({
            id: snap.id,
            name: typeof d.name === "string" ? d.name : "",
            email: typeof d.email === "string" ? d.email : nextUser.email ?? "",
            phone: typeof d.phone === "string" ? d.phone : "",
            points: typeof d.points === "number" ? d.points : 0,
            hasFirstOrder: d.firstOrderId != null,
          });
          setStatus("member");
        },
        () => setStatus("no-profile"),
      );
    });

    return () => {
      unsubMember?.();
      unsubAuth();
    };
  }, []);

  /** Each returns an error message, or null on success. */
  async function signInWithEmail(email: string, password: string): Promise<string | null> {
    try {
      await signInWithEmailAndPassword(getRewardsAuth(), email.trim(), password);
      return null;
    } catch (error) {
      return authErrorMessage(error, "Couldn't sign in. Please try again.");
    }
  }

  async function signInWithGoogle(): Promise<string | null> {
    try {
      await signInWithPopup(getRewardsAuth(), new GoogleAuthProvider());
      return null;
    } catch (error) {
      if (isPopupClosed(error)) return null;
      return authErrorMessage(error, "Couldn't sign in with Google. Please try again.");
    }
  }

  async function resetPassword(email: string): Promise<string | null> {
    try {
      await sendPasswordResetEmail(getRewardsAuth(), email.trim());
      return null;
    } catch (error) {
      return authErrorMessage(error, "Couldn't send the reset email. Please try again.");
    }
  }

  async function signOutRewards() {
    await signOut(getRewardsAuth());
  }

  /** What /api/orders needs to link the member, or null if no member is signed in. */
  async function getOrderRewardsFields(): Promise<{
    rewardsIdToken: string;
    rewardsMemberName: string;
  } | null> {
    if (status !== "member" || !user || !member) return null;
    return { rewardsIdToken: await user.getIdToken(), rewardsMemberName: member.name };
  }

  return {
    status,
    member,
    signInWithEmail,
    signInWithGoogle,
    resetPassword,
    signOutRewards,
    getOrderRewardsFields,
  };
}

export type RewardsMemberState = ReturnType<typeof useRewardsMember>;
