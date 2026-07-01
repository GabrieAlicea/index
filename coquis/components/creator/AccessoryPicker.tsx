"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/cn";
import { ACCESSORY_CATALOG } from "@/data/accessories";

export interface AccessoryPickerProps {
  value: string[];
  onChange: (ids: string[]) => void;
}

export function AccessoryPicker({ value, onChange }: AccessoryPickerProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-body font-medium text-charcoal-800 dark:text-mist-100">
        Accessories
      </p>
      <ToggleGroup.Root
        type="multiple"
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-3"
      >
        {ACCESSORY_CATALOG.map((item) => (
          <ToggleGroup.Item
            key={item.id}
            value={item.id}
            aria-label={`Toggle ${item.label} accessory`}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border-2 border-transparent bg-cream-50 p-3",
              "hover:bg-leaf-100 focus-visible:focus-ring dark:bg-charcoal-800 dark:hover:bg-canopy-900",
              "data-[state=on]:border-canopy-500 data-[state=on]:shadow-soft"
            )}
          >
            <svg viewBox={item.iconViewBox} className="h-8 w-8">
              <item.Icon />
            </svg>
            <span className="text-xs font-body text-charcoal-800 dark:text-mist-100">
              {item.label}
            </span>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}
