"use client";

import { useState, type KeyboardEvent, type SyntheticEvent } from "react";
import { GoogleIcon } from "@/components/contact/ContactIcons";
import { rewardsInputClass, rewardsLinkClass } from "@/components/checkout/rewards/styles";
import type { RewardsMemberState } from "@/hooks/useRewardsMember";
import { REWARDS_APP_URL } from "@/lib/rewardsConfig";

type SignInFormProps = Pick<RewardsMemberState, "signInWithEmail" | "signInWithGoogle" | "resetPassword">;

/**
 * Rewards sign-in: Google, or email + password, plus "forgot password" and a link to join.
 * Not a nested <form> (invalid HTML inside the checkout form) — a div with its own handlers.
 */
export default function SignInForm({ signInWithEmail, signInWithGoogle, resetPassword }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  /** Runs a sign-in action, showing its error message, or `success` if it worked. */
  async function run(action: () => Promise<string | null>, success?: string) {
    setBusy(true);
    setError(null);
    setNotice(null);
    const message = await action();
    setBusy(false);
    if (message) setError(message);
    else if (success) setNotice(success);
  }

  function handleSignIn(e: SyntheticEvent) {
    // This box sits inside the checkout <form> — don't submit the order.
    e.preventDefault();
    e.stopPropagation();
    if (!email || !password || busy) return;
    void run(() => signInWithEmail(email, password));
  }

  // Enter in these fields signs in to rewards instead of placing the order.
  function onEnter(e: KeyboardEvent) {
    if (e.key === "Enter") handleSignIn(e);
  }

  function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first.");
      return;
    }
    void run(() => resetPassword(email), "Check your email for a link to reset your password.");
  }

  return (
    <div className="mt-4 space-y-3">
      <button
        type="button"
        onClick={() => void run(signInWithGoogle)}
        disabled={busy}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-sand-line bg-white px-4 text-sm font-bold text-ink transition hover:border-ink disabled:opacity-60"
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </button>
      <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted">or</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onEnter}
            autoComplete="email"
            className={rewardsInputClass}
          />
        </label>
        <label className="block text-sm font-bold">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onEnter}
            autoComplete="current-password"
            className={rewardsInputClass}
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleSignIn}
          disabled={busy || !email || !password}
          className="inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-sm font-bold text-on-ink transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-muted hover:text-ink hover:underline"
          >
            Forgot password?
          </button>
          <a href={REWARDS_APP_URL} target="_blank" rel="noreferrer" className={rewardsLinkClass}>
            Not a member? Join
          </a>
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-sm font-bold text-brand">
          {error}
        </p>
      ) : null}
      {notice ? <p className="text-sm font-bold text-success">{notice}</p> : null}
    </div>
  );
}
