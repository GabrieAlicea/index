import { CheckCircle2, MapPin, Navigation, Star } from "lucide-react";

import { Reveal } from "@/components/marketing/reveal";
import { ServiceIcon } from "@/components/marketing/service-icon";

function PhoneFrame({
  label,
  step,
  children,
}: {
  label: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
          {step}
        </span>
        {label}
      </div>
      <div className="glass-strong flex h-[420px] w-full max-w-[220px] flex-col overflow-hidden rounded-[2rem] border border-white/10 p-3">
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/15" />
        <div className="flex-1 overflow-hidden rounded-2xl bg-surface p-3">{children}</div>
      </div>
    </div>
  );
}

export function AppExperience() {
  return (
    <section className="border-y border-white/8 bg-base-raised py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            The app experience
          </p>
          <h2 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            Rideshare-simple, shop-quality repair
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-6 overflow-x-auto sm:grid-cols-3 lg:grid-cols-5">
          <Reveal delay={0}>
            <PhoneFrame label="Home" step={1}>
              <p className="text-xs text-text-faint">Hello, Alex</p>
              <p className="mt-1 text-sm font-semibold text-text">
                Where can we help today?
              </p>
              <div className="mt-3 rounded-xl border border-white/10 bg-base px-2.5 py-2">
                <p className="text-[10px] text-text-faint">2020 Toyota RAV4</p>
                <p className="text-[10px] text-text-faint">42,000 miles</p>
              </div>
              <p className="mt-3 text-[10px] font-medium uppercase text-text-faint">
                Popular
              </p>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {["oil", "tires"].map((icon) => (
                  <div key={icon} className="rounded-lg bg-base p-2">
                    <ServiceIcon icon={icon as "oil"} className="size-3.5 text-text-muted" />
                  </div>
                ))}
              </div>
            </PhoneFrame>
          </Reveal>

          <Reveal delay={0.08}>
            <PhoneFrame label="Services" step={2}>
              <p className="text-xs font-semibold text-text">Select a service</p>
              <div className="mt-3 flex flex-col gap-1.5">
                {["Oil Change", "Tires", "Brakes", "Battery"].map((s, i) => (
                  <div
                    key={s}
                    className={`rounded-lg px-2 py-1.5 text-[10px] ${
                      i === 0 ? "bg-primary/15 text-primary" : "bg-base text-text-muted"
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </PhoneFrame>
          </Reveal>

          <Reveal delay={0.16}>
            <PhoneFrame label="Booking" step={3}>
              <p className="text-xs font-semibold text-text">Booking details</p>
              <div className="mt-3 space-y-1.5">
                <div className="rounded-lg bg-base p-2 text-[9px] text-text-faint">
                  221B Baker Street
                </div>
                <div className="rounded-lg bg-base p-2 text-[9px] text-text-faint">
                  2020 Toyota RAV4
                </div>
                <div className="rounded-lg bg-base p-2 text-[9px] text-text-faint">
                  Oil Change · Synthetic
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-primary/15 px-2 py-1.5 text-[10px] font-semibold text-primary">
                $102.00 total
              </div>
            </PhoneFrame>
          </Reveal>

          <Reveal delay={0.24}>
            <PhoneFrame label="Tracking" step={4}>
              <p className="flex items-center gap-1 text-[10px] text-text-faint">
                <Navigation className="size-3" /> Mechanic on the way
              </p>
              <p className="mt-1 text-lg font-semibold text-text">18 min</p>
              <div className="mt-3 flex h-24 items-center justify-center rounded-lg bg-base">
                <MapPin className="size-5 text-primary" />
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[9px] text-text-faint">
                <Star className="size-2.5 fill-warning text-warning" /> Mark J. · 4.9
              </div>
            </PhoneFrame>
          </Reveal>

          <Reveal delay={0.32}>
            <PhoneFrame label="Summary" step={5}>
              <div className="flex flex-col items-center pt-4">
                <CheckCircle2 className="size-8 text-success" />
                <p className="mt-2 text-xs font-semibold text-text">Job Complete</p>
                <p className="text-[10px] text-text-faint">Oil Change · Synthetic</p>
                <p className="mt-2 text-lg font-semibold text-text">$102.00</p>
                <div className="mt-3 w-full rounded-lg bg-primary/15 px-2 py-1.5 text-center text-[10px] font-semibold text-primary">
                  View Receipt
                </div>
              </div>
            </PhoneFrame>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
