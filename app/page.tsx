import HeroCarousel from "./components/HeroCarousel";
import DailySpecialSection from "./components/home/DailySpecialSection";
import DiscoverMenuSection from "./components/home/DiscoverMenuSection";
import ExperienceSection from "./components/home/ExperienceSection";
import OpenHoursSection from "./components/home/OpenHoursSection";
import OurLocationSection from "./components/home/OurLocationSection";
import TestimonialsSection from "./components/home/TestimonialsSection";
import WelcomeSection from "./components/home/WelcomeSection";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <WelcomeSection />
      <DailySpecialSection />
      <OpenHoursSection />
      <ExperienceSection />
      <DiscoverMenuSection />
      <TestimonialsSection />
      <OurLocationSection />
    </>
  );
}
