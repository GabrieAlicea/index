import type { Metadata } from "next";
import { Briefcase, Heart, Rocket, Users } from "lucide-react";

import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Careers",
  description: "Help us build the future of on-demand auto repair. See open roles at Revvy.",
  alternates: { canonical: "/careers" },
};

const VALUES = [
  { icon: Rocket, title: "Move fast, own outcomes", body: "Small team, real ownership, high leverage." },
  { icon: Users, title: "Build for both sides", body: "Every decision weighs customers and mechanics equally." },
  { icon: Heart, title: "Care about the craft", body: "We sweat details others skip — that's the product." },
];

const OPEN_ROLES = [
  { title: "Senior Full-Stack Engineer", location: "Remote (US)", team: "Engineering" },
  { title: "Product Designer", location: "Remote (US)", team: "Design" },
  { title: "Mechanic Operations Lead", location: "Orlando, FL", team: "Operations" },
  { title: "Growth Marketing Manager", location: "Remote (US)", team: "Marketing" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Help bring trusted mechanics to every driveway"
        description="We're a small team building a two-sided marketplace from the ground up in Florida, with nationwide ambitions."
      />

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {VALUES.map((v) => (
            <Reveal key={v.title}>
              <div className="h-full rounded-2xl border border-white/8 bg-surface p-6">
                <v.icon className="size-6 text-primary" />
                <h3 className="mt-4 font-semibold text-text">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h2 className="text-2xl font-semibold text-text">Open roles</h2>
          <div className="mt-6 divide-y divide-white/8 rounded-2xl border border-white/8 bg-surface">
            {OPEN_ROLES.map((role) => (
              <a
                key={role.title}
                href={`mailto:careers@revvy.com?subject=${encodeURIComponent(role.title)}`}
                className="flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-4">
                  <Briefcase className="size-4 text-primary" />
                  <div>
                    <p className="font-medium text-text">{role.title}</p>
                    <p className="text-xs text-text-faint">
                      {role.team} · {role.location}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">Apply →</span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm text-text-faint">
            Don&apos;t see the right fit? Email us at{" "}
            <a href="mailto:careers@revvy.com" className="text-primary hover:underline">
              careers@revvy.com
            </a>
            .
          </p>
        </Reveal>
      </section>
    </>
  );
}
