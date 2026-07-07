import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Revvy team.",
  alternates: { canonical: "/contact" },
};

const CONTACT_METHODS = [
  { icon: Mail, label: "Email", value: "support@revvy.com" },
  { icon: Phone, label: "Phone", value: "(800) 555-0142" },
  { icon: MapPin, label: "Headquarters", value: "Orlando, FL" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" />
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <Reveal>
            <div className="flex flex-col gap-6">
              {CONTACT_METHODS.map((m) => (
                <div key={m.label} className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <m.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-text-faint">
                      {m.label}
                    </p>
                    <p className="text-sm text-text">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/8 bg-surface p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
