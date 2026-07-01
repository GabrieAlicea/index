"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { createRippleEngine, type RippleEngine } from "@/lib/canvas/rippleEngine";

export interface WaterRippleCanvasHandle {
  emit: (xRatio: number, yRatio: number) => void;
}

export const WaterRippleCanvas = forwardRef<WaterRippleCanvasHandle>(
  function WaterRippleCanvas(_props, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<RippleEngine | null>(null);
    useCanvasLoop(canvasRef, createRippleEngine, engineRef);

    useImperativeHandle(
      ref,
      () => ({
        emit: (xRatio, yRatio) => engineRef.current?.emit(xRatio, yRatio),
      }),
      []
    );

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
    );
  }
);
