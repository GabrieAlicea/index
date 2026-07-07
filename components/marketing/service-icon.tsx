import {
  BatteryCharging,
  Cog,
  Disc3,
  Gauge,
  LifeBuoy,
  Speaker,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { ServiceCategory } from "@/lib/data/services";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<ServiceCategory["icon"], LucideIcon> = {
  oil: Gauge,
  brakes: Disc3,
  battery: BatteryCharging,
  tires: Cog,
  electronics: Speaker,
  wrench: Wrench,
  roadside: LifeBuoy,
};

export function ServiceIcon({
  icon,
  className,
}: {
  icon: ServiceCategory["icon"];
  className?: string;
}) {
  const Icon = ICON_MAP[icon];
  return <Icon className={cn("size-5", className)} />;
}
