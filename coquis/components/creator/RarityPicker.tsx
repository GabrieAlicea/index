"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/cn";
import type { Rarity } from "@/types/frog";

export interface RarityPickerProps {
  value: Rarity;
  onChange: (rarity: Rarity) => void;
}

const RARITY_OPTIONS: { value: Rarity; label: string; description: string; preview: string }[] = [
  {
    value: "common",
    label: "Common",
    description: "Any color you like",
    preview: "linear-gradient(135deg, #3F7D4E, #6FA96B)",
  },
  {
    value: "golden",
    label: "Golden",
    description: "Rare shimmering skin",
    preview: "linear-gradient(135deg, #F4B942, #FFE9A8)",
  },
  {
    value: "albino",
    label: "Albino",
    description: "Rare glowing skin",
    preview: "linear-gradient(135deg, #FDFBF7, #F6D9D2)",
  },
];

export function RarityPicker({ value, onChange }: RarityPickerProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-body font-medium text-charcoal-800 dark:text-mist-100">
        Rare skins
      </p>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next as Rarity)}
        className="grid grid-cols-3 gap-3"
      >
        {RARITY_OPTIONS.map((option) => (
          <ToggleGroup.Item
            key={option.value}
            value={option.value}
            aria-label={`Set rare skin to ${option.label}`}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border-2 border-transparent bg-cream-50 p-3",
              "hover:bg-leaf-100 focus-visible:focus-ring dark:bg-charcoal-800 dark:hover:bg-canopy-900",
              "data-[state=on]:border-canopy-500 data-[state=on]:shadow-soft"
            )}
          >
            <span
              className="h-8 w-8 rounded-pill border border-charcoal-800/10"
              style={{ backgroundImage: option.preview }}
            />
            <span className="text-xs font-body font-medium text-charcoal-800 dark:text-mist-100">
              {option.label}
            </span>
            <span className="text-center text-[11px] font-body text-charcoal-800/60 dark:text-mist-100/60">
              {option.description}
            </span>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
