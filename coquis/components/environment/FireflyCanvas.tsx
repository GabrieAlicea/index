"use client";

import { useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { createFireflyEngine } from "@/lib/canvas/fireflyEngine";

export function FireflyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasLoop(canvasRef, createFireflyEngine);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
