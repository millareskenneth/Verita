import { FeaturedApisSection } from "@/components/landing/FeaturedApisSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { HeroFeaturesScrollTransition } from "@/components/motion/HeroFeaturesScrollTransition";
import { LandingMotionShell } from "@/components/motion/LandingMotionShell";

export default function HomePage() {
  return (
    <LandingMotionShell>
      <HeroFeaturesScrollTransition
        hero={<HeroSection />}
        features={<FeaturesSection />}
      />

      <HowItWorksSection />
      <FeaturedApisSection />
    </LandingMotionShell>
  );
}
