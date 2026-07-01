import { Header } from "@/components/layout/Header";
import { LinkButton } from "@/components/ui/LinkButton";
import { FrogCanvasStage } from "@/components/creator/FrogCanvasStage";
import { CreatorControls } from "@/components/creator/CreatorControls";
import { RandomizeButton } from "@/components/creator/RandomizeButton";
import { NamePersonalityPanel } from "@/components/creator/NamePersonalityPanel";
import { SaveToCollectionButton } from "@/components/creator/SaveToCollectionButton";
import { FunFact } from "@/components/creator/FunFact";
import { TimeOfDaySelector } from "@/components/environment/TimeOfDaySelector";
import { AmbienceToggle } from "@/components/audio/AmbienceToggle";

export default function CreatorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50 dark:bg-midnight-900">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold text-canopy-700 dark:text-leaf-300 sm:text-4xl">
            Design your Coquí
          </h1>
          <p className="mt-2 font-body text-charcoal-800/75 dark:text-mist-100/75">
            Pick colors, patterns, and accessories — your frog updates live.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          <div className="w-full max-w-md space-y-4">
            <FrogCanvasStage />
            <div className="flex flex-wrap items-center justify-center gap-4">
              <TimeOfDaySelector />
              <AmbienceToggle />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <RandomizeButton />
              <SaveToCollectionButton />
              <LinkButton href="/gallery" variant="ghost">
                View your pond
              </LinkButton>
            </div>
            <NamePersonalityPanel />
            <FunFact />
          </div>

          <CreatorControls />
        </div>
      </main>
    </div>
  );
}
