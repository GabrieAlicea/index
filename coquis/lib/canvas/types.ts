export type QualityTier = "low" | "medium" | "high";

export interface CanvasEngine {
  start: () => void;
  stop: () => void;
  resize: (width: number, height: number) => void;
  /** Draw a single non-animated frame — used when reduced motion is requested. */
  renderStatic?: () => void;
}

export type CanvasEngineFactory<T extends CanvasEngine = CanvasEngine> = (
  ctx: CanvasRenderingContext2D,
  quality: QualityTier
) => T;

export function getQualityTier(): QualityTier {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return "medium";
  }
  const cores = navigator.hardwareConcurrency ?? 4;
  const width = window.innerWidth;
  if (cores <= 2 || width < 480) return "low";
  if (cores <= 4 || width < 1024) return "medium";
  return "high";
}
