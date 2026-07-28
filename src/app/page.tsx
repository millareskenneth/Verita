import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturedApisSection } from "@/components/landing/FeaturedApisSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div id="landing-content">
        <FeaturesSection />
        <HowItWorksSection />
        <FeaturedApisSection />
        <CategoriesSection />
        <CtaSection />
      </div>
    </>
  );
}
