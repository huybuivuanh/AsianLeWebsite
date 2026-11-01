"use client";

import { useState, type KeyboardEvent, type SyntheticEvent } from "react";
import type { CheckoutFormState } from "@/hooks/useCheckoutForm";
import type { RewardsMemberState } from "@/hooks/useRewardsMember";
import { REWARDS_APP_URL } from "@/lib/rewardsFirebase";
import {
  DOLLARS_PER_REDEEM_STEP,
  estimatePoints,
  estimateWelcomeBonus,
  POINTS_PER_REDEEM_STEP,
  redeemStepsToDollars,
  redeemStepsToPoints,
  WELCOME_BONUS_MIN_SUBTOTAL,
  WELCOME_BONUS_POINTS,
} from "@/lib/rewardsRules";

type RewardsSectionProps = {
  rewards: RewardsMemberState;
  /** Pre-tax subtotal after any points discount — what points are earned on. */
  subTotal: number;
  redeem: CheckoutFormState["redeem"];
};

/** "Use points" picker: $5 off per 100 points, taken when the order is picked up. */
function RedeemPicker({ redeem }: { redeem: CheckoutFormState["redeem"] }) {
  const { availability, steps, maxSteps, setSteps } = redeem;
  if (availability.status === "off") return null;

  let content: React.ReactNode;
  if (availability.status === "loading") {
    content = <p className="text-stone-500">Checking points you can use…</p>;
  } else if (availability.status === "error") {
    content = (
      <p className="text-stone-500">
        Couldn&apos;t load your points right now — you&apos;ll still earn points on this order.
      </p>
    );
  } else {
    if (maxSteps === 0) {
      content = (
        <p className="text-stone-500">
          {availability.available < POINTS_PER_REDEEM_STEP
            ? `Collect ${POINTS_PER_REDEEM_STEP} points to get $${DOLLARS_PER_REDEEM_STEP} off.`
            : `Your order needs to be at least $${DOLLARS_PER_REDEEM_STEP} to use points.`}
        </p>
      );
    } else {
      const btn =
        "h-9 w-9 rounded-full border border-stone-300 bg-white text-lg font-semibold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40";
      content = (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-stone-900">Use points</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Use fewer points"
                className={btn}
                disabled={steps <= 0}
                onClick={() => setSteps(Math.max(0, steps - 1))}
              >
                −
              </button>
              <span className="min-w-[9.5rem] text-center tabular-nums" aria-live="polite">
                {steps === 0
                  ? "None"
                  : `$${redeemStepsToDollars(steps)} off · ${redeemStepsToPoints(steps)} pts`}
              </span>
              <button
                type="button"
                aria-label="Use more points"
                className={btn}
                disabled={steps >= maxSteps}
                onClick={() => setSteps(Math.min(maxSteps, steps + 1))}
              >
                +
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            {POINTS_PER_REDEEM_STEP} points = ${DOLLARS_PER_REDEEM_STEP} off.
            {steps > 0 ? " Points are taken from your balance when you pick up your order." : ""}
          </p>
        </>
      );
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-amber-200 bg-white/70 p-3 text-sm text-stone-700">
      {content}
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-900";
const linkClass = "font-semibold text-amber-700 hover:text-amber-800 hover:underline";

/** Google's multicolour "G", for the sign-in button. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.5z" />
    </svg>
  );
}

/** Optional Asian Le Rewards sign-in at checkout, so the order earns points. */
export default function RewardsSection({ rewards, subTotal, redeem }: RewardsSectionProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (rewards.status === "disabled") return null;

  const points = estimatePoints(subTotal);
  const member = rewards.status === "member" ? rewards.member : null;
  const bonus = estimateWelcomeBonus(member ? member.hasFirstOrder : null, subTotal);
  // A first order under the minimum still counts as the first, so say so up front.
  const bonusShortBy =
    member && !member.hasFirstOrder && bonus === 0
      ? (WELCOME_BONUS_MIN_SUBTOTAL - subTotal).toFixed(2)
      : null;

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
            {/* Minus points already promised on their other open online orders; "…" while
                that's being checked, so a too-high number never flashes up. */}
            {redeem.availability.status === "ready"
              ? redeem.availability.available
              : redeem.availability.status === "error"
                ? rewards.member.points
                : "…"}{" "}
            pts
          </p>
          <p className="mt-1 font-semibold text-amber-800">
            This order earns about {points} {points === 1 ? "point" : "points"}
            {bonus > 0 ? ` + ${bonus} welcome bonus points` : ""} when you pick it up.
          </p>
          {bonusShortBy ? (
            <p className="mt-1 text-amber-800">
              First order? Add ${bonusShortBy} more to get your {WELCOME_BONUS_POINTS}-point welcome
              bonus — it only applies to your first order, if it&apos;s $
              {WELCOME_BONUS_MIN_SUBTOTAL} or more.
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void rewards.signOutRewards()}
          className="text-sm text-stone-500 hover:text-stone-700 hover:underline"
        >
          Sign out
        </button>
        <div className="basis-full">
          <RedeemPicker redeem={redeem} />
        </div>
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
        <div>
          <p>
            Earn about <span className="font-semibold">{points} points</span> on this order — 100
            points = $5 off.
          </p>
          <p className="mt-1 text-amber-800">
            New members get <span className="font-semibold">{WELCOME_BONUS_POINTS} bonus points</span>{" "}
            on their first order of ${WELCOME_BONUS_MIN_SUBTOTAL} or more.
          </p>
        </div>
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
          <GoogleIcon />
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
