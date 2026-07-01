"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { CanvasEngine, CanvasEngineFactory } from "@/lib/canvas/types";
import { getQualityTier } from "@/lib/canvas/types";

/**
 * Drives a Canvas 2D ambient-effect engine: sets up the rendering context,
 * pauses on tab-hidden and prefers-reduced-motion, and scales particle
 * density to a device quality tier. `createEngine` should be a stable
 * reference (a module-level factory like `createFogEngine`).
 */
export function useCanvasLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  createEngine: CanvasEngineFactory
) {
  const reducedMotion = useReducedMotion();
  const engineRef = useRef<CanvasEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const quality = getQualityTier();
    const engine = createEngine(ctx, quality);
    engineRef.current = engine;

    const resize = () => {
      const { clientWidth, clientHeight } = parent;
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.resize(clientWidth, clientHeight);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    const play = () => {
      if (document.hidden) return;
      if (reducedMotion) {
        engine.renderStatic?.();
        return;
      }
      engine.start();
    };

    play();

    const handleVisibility = () => {
      if (document.hidden) {
        engine.stop();
      } else {
        play();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      engine.stop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [canvasRef, createEngine, reducedMotion]);
}
