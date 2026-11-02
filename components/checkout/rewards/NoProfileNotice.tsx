import { REWARDS_APP_URL } from "@/lib/rewardsConfig";
import { rewardsLinkClass } from "@/components/checkout/rewards/styles";

/** Signed in, but sign-up was never finished in the rewards app. */
export default function NoProfileNotice({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="mt-2 text-sm text-body">
      <p>
        Your rewards account isn&apos;t finished yet. Open the{" "}
        <a href={REWARDS_APP_URL} target="_blank" rel="noreferrer" className={rewardsLinkClass}>
          Rewards app
        </a>{" "}
        to add your phone number, then come back.
      </p>
      <button
        type="button"
        onClick={onSignOut}
        className="mt-2 text-sm text-muted hover:text-ink hover:underline"
      >
        Sign out
      </button>
    </div>
  );
}
