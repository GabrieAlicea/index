import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { SERVICE_CATEGORIES } from "@/lib/data/services";

export function ServicesGrid({
  showHeading = true,
  limit,
}: {
  showHeading?: boolean;
  limit?: number;
}) {
  const categories = limit ? SERVICE_CATEGORIES.slice(0, limit) : SERVICE_CATEGORIES;

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {showHeading && (
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Services</p>
          <h2 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            Every job a mobile mechanic can do
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            From routine maintenance to full custom electronics installs.
          </p>
        </Reveal>
      )}

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <Reveal key={category.slug} delay={(i % 3) * 0.08}>
            <Link
              href={`/services/${category.slug}`}
              className="group flex h-full flex-col justify-between rounded-2xl border border-white/8 bg-surface p-6 transition-all hover:border-primary/30 hover:bg-surface-2"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ServiceIcon icon={category.icon} />
                  </div>
                  <ArrowUpRight className="size-4 text-text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text">{category.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {category.tagline}
                </p>
              </div>
              <p className="mt-6 text-sm font-medium text-text-faint">
                {category.fromPrice > 0 ? `From $${category.fromPrice}` : "Free quote"}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
