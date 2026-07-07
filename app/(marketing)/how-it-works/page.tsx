import type { Metadata } from "next";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck2,
  MapPin,
  Navigation,
  Star,
  Wrench,
} from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { FinalCta } from "@/components/marketing/final-cta";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See exactly how Revvy connects you with a vetted mobile mechanic, from booking to a completed repair at your location.",
  alternates: { canonical: "/how-it-works" },
};

const CUSTOMER_STEPS = [
  {
    icon: MapPin,
    title: "Tell us where and what",
    body: "Add your vehicle's details and drop a pin at your location — home, office, or roadside.",
  },
  {
    icon: Clock,
    title: "Pick ASAP or schedule later",
    body: "Need it now? A mechanic is dispatched immediately. Prefer later? Pick a date and time.",
  },
  {
    icon: CreditCard,
    title: "See your price upfront",
    body: "Get an instant estimate before you book — no hidden fees, no surprise invoices.",
  },
  {
    icon: Navigation,
    title: "Track your mechanic live",
    body: "Watch your mechanic's ETA update in real time, just like tracking a rideshare.",
  },
  {
    icon: Wrench,
    title: "Work happens at your location",
    body: "Your mechanic arrives, performs the job, and documents it with before/after photos.",
  },
  {
    icon: CheckCircle2,
    title: "Pay and review",
    body: "Payment is captured automatically when the job's done. Leave a rating for your mechanic.",
  },
];

const MECHANIC_STEPS = [
  {
    icon: FileCheck2,
    title: "Apply and get verified",
    body: "Submit your license, insurance, and certifications. Our team reviews every application.",
  },
  {
    icon: CreditCard,
    title: "Connect your payout account",
    body: "Link your bank account through Stripe — secure, fast, and fully automated payouts.",
  },
  {
    icon: Clock,
    title: "Set your availability",
    body: "Go online when you want to work. Set your service radius and the jobs you accept.",
  },
  {
    icon: MapPin,
    title: "Receive nearby jobs",
    body: "Get notified the moment a job matches your location and skillset — accept or decline.",
  },
  {
    icon: Navigation,
    title: "Navigate and get to work",
    body: "In-app navigation takes you straight to the customer. Upload photos as you go.",
  },
  {
    icon: Star,
    title: "Get paid, get rated",
    body: "Payout hits your account automatically, minus Revvy's 10% fee. Build your rating with every job.",
  },
];

function StepList({ steps }: { steps: typeof CUSTOMER_STEPS }) {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <Reveal key={step.title} delay={(i % 3) * 0.08}>
          <div className="h-full rounded-2xl border border-white/8 bg-surface p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <step.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold text-text">
              {i + 1}. {step.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{step.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Shop-quality repair, without the shop"
        description="Whether you're booking a repair or joining as a mechanic, here's exactly what happens at every step."
      />

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Tabs defaultValue="customer">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="customer">For Customers</TabsTrigger>
              <TabsTrigger value="mechanic">For Mechanics</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="customer">
            <StepList steps={CUSTOMER_STEPS} />
          </TabsContent>
          <TabsContent value="mechanic">
            <StepList steps={MECHANIC_STEPS} />
          </TabsContent>
        </Tabs>

        <Reveal className="mx-auto mt-16 flex max-w-3xl items-start gap-4 rounded-2xl border border-white/8 bg-surface p-6">
          <CalendarClock className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-text-muted">
            <span className="font-medium text-text">Scheduling later?</span> We hold your
            spot and dispatch a nearby mechanic shortly before your appointment window, so
            you get the closest available match instead of a mechanic committed hours in
            advance.
          </p>
        </Reveal>
      </section>

      <FinalCta />
    </>
  );
}
