import type { Metadata } from "next";

import { AppExperience } from "@/components/marketing/app-experience";
import { FeatureCards } from "@/components/marketing/feature-cards";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { MechanicSpotlight } from "@/components/marketing/mechanic-spotlight";
import { ServicesGrid } from "@/components/marketing/services-grid";
import { Testimonials } from "@/components/marketing/testimonials";
import { TrustBar } from "@/components/marketing/trust-bar";

export const metadata: Metadata = {
  title: "Revvy — Mobile Mechanics That Come to You",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <ServicesGrid limit={6} />
      <AppExperience />
      <MechanicSpotlight />
      <FeatureCards />
      <Testimonials />
      <FinalCta />
    </>
  );
}
