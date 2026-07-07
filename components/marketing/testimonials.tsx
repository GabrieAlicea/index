import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal } from "@/components/marketing/reveal";

const TESTIMONIALS = [
  {
    quote:
      "I never thought I'd say a car repair was easy — but Revvy made it easier than ordering takeout. The mechanic showed up on time and my brakes have never felt better.",
    name: "Jasmine K.",
    context: "Orlando, FL",
    initials: "JK",
  },
  {
    quote:
      "As a single mom with two kids, not having to sit in a shop waiting room for three hours is life-changing. Transparent pricing, no upsells, done.",
    name: "Angela M.",
    context: "Tampa, FL",
    initials: "AM",
  },
  {
    quote:
      "I run a small delivery fleet and Revvy keeps my vans on the road. Their mechanics come to our lot after hours so we never lose a business day.",
    name: "Ray S.",
    context: "Fleet Owner, Miami",
    initials: "RS",
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-white/8 bg-base-raised py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Trusted across Florida
          </p>
          <h2 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            Drivers love not driving to the shop
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-white/8 bg-surface p-6">
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
                  <Avatar className="size-9">
                    <AvatarFallback className="text-xs">{t.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-text">{t.name}</p>
                    <p className="text-xs text-text-faint">{t.context}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
