import { RainforestScene } from "@/components/environment/RainforestScene";
import { LinkButton } from "@/components/ui/LinkButton";
import { AmbienceToggle } from "@/components/audio/AmbienceToggle";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[85vh]">
      <RainforestScene />

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="rounded-pill bg-cream-50/80 px-4 py-1 text-sm font-body font-medium text-canopy-700 shadow-soft backdrop-blur dark:bg-charcoal-800/80 dark:text-leaf-300">
          A tiny rainforest, made just for you
        </span>

        <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-tight text-canopy-900 dark:text-leaf-100 sm:text-6xl md:text-7xl">
          Design a Coquí. Name it. Set it free.
        </h1>

        <p className="mt-6 max-w-xl text-balance font-body text-lg text-charcoal-800/80 dark:text-mist-100/80">
          Frogies is a little digital rainforest inspired by Puerto Rico&apos;s
          coquí — customize your own frog, give it a personality, and release
          it into a living pond of moss, fireflies, and rain.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <LinkButton href="/creator" size="lg">
            Meet your Coquí
          </LinkButton>
          <LinkButton href="#highlights" variant="secondary" size="lg">
            See how it works
          </LinkButton>
        </div>

        <div className="mt-8">
          <AmbienceToggle />
        </div>
      </div>
    </section>
  );
}
