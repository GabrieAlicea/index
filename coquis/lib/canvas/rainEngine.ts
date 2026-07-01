import type { CanvasEngine, CanvasEngineFactory, QualityTier } from "./types";

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

const RAIN_COUNT: Record<QualityTier, number> = {
  low: 25,
  medium: 55,
  high: 90,
};

function createDrops(width: number, height: number, quality: QualityTier): RainDrop[] {
  const count = RAIN_COUNT[quality];
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    length: 10 + Math.random() * 10,
    speed: 4 + Math.random() * 4,
    opacity: 0.2 + Math.random() * 0.3,
  }));
}

export const createRainEngine: CanvasEngineFactory = (ctx, quality) => {
  let width = 0;
  let height = 0;
  let drops: RainDrop[] = [];
  let rafId: number | null = null;

  const drawFrame = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(79, 179, 191, 0.5)";
    ctx.lineWidth = 1.5;
    for (const drop of drops) {
      ctx.globalAlpha = drop.opacity;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 4, drop.y + drop.length);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const step = () => {
    for (const drop of drops) {
      drop.y += drop.speed;
      drop.x -= drop.speed * 0.25;
      if (drop.y > height) {
        drop.y = -drop.length;
        drop.x = Math.random() * width;
      }
    }
    drawFrame();
    rafId = requestAnimationFrame(step);
  };

  const engine: CanvasEngine = {
    start() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(step);
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
      drops = createDrops(width, height, quality);
    },
    renderStatic() {
      drawFrame();
    },
  };

  return engine;
};
