import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { getCategoryBySlug, SERVICE_CATEGORIES } from "@/lib/data/services";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.name} — Mobile Mechanic Service`,
    description: `${category.description} Book a vetted mobile mechanic for ${category.name.toLowerCase()} at your location in Florida.`,
    alternates: { canonical: `/services/${category.slug}` },
  };
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const [minDuration, maxDuration] = category.durationMinutes;

  return (
    <>
      <section className="bg-grid relative overflow-hidden border-b border-white/8">
        <div className="bg-radial-fade absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-28">
          <Reveal>
            <Link
              href="/services"
              className="text-sm font-medium text-text-muted hover:text-text"
            >
              ← All services
            </Link>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ServiceIcon icon={category.icon} className="size-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {category.tagline}
              </p>
            </div>
            <h1 className="text-balance mt-4 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              {category.name}
            </h1>
            <p className="text-balance mt-5 max-w-xl text-lg leading-relaxed text-text-muted">
              {category.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={`/book?category=${category.slug}`}>
                  Book This Service
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/pricing">See full pricing</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass-strong rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-faint">
                Starting at
              </p>
              <p className="mt-1 text-3xl font-semibold text-text">
                {category.fromPrice > 0 ? `$${category.fromPrice}` : "Free quote"}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
                <Clock className="size-4 text-primary" />
                {minDuration}–{maxDuration} min on-site
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
                <ShieldCheck className="size-4 text-primary" />
                2 month / 12,000 mile warranty
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold text-text">What&apos;s included</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {category.services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-surface px-5 py-4"
              >
                <span className="flex items-center gap-2.5 text-sm text-text">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  {service.name}
                </span>
                <span className="text-sm font-medium text-text-faint">
                  {service.fromPrice ? `From $${service.fromPrice}` : "Quote"}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
