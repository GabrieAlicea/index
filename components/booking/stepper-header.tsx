import { cn } from "@/lib/utils";

const STEPS = ["Location", "Vehicle", "Service", "Schedule", "Review"];

export function StepperHeader({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                i < current
                  ? "border-primary bg-primary text-primary-foreground"
                  : i === current
                    ? "border-primary text-primary"
                    : "border-white/15 text-text-faint"
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs sm:block",
                i <= current ? "text-text" : "text-text-faint"
              )}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "mx-2 h-px flex-1 transition-colors",
                i < current ? "bg-primary" : "bg-white/10"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
