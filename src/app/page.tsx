"use client";

import { HeroSection } from "../sections/HeroSection";
import { IntegrationsStrip } from "../components/IntegrationsStrip";
import { DemoSection } from "../sections/DemoSection";
import { FeatureShowcase } from "../sections/FeatureShowcase";
import { IntegrationPoints } from "../sections/IntegrationPoints";
import { StackComparisonSection } from "../sections/StackComparisonSection";
import { PlatformGrid } from "../sections/PlatformGrid";
import { PricingSection } from "../sections/PricingSection";
import { EnterpriseSection } from "../sections/EnterpriseSection";
import { StatsSection } from "../sections/StatsSection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { FaqSection } from "../sections/FaqSection";
import { CtaSection } from "../sections/CtaSection";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full bg-app-bg">
      <HeroSection />
      <IntegrationsStrip />
      <DemoSection />
      <FeatureShowcase />
      <div className="section-divider w-full" />
      <IntegrationPoints />
      <StackComparisonSection />
      <PlatformGrid />
      <div className="section-divider w-full" />
      <PricingSection />
      <div className="section-divider w-full" />
      <EnterpriseSection />
      <StatsSection />
      <div className="section-divider w-full" />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
