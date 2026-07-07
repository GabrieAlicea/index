import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="bg-radial-fade relative overflow-hidden rounded-3xl border border-white/10 bg-surface px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-[100px]" />
          <h2 className="text-balance relative mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            Ready to get back on the road?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-lg text-text-muted">
            Book your first service in under two minutes — or join Revvy as a mechanic and
            start earning on your schedule.
          </p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/book">
                Book a Service
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/become-a-mechanic">Become a Mechanic</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
