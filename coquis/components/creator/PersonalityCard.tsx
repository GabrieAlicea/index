"use client";

import { useBuilderStore } from "@/stores/builderStore";
import { Button } from "@/components/ui/Button";

const METERS: { key: "energy" | "curiosity" | "friendliness" | "bravery"; label: string }[] = [
  { key: "energy", label: "Energy" },
  { key: "curiosity", label: "Curiosity" },
  { key: "friendliness", label: "Friendliness" },
  { key: "bravery", label: "Bravery" },
];

export function PersonalityCard() {
  const personality = useBuilderStore((s) => s.personality);
  const regeneratePersonality = useBuilderStore((s) => s.regeneratePersonality);

  return (
    <div className="rounded-lg bg-cream-50 p-4 shadow-soft dark:bg-charcoal-800">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-canopy-700 dark:text-leaf-300">
          {personality.trait}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={regeneratePersonality}
          aria-label="Reroll personality"
        >
          🎲 Reroll
        </Button>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-sm font-body text-charcoal-800/80 dark:text-mist-100/80 sm:grid-cols-2">
        <div>
          <dt className="inline font-medium">Favorite food:</dt>{" "}
          <dd className="inline">{personality.favoriteFood}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Favorite weather:</dt>{" "}
          <dd className="inline">{personality.favoriteWeather}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Favorite activity:</dt>{" "}
          <dd className="inline">{personality.favoriteActivity}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Favorite place:</dt>{" "}
          <dd className="inline">{personality.favoritePlace}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Favorite time of day:</dt>{" "}
          <dd className="inline">{personality.favoriteTimeOfDay}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Favorite flower:</dt>{" "}
          <dd className="inline">{personality.favoriteFlower}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Voice pitch:</dt>{" "}
          <dd className="inline capitalize">{personality.voicePitch}</dd>
        </div>
      </dl>

      <div className="mt-4 space-y-2">
        {METERS.map((meter) => (
          <div key={meter.key}>
            <div className="mb-1 flex justify-between text-xs font-body text-charcoal-800/70 dark:text-mist-100/70">
              <span>{meter.label}</span>
              <span>{personality[meter.key]}</span>
            </div>
            <div
              role="meter"
              aria-label={meter.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={personality[meter.key]}
              className="h-2 w-full overflow-hidden rounded-pill bg-leaf-100 dark:bg-canopy-900"
            >
              <div
                className="h-full rounded-pill bg-canopy-500"
                style={{ width: `${personality[meter.key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
