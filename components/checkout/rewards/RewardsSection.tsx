"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import JoinPrompt from "@/components/checkout/rewards/JoinPrompt";
import MemberSummary from "@/components/checkout/rewards/MemberSummary";
import NoProfileNotice from "@/components/checkout/rewards/NoProfileNotice";
import SignInForm from "@/components/checkout/rewards/SignInForm";
import type { RedeemState } from "@/hooks/checkout/useRedeemPoints";
import type { RewardsMemberState } from "@/hooks/useRewardsMember";

type RewardsSectionProps = {
  rewards: RewardsMemberState;
  /** Pre-tax subtotal after any points discount — what points are earned on. */
  subTotal: number;
  redeem: RedeemState;
};

/** Optional Asian Le Rewards sign-in at checkout, so the order earns (or uses) points. */
export default function RewardsSection({ rewards, subTotal, redeem }: RewardsSectionProps) {
  const [signInOpen, setSignInOpen] = useState(false);

  if (rewards.status === "disabled") return null;

  const signOut = () => void rewards.signOut();

  let body: ReactNode;
  if (rewards.status === "loading") {
    body = <p className="mt-2 text-sm text-muted">Checking your rewards sign-in…</p>;
  } else if (rewards.member) {
    body = (
      <MemberSummary
        member={rewards.member}
        subTotal={subTotal}
        redeem={redeem}
        onSignOut={signOut}
      />
    );
  } else if (rewards.status === "no-profile") {
    body = <NoProfileNotice onSignOut={signOut} />;
  } else if (!signInOpen) {
    body = <JoinPrompt subTotal={subTotal} onOpenSignIn={() => setSignInOpen(true)} />;
  } else {
    body = (
      <SignInForm
        signInWithEmail={rewards.signInWithEmail}
        signInWithGoogle={rewards.signInWithGoogle}
        resetPassword={rewards.resetPassword}
      />
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
    </fieldset>
  );
}
