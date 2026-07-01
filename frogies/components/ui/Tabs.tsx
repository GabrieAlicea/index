"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex gap-1 rounded-pill bg-leaf-100 p-1 dark:bg-charcoal-800",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "rounded-pill px-4 py-2 text-sm font-display font-medium text-canopy-700 transition-colors",
        "data-[state=active]:bg-canopy-500 data-[state=active]:text-cream-50 data-[state=active]:shadow-soft",
        "focus-visible:focus-ring dark:text-leaf-300 dark:data-[state=active]:text-cream-50",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("mt-4 focus-visible:focus-ring", className)}
      {...props}
    />
  );
}
