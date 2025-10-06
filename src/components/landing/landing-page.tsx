"use client";

import { LandingHeader } from "@/components/organisms/LandingHeader";
import { LandingHero } from "@/components/organisms/LandingHero";
import { LandingStats } from "@/components/organisms/LandingStats";
import { LandingFeatures } from "@/components/organisms/LandingFeatures";
import { LandingCTA } from "@/components/organisms/LandingCTA";
import { LandingFooter } from "@/components/organisms/LandingFooter";
import "../../styles/animations.css";

export function LandingPage() {
  return (
    <div className="min-h-screen relative">
      <LandingHeader />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
