import Link from "next/link";
import { ArrowUpRight, LifeBuoy, Truck, Wrench } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";

const CARDS = [
  {
    icon: Truck,
    title: "For Fleets",
    body: "Keep your business moving with priority service and custom pricing.",
    href: "/fleets",
  },
  {
    icon: LifeBuoy,
    title: "Roadside Help",
    body: "Jump starts, flat tires, lockouts & more. We come to you, fast.",
    href: "/roadside-assistance",
  },
  {
    icon: Wrench,
    title: "Maintenance Plans",
    body: "Save time and money with scheduled maintenance at your location.",
    href: "/pricing",
  },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-3">
        {CARDS.map((card, i) => (
          <Reveal key={card.title} delay={i * 0.1}>
            <Link
              href={card.href}
              className="group flex h-full flex-col justify-between rounded-2xl border border-white/8 bg-gradient-to-br from-surface to-surface-2 p-6 transition-colors hover:border-primary/30"
            >
              <div>
                <card.icon className="size-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-text">{card.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{card.body}</p>
              </div>
              <p className="mt-6 flex items-center gap-1 text-sm font-medium text-primary">
                Learn more
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
