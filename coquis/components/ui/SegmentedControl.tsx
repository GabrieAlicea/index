"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div>
      <p className="mb-2 text-sm font-body font-medium text-charcoal-800 dark:text-mist-100">
        {label}
      </p>
      <ToggleGroup.Root
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next as T)}
        className="inline-flex flex-wrap gap-1 rounded-pill bg-leaf-100 p-1 dark:bg-charcoal-800"
      >
        {options.map((option) => (
          <ToggleGroup.Item
            key={option.value}
            value={option.value}
            className={cn(
              "rounded-pill px-4 py-2 text-sm font-display font-medium text-canopy-700 transition-colors",
              "data-[state=on]:bg-canopy-500 data-[state=on]:text-cream-50 data-[state=on]:shadow-soft",
              "focus-visible:focus-ring dark:text-leaf-300 dark:data-[state=on]:text-cream-50"
            )}
          >
            {option.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
