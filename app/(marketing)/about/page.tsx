import type { Metadata } from "next";
import { HeartHandshake, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "About Revvy",
  description:
    "Revvy's mission is to bring trusted mechanics directly to customers, so no one has to sit in a shop waiting room again.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust, verified",
    body: "Every mechanic is background-checked and insured before they ever accept a job.",
  },
  {
    icon: Sparkles,
    title: "Transparency by default",
    body: "Upfront pricing, real-time tracking, and honest reviews — no fine print.",
  },
  {
    icon: HeartHandshake,
    title: "Fair to both sides",
    body: "A flat 10% platform fee means mechanics keep more, and customers pay less than shop rates.",
  },
  {
    icon: MapPin,
    title: "Built for where you are",
    body: "Home, office, or roadside — the shop comes to you, not the other way around.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Revvy"
        title="We think a car repair shouldn't cost you an afternoon"
        description="Revvy connects vehicle owners with vetted mobile mechanics who bring the shop to your driveway — starting in Florida, built to go anywhere."
      />

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold text-text">Our story</h2>
          <p className="mt-4 leading-relaxed text-text-muted">
            Revvy started with a simple frustration: getting a car fixed meant taking half a
            day off work, sitting in a waiting room, and hoping the quote didn&apos;t change
            by the time you picked up your keys. Most repairs — oil changes, brakes,
            batteries, diagnostics, even full electronics installs — don&apos;t need a shop
            bay at all. They just need a skilled mechanic and the right tools, which can
            travel just as easily as you can.
          </p>
          <p className="mt-4 leading-relaxed text-text-muted">
            So we built a marketplace that brings the mechanic to the car instead of the
            other way around — with the trust, pricing transparency, and real-time visibility
            people expect from the best on-demand platforms.
          </p>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="text-2xl font-semibold text-text">What we believe</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/8 bg-surface p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold text-text">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <FinalCta />
    </>
  );
}
