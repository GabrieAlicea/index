import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Fuel, Key, Timer, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { FinalCta } from "@/components/marketing/final-cta";
import { getCategoryBySlug } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Roadside Assistance",
  description:
    "Stuck on the side of the road? Revvy dispatches a nearby mechanic for jump starts, lockouts, flat tires, and fuel delivery — fast.",
  alternates: { canonical: "/roadside-assistance" },
};

const roadside = getCategoryBySlug("roadside-assistance")!;

const SITUATIONS = [
  { icon: Key, title: "Locked out", body: "Keys locked inside? We'll get you back in without damaging your vehicle." },
  { icon: BatteryCharging, title: "Dead battery", body: "A jump start on the spot, or a replacement if the battery won't hold a charge." },
  { icon: Wrench, title: "Flat tire", body: "Swap to your spare or patch the tire, right where you're parked." },
  { icon: Fuel, title: "Out of gas", body: "Emergency fuel delivery so you can get to the nearest station." },
];

export default function RoadsideAssistancePage() {
  return (
    <>
      <PageHero
        eyebrow="Roadside Assistance"
        title="Stuck? Help is closer than you think"
        description="Average arrival under 30 minutes. No towing, no waiting on hold — just a nearby mechanic dispatched straight to you."
      >
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/book?category=roadside-assistance">
              Get Roadside Help Now
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SITUATIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/8 bg-surface p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-text">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col items-center gap-3 rounded-2xl border border-white/8 bg-surface p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <Timer className="size-8 text-primary" />
            <div>
              <p className="font-semibold text-text">Starting at ${roadside.fromPrice}</p>
              <p className="text-sm text-text-muted">Upfront pricing, no towing markup.</p>
            </div>
          </div>
          <Button asChild variant="secondary">
            <Link href="/book?category=roadside-assistance">Request Help</Link>
          </Button>
        </Reveal>
      </section>

      <FinalCta />
    </>
  );
}
