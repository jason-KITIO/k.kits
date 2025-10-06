import {
  LandingHeader,
  HeroSection,
  StatsSection,
  FeaturesSection,
  CTASection,
  LandingFooter,
} from "@/components/organisms";
import "@/styles/animations.css";

export function LandingLayout() {
  return (
    <div className="min-h-screen relative">
      <LandingHeader />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
