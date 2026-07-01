import type { CanvasEngine, QualityTier } from "./types";

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  maxRadius: number;
  duration: number;
}

const MAX_RADIUS_BY_QUALITY: Record<QualityTier, number> = {
  low: 26,
  medium: 34,
  high: 42,
};

const RIPPLE_DURATION_MS = 900;

export interface RippleEngine extends CanvasEngine {
  /** x/y as 0-1 ratios of the canvas's own size, not pixel coordinates. */
  emit: (xRatio: number, yRatio: number) => void;
}

/**
 * Event-driven rather than a continuous loop: start()/stop() are effectively
 * idle, and emit() self-manages its own rAF loop for as long as any ripple
 * is still fading — nothing to animate between jumps.
 */
export function createRippleEngine(
  ctx: CanvasRenderingContext2D,
  quality: QualityTier
): RippleEngine {
  let width = 0;
  let height = 0;
  let ripples: Ripple[] = [];
  let rafId: number | null = null;

  const drawFrame = (now: number) => {
    ctx.clearRect(0, 0, width, height);
    ripples = ripples.filter((ripple) => now - ripple.startTime < ripple.duration);
    for (const ripple of ripples) {
      const t = (now - ripple.startTime) / ripple.duration;
      const radius = ripple.maxRadius * t;
      const opacity = 0.5 * (1 - t);
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(79, 179, 191, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const tick = (now: number) => {
    drawFrame(now);
    rafId = ripples.length > 0 ? requestAnimationFrame(tick) : null;
  };

  return {
    start() {
      // No ambient animation — emit() drives the loop on demand.
    },
    stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      ripples = [];
    },
    resize(newWidth, newHeight) {
      width = newWidth;
      height = newHeight;
    },
    renderStatic() {
      // Reduced motion: nothing persistent to draw for an ephemeral ripple.
    },
    emit(xRatio, yRatio) {
      ripples.push({
        x: xRatio * width,
        y: yRatio * height,
        startTime: performance.now(),
        maxRadius: MAX_RADIUS_BY_QUALITY[quality],
        duration: RIPPLE_DURATION_MS,
      });
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    },
  };
}
