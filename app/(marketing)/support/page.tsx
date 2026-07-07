import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, HelpCircle, MessageCircle, Users, Wrench } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with a booking, payment, or mechanic account — Revvy support is here for you.",
  alternates: { canonical: "/support" },
};

const TOPICS = [
  { icon: Wrench, title: "Booking & Appointments", body: "Manage, reschedule, or cancel a service.", href: "/faq" },
  { icon: CreditCard, title: "Payments & Invoices", body: "Billing questions, receipts, and refunds.", href: "/faq" },
  { icon: Users, title: "Mechanic Accounts", body: "Onboarding, payouts, and document status.", href: "/faq" },
  { icon: HelpCircle, title: "General Questions", body: "Everything else about using Revvy.", href: "/faq" },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="How can we help?"
        description="Browse common topics below, or reach our team directly."
      />

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {TOPICS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08}>
              <Link
                href={t.href}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-surface p-6 transition-colors hover:border-primary/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <t.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-text">{t.title}</p>
                    <p className="text-sm text-text-muted">{t.body}</p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-text-faint transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-white/8 bg-surface p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <MessageCircle className="size-8 text-primary" />
            <div>
              <p className="font-semibold text-text">Still need help?</p>
              <p className="text-sm text-text-muted">Our support team responds within one business day.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Contact Us
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
