import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileCheck2,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Become a Mechanic",
  description:
    "Earn more, work on your own schedule. Join Revvy as a mobile mechanic and keep 90% of every job — no shop rent, no lead fees.",
  alternates: { canonical: "/become-a-mechanic" },
};

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Keep 90% of every job",
    body: "Revvy takes a flat 10% platform fee. No shop rent, no lift rental, no lead-gen fees.",
  },
  {
    icon: Calendar,
    title: "Work when you want",
    body: "Go online whenever suits you. Set your own service radius and hours — full control.",
  },
  {
    icon: TrendingUp,
    title: "Steady stream of jobs",
    body: "We handle marketing and customer acquisition. You focus on the wrench.",
  },
  {
    icon: DollarSign,
    title: "Fast, automatic payouts",
    body: "Money hits your bank account through Stripe on a rolling schedule — no chasing invoices.",
  },
];

const REQUIREMENTS = [
  "Valid driver's license and clean driving record",
  "Proof of liability insurance",
  "Relevant certification or verifiable experience (ASE preferred, not required)",
  "Your own tools and a reliable vehicle or service van",
  "Pass Revvy's identity and background review",
];

const STEPS = [
  { icon: FileCheck2, title: "Apply online", body: "Takes about 10 minutes. Tell us about your experience and service area." },
  { icon: ShieldCheck, title: "Get verified", body: "Upload your license, insurance, and certifications for review." },
  { icon: Wrench, title: "Set up your profile", body: "Choose the services you offer and connect your payout account." },
  { icon: MapPin, title: "Go online and start earning", body: "Flip your availability on and start receiving nearby jobs." },
];

export default function BecomeAMechanicPage() {
  return (
    <>
      <PageHero
        eyebrow="Become a Mechanic"
        title="Your skills. Your schedule. More in your pocket."
        description="Join a growing network of independent mechanics earning more by cutting out the shop overhead."
      >
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/signup?role=mechanic">
              Apply Now
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text">
            Why mechanics choose Revvy
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
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
      </section>

      <section className="border-y border-white/8 bg-base-raised py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-text">
              Four steps to your first job
            </h2>
          </Reveal>
          <div className="relative mt-14 grid gap-8 md:grid-cols-4">
            <div
              className="absolute top-7 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block"
              aria-hidden="true"
            />
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="relative flex flex-col items-start gap-4">
                  <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-surface text-primary">
                    <step.icon className="size-6" />
                    <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold text-text">What you&apos;ll need to apply</h2>
          <div className="mt-6 flex flex-col gap-3">
            {REQUIREMENTS.map((req) => (
              <div key={req} className="flex items-start gap-3 rounded-xl border border-white/8 bg-surface px-5 py-4">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-sm text-text-muted">{req}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-primary/10 p-8 text-center">
            <h3 className="text-xl font-semibold text-text">Ready to get started?</h3>
            <p className="mt-2 text-sm text-text-muted">
              Applications are reviewed by our team — most mechanics hear back within 2–3
              business days.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/signup?role=mechanic">
                Apply to Drive Revenue on Your Terms
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
