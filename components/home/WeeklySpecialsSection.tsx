import Image from "next/image";
import OrderPickupCta from "@/components/menu/OrderPickupCta";
import { REWARDS_APP_URL, rewardsEnabled } from "@/lib/rewardsFirebase";
import {
  DOLLARS_PER_REDEEM_STEP,
  POINTS_PER_REDEEM_STEP,
  WELCOME_BONUS_MIN_SUBTOTAL,
  WELCOME_BONUS_POINTS,
} from "@/lib/rewardsRules";
import {
  formatDayOfWeekLabel,
  formatPriceCAD,
  formatTimeHHmmTo12h,
  sortAlphabetically,
} from "@/lib/utils";
import { DAY_ORDER_MONDAY_FIRST, type DayOfWeek } from "@/types/enum";

type WeeklySpecialsSectionProps = {
  dailySpecials: DailySpecial[];
  dailySpecialItems: DailySpecialItem[];
  error?: string | null;
  /** Today in the store's timezone — that day's card is highlighted. */
  today: DayOfWeek;
  storeSettings: StoreSettings;
  /** The order-online and rewards cards under the specials (home page). Default true. */
  showOrderCards?: boolean;
};

/** The week's lunch specials (Firestore dailySpecials / dailySpecialItems), all days
 * side by side with today highlighted, plus the order-online and rewards cards. */
export default function WeeklySpecialsSection({
  dailySpecials,
  dailySpecialItems,
  error,
  today,
  storeSettings,
  showOrderCards = true,
}: WeeklySpecialsSectionProps) {
  const itemsById = new Map(dailySpecialItems.map((item) => [item.id, item]));
  const days = [...dailySpecials].sort(
    (a, b) =>
      orderOf(DAY_ORDER_MONDAY_FIRST.indexOf(a.dayOfWeek)) -
      orderOf(DAY_ORDER_MONDAY_FIRST.indexOf(b.dayOfWeek)),
  );

  return (
    <section id="daily-special" className="scroll-mt-20 bg-ink text-on-ink">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
              Daily special
            </p>
            <h2 className="mt-3 text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              This week&apos;s{" "}
              <span className="font-accent font-normal italic text-gold">
                lunch
              </span>
            </h2>
          </div>
          <p className="max-w-[34ch] text-on-ink-muted">
            Freshly prepared, great value, and perfect for a quick lunch.
            Today&apos;s specials are highlighted.
          </p>
        </div>

        {error ? (
          <p className="mt-10 text-red-300" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
          {days.map((day) => {
            const isToday = day.dayOfWeek === today;
            // Gold on the dark cards, brand red on today's light card.
            const accent = isToday ? "text-brand" : "text-gold";
            const items = sortAlphabetically(
              (day.itemIds ?? [])
                .map((id) => itemsById.get(id))
                .filter((item): item is DailySpecialItem => item != null),
              (item) => item.name,
            );
            return (
              <article
                key={day.id}
                className={`rounded-3xl border p-5.5 ${isToday ? "border-on-ink bg-on-ink text-ink" : "border-ink-line bg-ink-raised text-on-ink"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-lg font-extrabold ${isToday ? "" : "text-gold"}`}
                  >
                    {formatDayOfWeekLabel(day.dayOfWeek)}
                  </h3>
                  {isToday ? (
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                      Today
                    </span>
                  ) : null}
                </div>
                {day.timeRange.startTime ? (
                  <p className="mt-0.5 text-[13px] opacity-75">
                    {formatTimeHHmmTo12h(day.timeRange.startTime)} –{" "}
                    {formatTimeHHmmTo12h(day.timeRange.endTime)}
                  </p>
                ) : null}
                <ul>
                  {items.map((item) => {
                    const { number, rest } = splitNumber(item.name);
                    return (
                      <li
                        key={item.id}
                        className={`mt-4 border-t pt-3.5 text-sm leading-normal ${isToday ? "border-sand-line" : "border-ink-line"}`}
                      >
                        <p className="font-semibold">
                          {number ? (
                            <span className={`mr-1 font-extrabold ${accent}`}>
                              {number}
                            </span>
                          ) : null}
                          {rest}
                        </p>
                        {item.options && item.options.length > 0 ? (
                          <ul
                            className={`mt-1.5 list-disc pl-5 font-semibold leading-relaxed ${isToday ? "text-body marker:text-brand" : "text-on-ink-muted marker:text-gold"}`}
                          >
                            {item.options.map((option, i) => (
                              <li key={i}>{option}</li>
                            ))}
                          </ul>
                        ) : null}
                        <p
                          className={`mt-1.5 text-right text-[15px] font-extrabold tabular-nums ${isToday ? "text-brand" : "text-brand-bright"}`}
                        >
                          {formatPriceCAD(item.price)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>

        {showOrderCards ? (
          <div className="mt-14 grid gap-3.5 md:grid-cols-2">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gold px-7 py-7 text-ink">
              <div>
                <p className="text-[22px] font-extrabold tracking-[-0.01em]">
                  Order online for pickup
                </p>
                <p className="text-sm text-gold-ink">
                  Pay when you pick up — no online payment.
                </p>
              </div>
              <OrderPickupCta
                storeSettings={storeSettings}
                className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-gold"
              >
                Start order
              </OrderPickupCta>
            </div>
            {rewardsEnabled ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-ink-line bg-ink-raised px-7 py-7">
                <div>
                  <p className="text-[22px] font-extrabold tracking-[-0.01em]">
                    <a
                      href={REWARDS_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Asian Le Rewards"
                      className="inline-flex items-center gap-1 rounded-md transition hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <span className="tracking-wide">ASIAN</span>
                      <span className="relative h-8 w-6 shrink-0">
                        <Image
                          src="/logo.png"
                          alt=""
                          fill
                          className="object-contain"
                          sizes="24px"
                          unoptimized
                        />
                      </span>
                      <span className="tracking-wide">LE</span>
                      <span className="ml-1.5 font-accent font-normal italic text-gold underline decoration-gold/50 underline-offset-4">
                        Rewards
                      </span>
                    </a>
                  </p>
                  <p className="text-sm text-on-ink-muted">
                    $1 = 1 point · {POINTS_PER_REDEEM_STEP} points = $
                    {DOLLARS_PER_REDEEM_STEP} off · {WELCOME_BONUS_POINTS} bonus
                    on your first ${WELCOME_BONUS_MIN_SUBTOTAL} order
                  </p>
                </div>
                <a
                  href={REWARDS_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md font-bold text-gold transition hover:text-on-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Join free →
                </a>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** "#1: Stir Fry …" → { number: "#1:", rest: "Stir Fry …" }, so the number can be coloured. */
function splitNumber(name: string): { number: string | null; rest: string } {
  const match = /^(#\d+\s*:?)\s*([\s\S]*)$/.exec(name);
  return match
    ? { number: match[1], rest: match[2] }
    : { number: null, rest: name };
}

function orderOf(index: number) {
  return index === -1 ? 99 : index;
}
