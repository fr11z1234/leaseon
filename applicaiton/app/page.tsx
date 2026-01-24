import AboutSection from "@/components/Pages/Home/AboutSection";
import DiscountSection from "@/components/Pages/Home/DiscountsSection";
import HeroSection from "@/components/Pages/Home/HeroSection";
import ShareSection from "@/components/Pages/Home/ShareSection";
import TypeSection from "@/components/Pages/Home/TypeSection";
import WhySection from "@/components/Pages/Home/WhySection";
import NewestSection from "@/components/Pages/Home/NewestSection";

export default function () {
  return (
    <main>
      <HeroSection />
      <TypeSection />
      <ShareSection />
      <AboutSection />
      <DiscountSection />
      <WhySection />
      <NewestSection />
    </main>
  );
}
