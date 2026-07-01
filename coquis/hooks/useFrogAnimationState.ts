"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type FrogActivity =
  | "idle"
  | "lookingAround"
  | "stretching"
  | "croaking"
  | "jumping"
  | "sleeping"
  | "tongueFlick";

interface ActivityOption {
  activity: FrogActivity;
  weight: number;
  durationMs: number;
}

/** Weights don't need to sum to 100 — pickWeighted() normalizes against the total. */
const ACTIVITY_OPTIONS: ActivityOption[] = [
  { activity: "lookingAround", weight: 30, durationMs: 1200 },
  { activity: "stretching", weight: 20, durationMs: 900 },
  { activity: "croaking", weight: 20, durationMs: 1100 },
  { activity: "jumping", weight: 15, durationMs: 700 },
  { activity: "tongueFlick", weight: 10, durationMs: 450 },
  { activity: "sleeping", weight: 5, durationMs: 6000 },
];

const CROAK_TRIGGER_DURATION_MS = 1100;
const IDLE_MIN_MS = 4000;
const IDLE_MAX_MS = 9000;
const MIN_BLINK_DELAY_MS = 2500;
const BLINK_DELAY_JITTER_MS = 3000;
const BLINK_DURATION_MS = 180;

function pickWeighted(options: ActivityOption[]): ActivityOption {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  let roll = Math.random() * total;
  for (const option of options) {
    if (roll < option.weight) return option;
    roll -= option.weight;
  }
  const last = options[options.length - 1];
  if (!last) throw new Error("pickWeighted() called with an empty options array");
  return last;
}

export interface FrogAnimationState {
  activity: FrogActivity;
  blinking: boolean;
  /** Explicit tap-to-croak trigger — interrupts whatever the frog was doing. */
  triggerCroak: () => void;
}

export function useFrogAnimationState(): FrogAnimationState {
  const [activity, setActivity] = useState<FrogActivity>("idle");
  const [blinking, setBlinking] = useState(false);
  const reducedMotion = useReducedMotion();

  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const activityTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Holds the recursive scheduler itself — a ref indirection so the recursive
  // call goes through `.current` instead of a self-referential useCallback,
  // which React's exhaustive-deps tooling can't verify is safe.
  const scheduleRef = useRef<() => void>(() => {});

  // setActivity is a stable useState setter, so this closure never goes
  // stale — assigned once in an effect (never during render, which refs
  // must not be mutated in) rather than reactively.
  useEffect(() => {
    scheduleRef.current = () => {
      const idleDelay = IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS);
      idleTimeoutRef.current = setTimeout(() => {
        const next = pickWeighted(ACTIVITY_OPTIONS);
        setActivity(next.activity);
        activityTimeoutRef.current = setTimeout(() => {
          setActivity("idle");
          scheduleRef.current();
        }, next.durationMs);
      }, idleDelay);
    };
  }, []);

  // Ambient, automatic activity cycling — paused entirely under reduced motion,
  // not just visually simplified, since a frog randomly changing pose every
  // few seconds is itself the kind of motion that setting asks to avoid.
  useEffect(() => {
    if (reducedMotion) return;
    scheduleRef.current();
    return () => {
      clearTimeout(idleTimeoutRef.current);
      clearTimeout(activityTimeoutRef.current);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    let blinkTimeout: ReturnType<typeof setTimeout>;
    let cycleTimeout: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const delay = MIN_BLINK_DELAY_MS + Math.random() * BLINK_DELAY_JITTER_MS;
      cycleTimeout = setTimeout(() => {
        setBlinking(true);
        blinkTimeout = setTimeout(() => {
          setBlinking(false);
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

  // Explicit, user-initiated — kept enabled under reduced motion. Framer
  // Motion's root-level MotionConfig(reducedMotion="user") already collapses
  // the transform keyframes to an instant snap in that case, which still
  // gives feedback without the continuous motion the setting is meant to avoid.
  const triggerCroak = useCallback(() => {
    clearTimeout(idleTimeoutRef.current);
    clearTimeout(activityTimeoutRef.current);
    setActivity("croaking");
    activityTimeoutRef.current = setTimeout(() => {
      setActivity("idle");
      if (!reducedMotion) scheduleRef.current();
    }, CROAK_TRIGGER_DURATION_MS);
  }, [reducedMotion]);

  return { activity, blinking, triggerCroak };
}
