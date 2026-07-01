"use client";

import { motion } from "framer-motion";
import type { EyeStyle } from "@/types/frog";

export interface FrogEyesProps {
  eyeColor: string;
  eyeStyle: EyeStyle;
  blinking: boolean;
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

export function FrogEyes({ eyeColor, eyeStyle, blinking }: FrogEyesProps) {
  const { scleraR, pupilR, pupilDy } = STYLE_SIZES[eyeStyle];

  return (
    <g>
      {EYE_POSITIONS.map((pos, i) => (
        <motion.g
          key={i}
          style={{ transformOrigin: `${pos.cx}px ${pos.cy}px` }}
          animate={{ scaleY: blinking ? 0.08 : eyeStyle === "sleepy" ? 0.55 : 1 }}
          transition={{ duration: blinking ? 0.09 : 0.3 }}
        >
          <circle cx={pos.cx} cy={pos.cy} r={scleraR} fill="#FBF8F1" />
          <circle
            cx={pos.cx}
            cy={pos.cy + pupilDy}
            r={pupilR}
            fill={eyeColor}
          />
        </motion.g>
      ))}
    </g>
  );
}
