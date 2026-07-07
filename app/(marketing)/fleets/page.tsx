import type { Metadata } from "next";
import { BarChart3, CalendarCheck, FileText, ShieldCheck, Truck, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export const metadata: Metadata = {
  title: "For Fleets",
  description:
    "Keep your fleet on the road with priority mobile maintenance, consolidated invoicing, and dedicated account support.",
  alternates: { canonical: "/fleets" },
};

const BENEFITS = [
  {
    icon: CalendarCheck,
    title: "Priority scheduling",
    body: "Fleet jobs jump the queue with guaranteed response windows, including after-hours service at your lot.",
  },
  {
    icon: FileText,
    title: "Consolidated invoicing",
    body: "One monthly invoice across every vehicle and job — no reconciling dozens of receipts.",
  },
  {
    icon: BarChart3,
    title: "Fleet health dashboard",
    body: "See maintenance history, upcoming service needs, and spend across your entire fleet in one place.",
  },
  {
    icon: Users,
    title: "Dedicated account manager",
    body: "A single point of contact who knows your fleet and can escalate urgent repairs immediately.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted mechanics only",
    body: "Every mechanic servicing your fleet is background-checked, insured, and rated.",
  },
  {
    icon: Truck,
    title: "Custom maintenance plans",
    body: "Scheduled preventative maintenance built around your vehicles' mileage and duty cycle.",
  },
];

export default function FleetsPage() {
  return (
    <>
      <PageHero
        eyebrow="For Fleets"
        title="Keep your fleet moving, not waiting in a shop"
        description="Revvy for Fleets is built for businesses running 5 to 500+ vehicles — delivery vans, service trucks, rideshare fleets, and more. Join the waitlist for early access as we roll out fleet accounts."
      />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-2xl border border-white/8 bg-surface p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <b.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-text">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-16 max-w-xl rounded-2xl border border-white/8 bg-surface p-8 text-center">
          <h2 className="text-2xl font-semibold text-text">Join the fleets waitlist</h2>
          <p className="mt-2 text-sm text-text-muted">
            Tell us about your fleet and we&apos;ll reach out as we onboard fleet accounts in
            your area.
          </p>
          <WaitlistForm successMessage="You're on the list — we'll reach out as fleet accounts roll out in your area.">
            <div className="grid gap-1.5">
              <Label htmlFor="company">Company name</Label>
              <Input id="company" name="company" placeholder="Acme Delivery Co." required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="fleet-size">Fleet size</Label>
              <Input id="fleet-size" name="fleet-size" placeholder="e.g. 12 vehicles" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" name="email" type="email" placeholder="you@company.com" required />
            </div>
          </WaitlistForm>
        </Reveal>
      </section>
    </>
  );
}
