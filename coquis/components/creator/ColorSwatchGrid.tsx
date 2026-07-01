"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/cn";
import type { SwatchOption } from "@/data/colorPalettes";

export interface ColorSwatchGridProps {
  label: string;
  options: SwatchOption[];
  value: string;
  onChange: (value: string) => void;
}

export function ColorSwatchGrid({ label, options, value, onChange }: ColorSwatchGridProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-body font-medium text-charcoal-800 dark:text-mist-100">
        {label}
      </p>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next)}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <ToggleGroup.Item
            key={option.id}
            value={option.value}
            aria-label={`Set ${label} to ${option.label}`}
            className={cn(
              "h-10 w-10 rounded-pill border-2 border-transparent shadow-soft transition-transform",
              "hover:scale-105 focus-visible:focus-ring",
              "data-[state=on]:border-charcoal-800 data-[state=on]:scale-110 dark:data-[state=on]:border-cream-50"
            )}
            style={{ backgroundColor: option.value }}
          />
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
