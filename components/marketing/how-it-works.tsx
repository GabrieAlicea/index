import { CalendarClock, CheckCircle2, MapPin, Wrench } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";

const STEPS = [
  {
    icon: MapPin,
    title: "Book a service",
    body: "Tell us what your car needs and where you are — ASAP or scheduled for later.",
  },
  {
    icon: CalendarClock,
    title: "We dispatch a mechanic",
    body: "The nearest vetted, insured mechanic accepts your job and heads your way.",
  },
  {
    icon: Wrench,
    title: "We come to you",
    body: "Track your mechanic live and watch the work happen at your location.",
  },
  {
    icon: CheckCircle2,
    title: "You're all set",
    body: "Pay securely in-app, get a digital receipt, and leave a review.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
        <h2 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          From booking to back-on-the-road
        </h2>
        <p className="mt-4 text-lg text-text-muted">
          Four steps. No shop visit, no waiting room, no surprises on the bill.
        </p>
      </Reveal>

      <div className="relative mt-16 grid gap-8 md:grid-cols-4">
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
    </section>
  );
}
