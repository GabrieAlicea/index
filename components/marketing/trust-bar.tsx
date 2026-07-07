import { BadgeCheck, Clock, MapPinned, ShieldCheck, Wrench } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";

const ITEMS = [
  { icon: ShieldCheck, label: "Vetted Mechanics", detail: "Background checked and reviewed" },
  { icon: BadgeCheck, label: "Upfront Pricing", detail: "No hidden fees, ever" },
  { icon: Clock, label: "Real-Time Updates", detail: "Track from booking to complete" },
  { icon: Wrench, label: "Parts & Labor Warranty", detail: "2 months / 12,000 miles" },
  { icon: MapPinned, label: "We Come to You", detail: "Home, office, or roadside" },
];

export function TrustBar() {
  return (
    <section className="border-y border-white/8 bg-base-raised">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {ITEMS.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex flex-col items-start gap-2">
                <Icon className="size-5 text-primary" />
                <p className="text-sm font-medium text-text">{label}</p>
                <p className="text-xs text-text-faint">{detail}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
