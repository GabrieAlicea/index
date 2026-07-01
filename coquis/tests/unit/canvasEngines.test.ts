import { describe, expect, it } from "vitest";
import { createFogEngine } from "@/lib/canvas/fogEngine";
import { createFireflyEngine } from "@/lib/canvas/fireflyEngine";
import { createRainEngine } from "@/lib/canvas/rainEngine";
import { createLeafParticleEngine } from "@/lib/canvas/leafParticleEngine";
import type { QualityTier } from "@/lib/canvas/types";

/**
 * Every canvas engine draws its particles with a small, fixed set of Canvas
 * 2D primitives once per frame. Counting those calls per quality tier is a
 * precise, deterministic stand-in for "how much work would this do on a
 * low-end device" — more reliable than trying to infer it from rendered
 * pixels in a real browser.
 */
function createMockCtx() {
  const calls = { arc: 0, ellipse: 0, moveTo: 0, lineTo: 0, stroke: 0, fill: 0 };
  const ctx = {
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 0,
    globalAlpha: 1,
    shadowColor: "",
    shadowBlur: 0,
    clearRect: () => {},
    beginPath: () => {},
    arc: () => {
      calls.arc++;
    },
    ellipse: () => {
      calls.ellipse++;
    },
    moveTo: () => {
      calls.moveTo++;
    },
    lineTo: () => {
      calls.lineTo++;
    },
    stroke: () => {
      calls.stroke++;
    },
    fill: () => {
      calls.fill++;
    },
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

const TIERS: QualityTier[] = ["low", "medium", "high"];

describe("canvas engine quality tiers scale particle counts down", () => {
  it("fogEngine draws fewer blobs on low than medium than high", () => {
    const arcCounts = TIERS.map((quality) => {
      const { ctx, calls } = createMockCtx();
      const engine = createFogEngine(ctx, quality);
      engine.resize(400, 400);
      engine.renderStatic?.();
      return calls.arc;
    });
    expect(arcCounts[0]).toBeLessThan(arcCounts[1]!);
    expect(arcCounts[1]).toBeLessThan(arcCounts[2]!);
  });

  it("fireflyEngine draws fewer fireflies on low than medium than high", () => {
    const arcCounts = TIERS.map((quality) => {
      const { ctx, calls } = createMockCtx();
      const engine = createFireflyEngine(ctx, quality);
      engine.resize(400, 400);
      engine.renderStatic?.();
      return calls.arc;
    });
    expect(arcCounts[0]).toBeLessThan(arcCounts[1]!);
    expect(arcCounts[1]).toBeLessThan(arcCounts[2]!);
  });

  it("rainEngine draws fewer drops on low than medium than high", () => {
    const dropCounts = TIERS.map((quality) => {
      const { ctx, calls } = createMockCtx();
      const engine = createRainEngine(ctx, quality);
      engine.resize(400, 400);
      engine.renderStatic?.();
      return calls.moveTo;
    });
    expect(dropCounts[0]).toBeLessThan(dropCounts[1]!);
    expect(dropCounts[1]).toBeLessThan(dropCounts[2]!);
  });

  it("leafParticleEngine draws fewer leaves on low than medium than high", () => {
    const leafCounts = TIERS.map((quality) => {
      const { ctx, calls } = createMockCtx();
      const engine = createLeafParticleEngine(ctx, quality);
      engine.resize(400, 400);
      engine.renderStatic?.();
      return calls.ellipse;
    });
    expect(leafCounts[0]).toBeLessThan(leafCounts[1]!);
    expect(leafCounts[1]).toBeLessThan(leafCounts[2]!);
  });
});
