import { FogCanvas } from "@/components/environment/FogCanvas";
import { LeafSway } from "@/components/environment/LeafSway";
import { cn } from "@/lib/cn";

export interface RainforestSceneProps {
  className?: string;
}

/** Positions itself as an absolute-fill background layer within a `relative` parent. */
export function RainforestScene({ className }: RainforestSceneProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-gradient-to-b from-leaf-100 via-mist-100 to-cream-50 dark:from-canopy-900 dark:via-midnight-900 dark:to-midnight-900",
        className
      )}
    >
      <FogCanvas />
      <LeafSway />
    </div>
  );
}
