"use client";

import { useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { createLeafParticleEngine } from "@/lib/canvas/leafParticleEngine";

export function LeafParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasLoop(canvasRef, createLeafParticleEngine);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
