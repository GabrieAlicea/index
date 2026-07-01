import type { CanvasEngine, CanvasEngineFactory, QualityTier } from "./types";

interface DriftingLeaf {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  driftSpeed: number;
  bobOffset: number;
  color: string;
}

const LEAF_COUNT: Record<QualityTier, number> = {
  low: 2,
  medium: 4,
  high: 7,
};

const LEAF_COLORS = ["rgba(63,125,78,0.55)", "rgba(111,169,107,0.5)", "rgba(30,122,69,0.5)"];

function createLeaves(width: number, height: number, quality: QualityTier): DriftingLeaf[] {
  const count = LEAF_COUNT[quality];
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.7,
    size: 10 + Math.random() * 8,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    driftSpeed: 0.15 + Math.random() * 0.2,
    bobOffset: Math.random() * Math.PI * 2,
    color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)] ?? LEAF_COLORS[0]!,
  }));
}

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: DriftingLeaf, time: number) {
  const bobY = Math.sin(time * 0.001 + leaf.bobOffset) * 6;
  ctx.save();
  ctx.translate(leaf.x, leaf.y + bobY);
  ctx.rotate(leaf.rotation);
  ctx.fillStyle = leaf.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, leaf.size * 0.5, leaf.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export const createLeafParticleEngine: CanvasEngineFactory = (ctx, quality) => {
  let width = 0;
  let height = 0;
  let leaves: DriftingLeaf[] = [];
  let rafId: number | null = null;

  const step = (time: number) => {
    ctx.clearRect(0, 0, width, height);
    for (const leaf of leaves) {
      leaf.x += leaf.driftSpeed;
      leaf.rotation += leaf.rotationSpeed;
      if (leaf.x - leaf.size > width) {
        leaf.x = -leaf.size;
        leaf.y = Math.random() * height * 0.7;
      }
      drawLeaf(ctx, leaf, time);
    }
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
      leaves = createLeaves(width, height, quality);
    },
    renderStatic() {
      ctx.clearRect(0, 0, width, height);
      for (const leaf of leaves) drawLeaf(ctx, leaf, 0);
    },
  };

  return engine;
};
