import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp = true,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trendUp ? "text-success" : "text-danger"
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold text-text">{value}</p>
      <p className="mt-1 text-xs text-text-faint">{label}</p>
    </Card>
  );
}
