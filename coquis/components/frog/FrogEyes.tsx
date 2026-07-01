"use client";

import { motion } from "framer-motion";
import type { EyeStyle } from "@/types/frog";
import type { FrogActivity } from "@/hooks/useFrogAnimationState";

export interface FrogEyesProps {
  eyeColor: string;
  eyeStyle: EyeStyle;
  blinking: boolean;
  activity: FrogActivity;
}

const EYE_POSITIONS = [
  { cx: 72, cy: 55 },
  { cx: 128, cy: 55 },
];

const STYLE_SIZES: Record<EyeStyle, { scleraR: number; pupilR: number; pupilDy: number }> = {
  round: { scleraR: 20, pupilR: 9, pupilDy: 0 },
  sleepy: { scleraR: 20, pupilR: 8, pupilDy: 4 },
  wide: { scleraR: 23, pupilR: 11, pupilDy: 0 },
};

export function FrogEyes({ eyeColor, eyeStyle, blinking, activity }: FrogEyesProps) {
  const { scleraR, pupilR, pupilDy } = STYLE_SIZES[eyeStyle];
  const isSleeping = activity === "sleeping";
  const isLooking = activity === "lookingAround";

  const eyelidScaleY = blinking
    ? 0.08
    : isSleeping
      ? 0.15
      : eyeStyle === "sleepy"
        ? 0.55
        : 1;

  return (
    <g>
      {EYE_POSITIONS.map((pos, i) => (
        <motion.g
          key={i}
          style={{ transformOrigin: `${pos.cx}px ${pos.cy}px` }}
          animate={{ scaleY: eyelidScaleY }}
          transition={{ duration: blinking ? 0.09 : 0.3 }}
        >
          <circle cx={pos.cx} cy={pos.cy} r={scleraR} fill="#FBF8F1" />
          <motion.circle
            cx={pos.cx}
            cy={pos.cy + pupilDy}
            r={pupilR}
            fill={eyeColor}
            animate={{ x: isLooking ? [0, -4, -4, 4, 4, 0] : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </motion.g>
      ))}
    </g>
  );
}
