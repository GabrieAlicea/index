import type { CanvasEngine, CanvasEngineFactory, QualityTier } from "./types";

interface FogBlob {
  x: number;
  y: number;
  radius: number;
  driftSpeed: number;
  driftOffset: number;
  opacity: number;
}

const BLOB_COUNT: Record<QualityTier, number> = {
  low: 3,
  medium: 5,
  high: 8,
};

function createBlobs(width: number, height: number, quality: QualityTier): FogBlob[] {
  const count = BLOB_COUNT[quality];
  return Array.from({ length: count }, (_, i) => ({
    x: (width / count) * i + Math.random() * width * 0.2,
    y: height * (0.55 + Math.random() * 0.4),
    radius: height * (0.35 + Math.random() * 0.25),
    driftSpeed: 0.00015 + Math.random() * 0.0002,
    driftOffset: Math.random() * Math.PI * 2,
    opacity: 0.12 + Math.random() * 0.1,
  }));
}

export const createFogEngine: CanvasEngineFactory = (ctx, quality) => {
  let width = 0;
  let height = 0;
  let blobs: FogBlob[] = [];
  let rafId: number | null = null;

  const drawFrame = (time: number) => {
    ctx.clearRect(0, 0, width, height);
    for (const blob of blobs) {
      const drift = Math.sin(time * blob.driftSpeed + blob.driftOffset) * width * 0.08;
      const gradient = ctx.createRadialGradient(
        blob.x + drift,
        blob.y,
        0,
        blob.x + drift,
        blob.y,
        blob.radius
      );
      gradient.addColorStop(0, `rgba(234, 246, 239, ${blob.opacity})`);
      gradient.addColorStop(1, "rgba(234, 246, 239, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(blob.x + drift, blob.y, blob.radius, 0, Math.PI * 2);
      ctx.fill();
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
      blobs = createBlobs(width, height, quality);
    },
    renderStatic() {
      drawFrame(0);
    },
  };

  return engine;
};
