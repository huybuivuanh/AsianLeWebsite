"use client";

import Image from "next/image";
import { GoogleIcon } from "@/components/contact/ContactIcons";
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
    content = <p className="text-muted">Checking points you can use…</p>;
  } else if (availability.status === "error") {
    content = (
      <p className="text-muted">
        Couldn&apos;t load your points right now — you&apos;ll still earn points on this order.
      </p>
    );
  } else {
    if (maxSteps === 0) {
      content = (
        <p className="text-muted">
          {availability.available < POINTS_PER_REDEEM_STEP
            ? `Collect ${POINTS_PER_REDEEM_STEP} points to get $${DOLLARS_PER_REDEEM_STEP} off.`
            : `Your order needs to be at least $${DOLLARS_PER_REDEEM_STEP} to use points.`}
        </p>
      );
    } else {
      const btn =
        "h-9 w-9 rounded-full border border-sand-line bg-white text-lg font-bold text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40";
      content = (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-extrabold">Use points</span>
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
              <span className="min-w-[9.5rem] text-center font-bold tabular-nums" aria-live="polite">
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
          <p className="mt-1 text-xs text-muted">
            {POINTS_PER_REDEEM_STEP} points = ${DOLLARS_PER_REDEEM_STEP} off.
            {steps > 0 ? " Points are taken from your balance when you pick up your order." : ""}
          </p>
        </>
      );
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-sand-line bg-ivory/60 p-4 text-sm text-body">
      {content}
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-sand-line bg-ivory/40 px-4 py-3 text-base font-normal text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";
const linkClass = "font-bold text-brand hover:text-brand-dark hover:underline";

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
    body = <p className="mt-2 text-sm text-muted">Checking your rewards sign-in…</p>;
  } else if (rewards.status === "member" && rewards.member) {
    body = (
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div className="text-sm text-body">
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
          <p className="mt-1 font-bold text-brand">
            This order earns about {points} {points === 1 ? "point" : "points"}
            {bonus > 0 ? ` + ${bonus} welcome bonus points` : ""} when you pick it up.
          </p>
          {bonusShortBy ? (
            <p className="mt-1 text-brand">
              First order? Add ${bonusShortBy} more to get your {WELCOME_BONUS_POINTS}-point welcome
              bonus — it only applies to your first order, if it&apos;s $
              {WELCOME_BONUS_MIN_SUBTOTAL} or more.
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void rewards.signOutRewards()}
          className="text-sm text-muted hover:text-ink hover:underline"
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
      <div className="mt-2 text-sm text-body">
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
          className="mt-2 text-sm text-muted hover:text-ink hover:underline"
        >
          Sign out
        </button>
      </div>
    );
  } else if (!open) {
    body = (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-body">
        <div>
          <p>
            Earn about <span className="font-semibold">{points} points</span> on this order — 100
            points = $5 off.
          </p>
          <p className="mt-1 text-brand">
            New members get <span className="font-semibold">{WELCOME_BONUS_POINTS} bonus points</span>{" "}
            on their first order of ${WELCOME_BONUS_MIN_SUBTOTAL} or more.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          Sign in to earn
        </button>
      </div>
    );
  } else {
    body = (
      // Not a nested <form> (invalid HTML inside the checkout form) — a div with its own handler.
      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={() => void run(rewards.signInWithGoogle)}
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
              className={inputClass}
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
              className={inputClass}
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
              onClick={() =>
                email
                  ? void run(
                      () => rewards.resetPassword(email),
                      "Check your email for a link to reset your password.",
                    )
                  : setError("Enter your email above first.")
              }
              className="text-muted hover:text-ink hover:underline"
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
    <fieldset className="rounded-3xl border border-sand-line bg-white p-6 sm:p-8">
      <legend className="sr-only">Asian Le Rewards (optional)</legend>
      <div aria-hidden className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="flex items-center gap-0.5 text-xl font-extrabold tracking-wide">
          ASIAN
          <span className="relative inline-block h-7 w-5">
            <Image src="/logo.png" alt="" fill className="object-contain" sizes="20px" unoptimized />
          </span>
          LE
        </span>
        <span className="text-xl font-extrabold">
          <span className="font-accent font-normal italic text-brand">Rewards</span>
        </span>
        <span className="text-sm font-semibold text-muted">(optional)</span>
      </div>
      {body}
      {error ? (
        <p role="alert" className="mt-3 text-sm font-bold text-brand">
          {error}
        </p>
      ) : null}
      {notice ? <p className="mt-3 text-sm font-bold text-[#2f6b3a]">{notice}</p> : null}
    </fieldset>
  );
}
