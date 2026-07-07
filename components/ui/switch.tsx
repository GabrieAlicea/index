"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-white/10 bg-white/10 transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/40",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform translate-x-0.5 data-[state=checked]:translate-x-[1.375rem]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
