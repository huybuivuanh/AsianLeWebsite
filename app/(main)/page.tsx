import type { Metadata } from "next";
import HeroCarousel from "../../components/home/HeroCarousel";
import DailySpecialSection from "../../components/home/DailySpecialSection";
import DiscoverMenuSection from "../../components/home/DiscoverMenuSection";
import UpdatesSection from "../../components/home/UpdatesSection";
import ExperienceSection from "../../components/home/ExperienceSection";
import HomeSectionNav from "../../components/home/HomeSectionNav";
import OpenHoursSection from "../../components/home/OpenHoursSection";
import OurLocationSection from "../../components/home/OurLocationSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import WelcomeSection from "../../components/home/WelcomeSection";
import { getPublicSiteData } from "@/lib/siteData.server";

/** Revalidate public Firestore-backed sections periodically (~15 min). */
export const revalidate = 900;

export const metadata: Metadata = {
  title: "Chinese & Vietnamese restaurant in Prince Albert",
  description:
    "Asian Le Restaurant welcomes you for lunch and dinner in Prince Albert, Saskatchewan — fresh Chinese and Vietnamese dishes, daily specials, catering-style comfort food, and online ordering via Skip the Dishes.",
  openGraph: {
    title: "Asian Le Restaurant — Prince Albert, SK",
    description:
      "Dine-in and takeout: Chinese & Vietnamese favorites, daily lunch specials, and delivery.",
  },
};

export default async function Home() {
  const site = await getPublicSiteData();

  return (
    <>
      <HeroCarousel />
      <HomeSectionNav />
      <WelcomeSection />
      <DailySpecialSection
        dailySpecials={site.dailySpecials}
        dailySpecialItems={site.dailySpecialItems}
        error={site.dailySpecialsError}
      />
      <UpdatesSection items={site.updates} error={site.updatesError} />
      <OpenHoursSection />
      <ExperienceSection />
      <DiscoverMenuSection />
      <TestimonialsSection />
      <OurLocationSection />
    </>
  );
}
