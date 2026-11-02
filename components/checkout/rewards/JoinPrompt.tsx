import {
  DOLLARS_PER_REDEEM_STEP,
  estimatePoints,
  POINTS_PER_REDEEM_STEP,
  WELCOME_BONUS_MIN_SUBTOTAL,
  WELCOME_BONUS_POINTS,
} from "@/lib/rewardsRules";

type JoinPromptProps = {
  /** Pre-tax subtotal — what points are earned on. */
  subTotal: number;
  onOpenSignIn: () => void;
};

/** Signed out: what this order would earn, and a button to open the sign-in form. */
export default function JoinPrompt({ subTotal, onOpenSignIn }: JoinPromptProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-body">
      <div>
        <p>
          Earn about <span className="font-semibold">{estimatePoints(subTotal)} points</span> on
          this order — {POINTS_PER_REDEEM_STEP} points = ${DOLLARS_PER_REDEEM_STEP} off.
        </p>
        <p className="mt-1 text-brand">
          New members get <span className="font-semibold">{WELCOME_BONUS_POINTS} bonus points</span>{" "}
          on their first order of ${WELCOME_BONUS_MIN_SUBTOTAL} or more.
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenSignIn}
        className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
      >
        Sign in to earn
      </button>
    </div>
  );
}
