"use client";

import { useBuilderStore } from "@/stores/builderStore";
import { Button } from "@/components/ui/Button";

export function NameGeneratorField() {
  const name = useBuilderStore((s) => s.name);
  const setName = useBuilderStore((s) => s.setName);
  const regenerateName = useBuilderStore((s) => s.regenerateName);

  return (
    <div>
      <label
        htmlFor="coqui-name"
        className="mb-2 block text-sm font-body font-medium text-charcoal-800 dark:text-mist-100"
      >
        Name
      </label>
      <div className="flex gap-2">
        <input
          id="coqui-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          className="w-full rounded-pill border border-moss-300 bg-cream-50 px-4 py-2 font-display text-canopy-700 focus-visible:focus-ring dark:border-moss-500 dark:bg-charcoal-800 dark:text-leaf-300"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={regenerateName}
          aria-label="Generate a new random name"
        >
          🎲
        </Button>
      </div>
    </div>
  );
}
