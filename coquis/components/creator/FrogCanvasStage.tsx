"use client";

import { RainforestScene } from "@/components/environment/RainforestScene";
import { FrogRenderer } from "@/components/frog/FrogRenderer";
import { useBuilderStore } from "@/stores/builderStore";

export function FrogCanvasStage() {
  const config = useBuilderStore((s) => s.config);

  return (
    <div className="relative isolate flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-lg sm:min-h-[420px]">
      <RainforestScene />
      <FrogRenderer config={config} className="relative z-10 w-48 sm:w-64" />
    </div>
  );
}
