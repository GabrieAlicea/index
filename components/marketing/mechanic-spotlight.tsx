import { BadgeCheck, MessageCircle, Phone, ShieldCheck, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Reveal } from "@/components/marketing/reveal";

export function MechanicSpotlight() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Every mechanic, vetted
          </p>
          <h2 className="text-balance mt-3 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            Not a stranger with a wrench. A professional you can trust.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-text-muted">
            Every mechanic on Revvy passes an identity and background review, carries proof
            of insurance, and is rated by real customers after every job. You see exactly
            who&apos;s coming, their certifications, and their track record before they
            ever leave for your address.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge variant="primary">
              <ShieldCheck className="size-3.5" /> Background checked
            </Badge>
            <Badge variant="primary">
              <BadgeCheck className="size-3.5" /> Insurance verified
            </Badge>
            <Badge variant="primary">
              <Star className="size-3.5" /> Rated after every job
            </Badge>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard className="glass-strong mx-auto max-w-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-14 border border-white/10">
                  <AvatarFallback className="text-base">MJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-text">
                    Mark Johnson
                    <BadgeCheck className="size-4 text-primary" />
                  </p>
                  <p className="flex items-center gap-1 text-xs text-text-muted">
                    <Star className="size-3 fill-warning text-warning" /> 4.9 (520 reviews)
                  </p>
                  <p className="text-xs text-text-faint">12 years experience</p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-text-faint">
              Certifications
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>ASE Certified</Badge>
              <Badge>Brake Specialist</Badge>
              <Badge>EV Certified</Badge>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              ASE Master Technician with 12+ years of experience specializing in
              diagnostics, brakes, and transmissions.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/8 pt-5">
              <div>
                <p className="text-lg font-semibold text-text">1,342</p>
                <p className="text-xs text-text-faint">Jobs completed</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-text">2019</p>
                <p className="text-xs text-text-faint">Member since</p>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1">
                <Phone className="size-3.5" /> Call
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                <MessageCircle className="size-3.5" /> Message
              </Button>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
