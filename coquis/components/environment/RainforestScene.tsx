import { FogCanvas } from "@/components/environment/FogCanvas";
import { LeafSway } from "@/components/environment/LeafSway";
import { LeafParticleCanvas } from "@/components/environment/LeafParticleCanvas";
import { FireflyCanvas } from "@/components/environment/FireflyCanvas";
import { RainCanvas } from "@/components/environment/RainCanvas";
import { WaterRippleCanvas, type WaterRippleCanvasHandle } from "@/components/environment/WaterRippleCanvas";
import { CelestialLayer } from "@/components/environment/CelestialLayer";
import { cn } from "@/lib/cn";
import type { TimeOfDay, SceneIntensity } from "@/types/environment";
import type { Ref } from "react";

export interface RainforestSceneProps {
  className?: string;
  timeOfDay?: TimeOfDay;
  /** How many ambient layers to render — Hero stays "low", Creator uses "mid". */
  intensity?: SceneIntensity;
  raining?: boolean;
  /** Lets a sibling (e.g. the frog jumping) trigger a water ripple. */
  rippleRef?: Ref<WaterRippleCanvasHandle>;
}

const SKY_GRADIENTS: Record<TimeOfDay, string> = {
  day: "bg-gradient-to-b from-leaf-100 via-mist-100 to-cream-50",
  dusk: "bg-gradient-to-b from-dusk-700 via-flamboyan-500 to-dawn-100",
  night: "bg-gradient-to-b from-midnight-900 via-midnight-900 to-canopy-900",
};

/** Positions itself as an absolute-fill background layer within a `relative` parent. */
export function RainforestScene({
  className,
  timeOfDay = "day",
  intensity = "low",
  raining = false,
  rippleRef,
}: RainforestSceneProps) {
  const showAmbientLayers = intensity !== "low";
  const showFireflies = showAmbientLayers && timeOfDay !== "day";

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden transition-colors duration-700",
        SKY_GRADIENTS[timeOfDay],
        className
      )}
    >
      <CelestialLayer timeOfDay={timeOfDay} />
      <FogCanvas />
      {showAmbientLayers && <LeafParticleCanvas />}
      {showFireflies && <FireflyCanvas />}
      {showAmbientLayers && raining && <RainCanvas />}
      {showAmbientLayers && <WaterRippleCanvas ref={rippleRef} />}
      <LeafSway windy={raining} />
    </div>
  );
}
