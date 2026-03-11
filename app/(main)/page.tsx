import HeroCarousel from "../../components/home/HeroCarousel";
import DailySpecialSection from "../../components/home/DailySpecialSection";
import DiscoverMenuSection from "../../components/home/DiscoverMenuSection";
import NewsUpdatesSection from "../../components/home/NewsUpdatesSection";
import ExperienceSection from "../../components/home/ExperienceSection";
import HomeSectionNav from "../../components/home/HomeSectionNav";
import OpenHoursSection from "../../components/home/OpenHoursSection";
import OurLocationSection from "../../components/home/OurLocationSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import WelcomeSection from "../../components/home/WelcomeSection";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <HomeSectionNav />
      <WelcomeSection />
      <DailySpecialSection />
      <NewsUpdatesSection />
      <OpenHoursSection />
      <ExperienceSection />
      <DiscoverMenuSection />
      <TestimonialsSection />
      <OurLocationSection />
    </>
  );
}
