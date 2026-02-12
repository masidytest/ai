"use client";

import { FeatureShowcase } from "../../sections/FeatureShowcase";
import { PlatformGrid } from "../../sections/PlatformGrid";
import { Footer } from "../../components/Footer";

export default function FeaturesPage() {
  return (
    <>
      <main className="bg-app-bg pt-20">
        <FeatureShowcase />
        <div className="section-divider w-full" />
        <PlatformGrid />
      </main>
      <Footer />
    </>
  );
}
