import type { Metadata } from "next";

import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/legal/terms" },
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account or booking a service through Revvy, you agree to these Terms of Service. If you are registering as a mechanic, additional terms governing your relationship with Revvy as an independent contractor apply and are presented during onboarding.",
  },
  {
    title: "2. The Revvy Marketplace",
    body: "Revvy operates a marketplace connecting customers with independent, third-party mobile mechanics. Revvy is not itself a repair shop and does not perform repairs — mechanics on the platform are independent contractors, not Revvy employees.",
  },
  {
    title: "3. Bookings & Payment",
    body: "When you book a service, you authorize Revvy to place a hold on your payment method for the estimated amount. This amount is captured upon job completion. A platform fee is included in the price shown at booking.",
  },
  {
    title: "4. Cancellations",
    body: "Cancellations made before a mechanic accepts your job are free of charge. Once a mechanic has been dispatched and is en route, a cancellation fee may apply to compensate for their travel time.",
  },
  {
    title: "5. Mechanic Conduct & Vetting",
    body: "Mechanics are subject to identity and document verification prior to approval. Revvy does not guarantee the conduct of any individual mechanic but investigates reported issues and may suspend accounts pending review.",
  },
  {
    title: "6. Limitation of Liability",
    body: "Revvy's liability is limited to the amount paid for the applicable service, to the fullest extent permitted by law. Nothing in these terms limits liability that cannot be limited under applicable law.",
  },
  {
    title: "7. Changes to These Terms",
    body: "We may update these terms from time to time. Continued use of Revvy after changes take effect constitutes acceptance of the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" align="left" />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm text-warning">
          Draft placeholder — pending final legal review before launch.
        </div>
        <p className="mt-8 text-sm text-text-faint">Last updated: July 7, 2026</p>
        <div className="mt-6 flex flex-col gap-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-semibold text-text">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
