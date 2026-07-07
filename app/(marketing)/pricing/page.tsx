import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { FinalCta } from "@/components/marketing/final-cta";
import { SERVICE_CATEGORIES } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent, upfront pricing for every Revvy service — no hidden fees, no shop overhead, no surprises.",
  alternates: { canonical: "/pricing" },
};

const PRINCIPLES = [
  "See your exact price before you book — computed from your vehicle and address.",
  "Standard parts and labor included in every fixed-price service.",
  "10% platform fee is built into the price you see — mechanics never upsell you in person.",
  "Complex or unusual jobs get a written quote before any work or dispatch happens.",
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="One price. No shop overhead. No surprises."
        description="Because our mechanics don't pay rent on a bay or a lift, you get shop-quality work for less — and you know the price before you book."
      />

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-surface p-5">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-text-muted">{p}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <h2 className="text-2xl font-semibold text-text">Starting prices by category</h2>
            <p className="mt-2 text-text-muted">
              Final price depends on your vehicle, parts required, and exact service selected.
            </p>
          </Reveal>

          <div className="mt-8 divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
            {SERVICE_CATEGORIES.map((category, i) => (
              <Reveal key={category.slug} delay={(i % 4) * 0.05}>
                <Link
                  href={`/services/${category.slug}`}
                  className="flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ServiceIcon icon={category.icon} className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-text">{category.name}</p>
                      <p className="text-xs text-text-faint">{category.tagline}</p>
                    </div>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold text-text">
                    {category.fromPrice > 0 ? `From $${category.fromPrice}` : "Free quote"}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16 rounded-2xl border border-white/8 bg-surface p-8">
          <h3 className="text-lg font-semibold text-text">For mechanics: what you keep</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            Revvy takes a flat 10% commission on every completed job — that&apos;s it. No
            monthly fees, no lead fees, no lift rental. Payouts are deposited automatically
            through Stripe on a rolling schedule after each job completes.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/become-a-mechanic">
              See mechanic earnings
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>
      </section>

      <FinalCta />
    </>
  );
}
