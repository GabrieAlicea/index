import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-hero";
import { ServicesGrid } from "@/components/marketing/services-grid";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Mobile Mechanic Services",
  description:
    "Browse every service Revvy's mobile mechanics perform — maintenance, brakes, electrical, tires, custom electronics, and roadside assistance.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything a mobile mechanic can do, at your location"
        description="Standard services are fixed-price and bookable instantly. Anything else? Send us the details for a custom quote."
      />
      <ServicesGrid showHeading={false} />
      <FinalCta />
    </>
  );
}
