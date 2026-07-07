"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Star, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { SERVICE_CATEGORIES } from "@/lib/data/services";

const PREVIEW_SERVICES = SERVICE_CATEGORIES.slice(0, 4);

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="bg-radial-fade absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-32 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-text-muted">
            <MapPin className="size-3.5 text-primary" />
            Now booking in Orlando, Tampa &amp; Miami
          </div>

          <h1 className="text-balance mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-7xl">
            Mechanics that
            <br />
            come to <span className="text-primary">you.</span>
          </h1>

          <p className="text-balance mt-6 max-w-lg text-lg leading-relaxed text-text-muted">
            On-demand auto repair at your driveway, office, or roadside. Vetted mechanics,
            upfront pricing, and real-time tracking — book in under two minutes.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/book">
                Book a Service
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/book?mode=asap">
                <Zap className="size-4 text-warning" />
                ASAP Service
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["AM", "JK", "RS", "TL"].map((initials) => (
                <div
                  key={initials}
                  className="flex size-9 items-center justify-center rounded-full border-2 border-base bg-surface-2 text-[11px] font-semibold text-text-muted"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
                <span className="ml-1.5 text-sm font-semibold text-text">4.9</span>
              </div>
              <p className="text-xs text-text-faint">2,500+ verified reviews</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <GlassCard className="glow-primary relative mx-auto max-w-md p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-faint">
              Book your service
            </p>
            <p className="mt-1 text-sm text-text-muted">Fast, easy, at your location.</p>

            <div className="mt-5 rounded-xl border border-white/10 bg-surface px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-text-faint">
                Where is your car?
              </p>
              <p className="mt-1 text-sm text-text">221B Baker Street, Orlando, FL</p>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-surface px-4 py-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-text-muted">
                <ServiceIcon icon="oil" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-text-faint">
                  Your vehicle
                </p>
                <p className="text-sm text-text">2021 Toyota RAV4 · 42,000 mi</p>
              </div>
            </div>

            <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-text-faint">
              Choose a service
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {PREVIEW_SERVICES.map((service, i) => (
                <div
                  key={service.slug}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center ${
                    i === 0
                      ? "border-primary/50 bg-primary/10"
                      : "border-white/10 bg-surface"
                  }`}
                >
                  <ServiceIcon
                    icon={service.icon}
                    className={i === 0 ? "text-primary" : "text-text-muted"}
                  />
                  <span className="text-[10px] leading-tight text-text-muted">
                    {service.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3.5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-primary/70">
                  Instant estimate
                </p>
                <p className="text-2xl font-semibold text-text">$89</p>
              </div>
              <Button size="sm">Get Estimate</Button>
            </div>
          </GlassCard>

          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-surface-2 px-4 py-3 shadow-2xl sm:block">
            <p className="text-[11px] font-medium uppercase tracking-wide text-text-faint">
              Mechanic arriving
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-text">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              18 min ETA
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
