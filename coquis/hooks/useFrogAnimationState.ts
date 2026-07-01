"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type FrogAnimationState = "idle" | "blinking";

const MIN_BLINK_DELAY_MS = 2500;
const BLINK_DELAY_JITTER_MS = 3000;
const BLINK_DURATION_MS = 180;

/**
 * Minimal slice of the full idle/blink/lookAround/stretch/croak/jump/sleep
 * state machine planned for M5 — for now just a randomized blink timer.
 */
export function useFrogAnimationState(): FrogAnimationState {
  const [state, setState] = useState<FrogAnimationState>("idle");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let blinkTimeout: ReturnType<typeof setTimeout>;
    let cycleTimeout: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const delay = MIN_BLINK_DELAY_MS + Math.random() * BLINK_DELAY_JITTER_MS;
      cycleTimeout = setTimeout(() => {
        setState("blinking");
        blinkTimeout = setTimeout(() => {
          setState("idle");
          scheduleBlink();
        }, BLINK_DURATION_MS);
      }, delay);
    };

    scheduleBlink();

    return () => {
      clearTimeout(cycleTimeout);
      clearTimeout(blinkTimeout);
    };
  }, [reducedMotion]);

  return state;
}
