import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-white/10 bg-surface px-4 text-sm text-text placeholder:text-text-faint outline-none transition-colors",
        "focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "aria-invalid:border-danger/60 aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
