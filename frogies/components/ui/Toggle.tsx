"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label: string;
}

export function Toggle({ className, label, ...props }: ToggleProps) {
  return (
    <SwitchPrimitive.Root
      aria-label={label}
      className={cn(
        "relative h-7 w-12 rounded-pill bg-stone-200 transition-colors",
        "data-[state=checked]:bg-canopy-500 focus-visible:focus-ring dark:bg-charcoal-800",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-5 w-5 translate-x-1 rounded-pill bg-cream-50 shadow-soft transition-transform",
          "data-[state=checked]:translate-x-6"
        )}
      />
    </SwitchPrimitive.Root>
  );
}
