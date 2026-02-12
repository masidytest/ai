"use client";

import { PricingSection } from "../../sections/PricingSection";
import { Footer } from "../../components/Footer";

export default function PricingPage() {
  return (
    <>
      <main className="bg-app-bg pt-20">
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
