import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-canopy-500 text-cream-50 hover:bg-canopy-700 shadow-soft hover:shadow-lifted",
  secondary:
    "bg-cream-50 text-canopy-700 border border-moss-300 hover:bg-leaf-100 dark:bg-charcoal-800 dark:text-leaf-300 dark:border-moss-500",
  ghost:
    "bg-transparent text-canopy-700 hover:bg-leaf-100 dark:text-leaf-300 dark:hover:bg-charcoal-800",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 min-h-[36px]",
  md: "text-base px-5 py-2.5 min-h-[44px]",
  lg: "text-lg px-7 py-3.5 min-h-[52px]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-pill font-display font-medium tracking-wide transition-colors duration-150",
    "focus-visible:focus-ring disabled:opacity-50 disabled:pointer-events-none",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}
