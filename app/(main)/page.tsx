import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import WeeklySpecialsSection from "@/components/home/WeeklySpecialsSection";
import MenuHighlightsSection from "@/components/home/MenuHighlightsSection";
import UpdatesSection from "@/components/home/UpdatesSection";
import KitchenSection from "@/components/home/KitchenSection";
import VisitSection from "@/components/home/VisitSection";
import { getPublicSiteData } from "@/lib/siteData.server";
import { getStoreSettings } from "@/lib/storeSettings";
import { pageMetadata } from "@/lib/seo";
import { dayOfWeekInTimezone } from "@/lib/utils";
import type { DayOfWeek } from "@/types/enum";

/** Revalidate public Firestore-backed sections periodically (~15 min). */
export const revalidate = 900;

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "Chinese & Vietnamese restaurant in Prince Albert",
  description:
    "Asian Le Restaurant welcomes you for lunch and dinner in Prince Albert, Saskatchewan — fresh Chinese and Vietnamese dishes, daily lunch specials, online ordering for pickup, and Skip the Dishes delivery.",
  ogTitle: "Asian Le Restaurant — Prince Albert, SK",
  ogDescription:
    "Dine-in and takeout: Chinese & Vietnamese favorites, daily lunch specials, and delivery.",
});

export default async function Home() {
  const [site, settings] = await Promise.all([getPublicSiteData(), getStoreSettings()]);
  const firstHours = site.storeHours[0];
  // The page is cached for up to 15 minutes, so "today" can lag just after midnight.
  const today = dayOfWeekInTimezone(settings.timezone) as DayOfWeek;

  return (
    <>
      <HeroSection
        hoursLine={firstHours ? `${firstHours.days} · ${firstHours.time}` : null}
        storeSettings={settings}
      />
      <WelcomeSection />
      <WeeklySpecialsSection
        dailySpecials={site.dailySpecials}
        dailySpecialItems={site.dailySpecialItems}
        error={site.dailySpecialsError}
        today={today}
        storeSettings={settings}
      />
      <MenuHighlightsSection />
      <KitchenSection />
      <UpdatesSection items={site.updatesError ? [] : site.updates} />
      <VisitSection hours={site.storeHours} />
    </>
  );
}
