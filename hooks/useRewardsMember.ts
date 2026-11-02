import { useCallback, useEffect, useState } from "react";
import {
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
  signOutRewards,
  subscribeToRewardsSession,
  type RewardsSession,
} from "@/lib/rewardsClient";
import { rewardsEnabled } from "@/lib/rewardsConfig";

const INITIAL_SESSION: RewardsSession = {
  status: rewardsEnabled ? "loading" : "disabled",
  user: null,
  member: null,
};

/**
 * Rewards sign-in for checkout: the signed-in member (live), and sign-in/out actions
 * (each returns an error message, or null on success). See lib/rewardsClient.ts.
 */
export function useRewardsMember() {
  const [session, setSession] = useState<RewardsSession>(INITIAL_SESSION);

  useEffect(() => {
    if (!rewardsEnabled) return;
    return subscribeToRewardsSession(setSession);
  }, []);

  const { status, user, member } = session;
  const isMember = status === "member" && member != null;

  /** A fresh sign-in token for the API routes, or null if no member is signed in. */
  const getIdToken = useCallback(
    async (): Promise<string | null> => (isMember && user ? user.getIdToken() : null),
    [isMember, user],
  );

  return {
    status,
    /** Set only when status is "member". */
    member: isMember ? member : null,
    getIdToken,
    signInWithEmail,
    signInWithGoogle,
    resetPassword,
    signOut: signOutRewards,
  };
}

export type RewardsMemberState = ReturnType<typeof useRewardsMember>;
