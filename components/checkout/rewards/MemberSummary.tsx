import RedeemPicker from "@/components/checkout/rewards/RedeemPicker";
import type { RedeemState } from "@/hooks/checkout/useRedeemPoints";
import {
  estimatePoints,
  estimateWelcomeBonus,
  WELCOME_BONUS_MIN_SUBTOTAL,
  WELCOME_BONUS_POINTS,
} from "@/lib/rewardsRules";

type MemberSummaryProps = {
  member: RewardsMember;
  /** Pre-tax subtotal after any points discount — what points are earned on. */
  subTotal: number;
  redeem: RedeemState;
  onSignOut: () => void;
};

/** Signed-in member: their points, what this order earns, and the "use points" picker. */
export default function MemberSummary({ member, subTotal, redeem, onSignOut }: MemberSummaryProps) {
  const points = estimatePoints(subTotal);
  const bonus = estimateWelcomeBonus(member.hasFirstOrder, subTotal);
  // A first order under the minimum still counts as the first, so say so up front.
  const bonusShortBy =
    !member.hasFirstOrder && bonus === 0 ? (WELCOME_BONUS_MIN_SUBTOTAL - subTotal).toFixed(2) : null;

  // Minus points already promised on their other open online orders; "…" while that's
  // being checked, so a too-high number never flashes up.
  const { availability } = redeem;
  const shownPoints =
    availability.status === "ready"
      ? availability.available
      : availability.status === "error"
        ? member.points
        : "…";

  return (
    <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
      <div className="text-sm text-body">
        <p>
          Signed in as <span className="font-semibold">{member.name}</span> · {shownPoints} pts
        </p>
        <p className="mt-1 font-bold text-brand">
          This order earns about {points} {points === 1 ? "point" : "points"}
          {bonus > 0 ? ` + ${bonus} welcome bonus points` : ""} when you pick it up.
        </p>
        {bonusShortBy ? (
          <p className="mt-1 text-brand">
            First order? Add ${bonusShortBy} more to get your {WELCOME_BONUS_POINTS}-point welcome
            bonus — it only applies to your first order, if it&apos;s ${WELCOME_BONUS_MIN_SUBTOTAL}{" "}
            or more.
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onSignOut}
        className="text-sm text-muted hover:text-ink hover:underline"
      >
        Sign out
      </button>
      <div className="basis-full">
        <RedeemPicker redeem={redeem} />
      </div>
    </div>
  );
}
