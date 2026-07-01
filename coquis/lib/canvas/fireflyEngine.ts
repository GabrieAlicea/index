import type { CanvasEngine, CanvasEngineFactory, QualityTier } from "./types";

interface Firefly {
  x: number;
  baseY: number;
  radius: number;
  driftSpeed: number;
  driftOffset: number;
  pulseSpeed: number;
  pulseOffset: number;
}

const FIREFLY_COUNT: Record<QualityTier, number> = {
  low: 4,
  medium: 8,
  high: 14,
};

function createFireflies(width: number, height: number, quality: QualityTier): Firefly[] {
  const count = FIREFLY_COUNT[quality];
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    baseY: height * (0.3 + Math.random() * 0.6),
    radius: 1.5 + Math.random() * 1.5,
    driftSpeed: 0.0004 + Math.random() * 0.0006,
    driftOffset: Math.random() * Math.PI * 2,
    pulseSpeed: 0.002 + Math.random() * 0.002,
    pulseOffset: Math.random() * Math.PI * 2,
  }));
}

export const createFireflyEngine: CanvasEngineFactory = (ctx, quality) => {
  let width = 0;
  let height = 0;
  let fireflies: Firefly[] = [];
  let rafId: number | null = null;

  const drawFrame = (time: number) => {
    ctx.clearRect(0, 0, width, height);
    for (const fly of fireflies) {
      const x = fly.x + Math.sin(time * fly.driftSpeed + fly.driftOffset) * 24;
      const y = fly.baseY + Math.cos(time * fly.driftSpeed * 1.3 + fly.driftOffset) * 16;
      const pulse = (Math.sin(time * fly.pulseSpeed + fly.pulseOffset) + 1) / 2;
      const opacity = 0.25 + pulse * 0.65;

      ctx.beginPath();
      ctx.arc(x, y, fly.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 216, 115, ${opacity})`;
      ctx.shadowColor = "rgba(255, 216, 115, 0.9)";
      ctx.shadowBlur = 6 + pulse * 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  const tick = (time: number) => {
    drawFrame(time);
    rafId = requestAnimationFrame(tick);
  };

  const engine: CanvasEngine = {
    start() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(tick);
    },
    stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    resize(newWidth, newHeight) {
      width = newWidth;
      height = newHeight;
      fireflies = createFireflies(width, height, quality);
    },
    renderStatic() {
      drawFrame(0);
    },
  };

  return engine;
};
