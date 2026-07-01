"use client";

import { useCallback, useRef } from "react";
import { RainforestScene } from "@/components/environment/RainforestScene";
import type { WaterRippleCanvasHandle } from "@/components/environment/WaterRippleCanvas";
import { FrogRenderer } from "@/components/frog/FrogRenderer";
import { useBuilderStore } from "@/stores/builderStore";
import { useSettingsStore } from "@/stores/settingsStore";

/** Roughly where the frog's feet sit within the shared stage, as 0-1 ratios. */
const FROG_LANDING_SPOT = { x: 0.5, y: 0.82 };

export function FrogCanvasStage() {
  const config = useBuilderStore((s) => s.config);
  const timeOfDay = useSettingsStore((s) => s.timeOfDay);
  const raining = useSettingsStore((s) => s.soundEnabled);
  const rippleRef = useRef<WaterRippleCanvasHandle>(null);

  const handleJumpLand = useCallback(() => {
    rippleRef.current?.emit(FROG_LANDING_SPOT.x, FROG_LANDING_SPOT.y);
  }, []);

  return (
    <div className="relative isolate flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-lg sm:min-h-[420px]">
      <RainforestScene
        timeOfDay={timeOfDay}
        intensity="mid"
        raining={raining}
        rippleRef={rippleRef}
      />
      <FrogRenderer
        config={config}
        className="relative z-10 w-48 sm:w-64"
        onJumpLand={handleJumpLand}
      />
    </div>
  );
}
