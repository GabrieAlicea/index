"use client";

import { useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { createFogEngine } from "@/lib/canvas/fogEngine";

export function FogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasLoop(canvasRef, createFogEngine);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
