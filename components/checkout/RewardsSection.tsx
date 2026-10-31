"use client";

import { useState, type KeyboardEvent, type SyntheticEvent } from "react";
import type { RewardsMemberState } from "@/hooks/useRewardsMember";
import { estimatePoints, REWARDS_APP_URL } from "@/lib/rewardsFirebase";

type RewardsSectionProps = {
  rewards: RewardsMemberState;
  subTotal: number;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-900";
const linkClass = "font-semibold text-amber-700 hover:text-amber-800 hover:underline";

/** Optional Asian Le Rewards sign-in at checkout, so the order earns points. */
export default function RewardsSection({ rewards, subTotal }: RewardsSectionProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (rewards.status === "disabled") return null;

  const points = estimatePoints(subTotal);

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
    void run(() => rewards.signInWithEmail(email, password));
  }

  // Enter in these fields signs in to rewards instead of placing the order.
  function onEnter(e: KeyboardEvent) {
    if (e.key === "Enter") handleSignIn(e);
  }

  let body: React.ReactNode;

  if (rewards.status === "loading") {
    body = <p className="mt-2 text-sm text-stone-500">Checking your rewards sign-in…</p>;
  } else if (rewards.status === "member" && rewards.member) {
    body = (
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div className="text-sm text-stone-700">
          <p>
            Signed in as <span className="font-semibold">{rewards.member.name}</span> ·{" "}
            {rewards.member.points} pts
          </p>
          <p className="mt-1 font-semibold text-amber-800">
            This order earns about {points} {points === 1 ? "point" : "points"} when you pick it up.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void rewards.signOutRewards()}
          className="text-sm text-stone-500 hover:text-stone-700 hover:underline"
        >
          Sign out
        </button>
      </div>
    );
  } else if (rewards.status === "no-profile") {
    body = (
      <div className="mt-2 text-sm text-stone-700">
        <p>
          Your rewards account isn&apos;t finished yet. Open the{" "}
          <a href={REWARDS_APP_URL} target="_blank" rel="noreferrer" className={linkClass}>
            Rewards app
          </a>{" "}
          to add your phone number, then come back.
        </p>
        <button
          type="button"
          onClick={() => void rewards.signOutRewards()}
          className="mt-2 text-sm text-stone-500 hover:text-stone-700 hover:underline"
        >
          Sign out
        </button>
      </div>
    );
  } else if (!open) {
    body = (
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-700">
        <p>
          Earn about <span className="font-semibold">{points} points</span> on this order — 100
          points = $5 off.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border-2 border-amber-600 px-4 py-1.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
        >
          Sign in to earn
        </button>
      </div>
    );
  } else {
    body = (
      // Not a nested <form> (invalid HTML inside the checkout form) — a div with its own handler.
      <div className="mt-2 space-y-3">
        <button
          type="button"
          onClick={() => void run(rewards.signInWithGoogle)}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 disabled:opacity-60"
        >
          Continue with Google
        </button>
        <p className="text-center text-xs uppercase tracking-widest text-stone-400">or</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-stone-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onEnter}
              autoComplete="email"
              className={inputClass}
            />
          </label>
          <label className="block text-sm text-stone-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onEnter}
              autoComplete="current-password"
              className={inputClass}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSignIn}
            disabled={busy || !email || !password}
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <button
              type="button"
              onClick={() =>
                email
                  ? void run(
                      () => rewards.resetPassword(email),
                      "Check your email for a link to reset your password.",
                    )
                  : setError("Enter your email above first.")
              }
              className="text-stone-500 hover:text-stone-700 hover:underline"
            >
              Forgot password?
            </button>
            <a href={REWARDS_APP_URL} target="_blank" rel="noreferrer" className={linkClass}>
              Not a member? Join
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <fieldset className="rounded-xl border border-amber-200 bg-amber-50/40 p-5">
      <legend className="px-1 font-semibold text-stone-900">
        Asian Le Rewards <span className="font-normal text-stone-500">(optional)</span>
      </legend>
      {body}
      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
      {notice ? <p className="mt-2 text-sm text-green-700">{notice}</p> : null}
    </fieldset>
  );
}
