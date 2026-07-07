import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about booking, pricing, mechanics, and payments on Revvy.",
  alternates: { canonical: "/faq" },
};

const FAQ_GROUPS: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Booking",
    items: [
      {
        q: "How fast can a mechanic get to me?",
        a: "For ASAP requests, most customers see a mechanic accept within a few minutes and arrive within 30–60 minutes depending on location and demand. You can also schedule a service for a specific date and time.",
      },
      {
        q: "What if no mechanic is available near me?",
        a: "Revvy automatically searches an expanding radius for an available mechanic. If none can be found, you're notified immediately with the option to schedule for later or cancel for a full refund.",
      },
      {
        q: "Can I cancel a booking?",
        a: "Yes — cancellation is free while your job is searching or scheduled. Once a mechanic has accepted and is en route, a cancellation fee applies to cover their travel time.",
      },
    ],
  },
  {
    group: "Pricing & Payment",
    items: [
      {
        q: "Is the price I see final?",
        a: "For standard catalog services, yes — the estimate shown before booking is the price you pay, covering standard parts and labor. Custom or unusual repairs go through a quote your mechanic sends before any charge or dispatch.",
      },
      {
        q: "When am I charged?",
        a: "Your payment method is authorized (not charged) when you book, and the charge is captured only after the job is marked complete.",
      },
      {
        q: "What payment methods are accepted?",
        a: "All major credit and debit cards, plus Apple Pay and Google Pay, processed securely through Stripe.",
      },
    ],
  },
  {
    group: "Mechanics & Trust",
    items: [
      {
        q: "How are mechanics vetted?",
        a: "Every mechanic submits a driver's license, proof of insurance, and certifications, which our team reviews before they're approved to accept jobs.",
      },
      {
        q: "What if I'm not happy with the work?",
        a: "Every job includes a warranty on parts and labor. If something isn't right, contact support and our team will make it right, including mediating disputes and issuing refunds when warranted.",
      },
      {
        q: "Can I request the same mechanic again?",
        a: "Yes — you can favorite a mechanic after a completed job and request them directly on future bookings, availability permitting.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        {FAQ_GROUPS.map((group, gi) => (
          <Reveal key={group.group} delay={gi * 0.05} className="mb-12 last:mb-0">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
              {group.group}
            </h2>
            <Accordion type="single" collapsible className="mt-3">
              {group.items.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        ))}
      </section>
    </>
  );
}
