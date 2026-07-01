"use client";

import { motion, type Variants } from "framer-motion";
import type { FrogActivity } from "@/hooks/useFrogAnimationState";

export interface FrogTongueProps {
  activity: FrogActivity;
}

const TONGUE_ORIGIN = "100px 180px";

const TONGUE_VARIANTS: Variants = {
  idle: { scaleY: 0, opacity: 0 },
  lookingAround: { scaleY: 0, opacity: 0 },
  stretching: { scaleY: 0, opacity: 0 },
  croaking: { scaleY: 0, opacity: 0 },
  jumping: { scaleY: 0, opacity: 0 },
  sleeping: { scaleY: 0, opacity: 0 },
  tongueFlick: {
    scaleY: [0, 1, 1, 0],
    opacity: [0, 1, 1, 0],
    transition: { duration: 0.45, times: [0, 0.3, 0.7, 1], ease: "easeOut" },
  },
};

export function FrogTongue({ activity }: FrogTongueProps) {
  return (
    <motion.rect
      x={94}
      y={180}
      width={12}
      height={34}
      rx={6}
      fill="#E23E57"
      style={{ transformOrigin: TONGUE_ORIGIN }}
      variants={TONGUE_VARIANTS}
      animate={activity}
      initial="idle"
    />
  );
}
