"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/cn";

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label: string;
}

export function Slider({ className, label, ...props }: SliderProps) {
  return (
    <SliderPrimitive.Root
      aria-label={label}
      className={cn(
        "relative flex h-6 w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 grow rounded-pill bg-leaf-100 dark:bg-charcoal-800">
        <SliderPrimitive.Range className="absolute h-full rounded-pill bg-canopy-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-5 w-5 rounded-pill bg-cream-50 border-2 border-canopy-500 shadow-soft",
          "focus-visible:focus-ring"
        )}
      />
    </SliderPrimitive.Root>
  );
}
