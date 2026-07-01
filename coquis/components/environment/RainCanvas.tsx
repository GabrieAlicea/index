"use client";

import { useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { createRainEngine } from "@/lib/canvas/rainEngine";

export function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasLoop(canvasRef, createRainEngine);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
