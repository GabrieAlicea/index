"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { FrogBody } from "@/components/frog/FrogBody";
import { FrogBelly } from "@/components/frog/FrogBelly";
import { FrogMouth } from "@/components/frog/FrogMouth";
import { FrogEyes } from "@/components/frog/FrogEyes";
import { FrogToes } from "@/components/frog/FrogToes";
import { useFrogAnimationState } from "@/hooks/useFrogAnimationState";
import type { FrogConfig } from "@/types/frog";

export interface FrogRendererProps {
  config: FrogConfig;
  className?: string;
}

function FrogRendererComponent({ config, className }: FrogRendererProps) {
  const animationState = useFrogAnimationState();
  const scale = 0.7 + (config.size / 100) * 0.6;

  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label="Your customized Coquí"
    >
      <g style={{ transform: `scale(${scale})`, transformOrigin: "100px 200px" }}>
        <motion.g
          style={{ transformOrigin: "100px 200px" }}
          animate={{ scaleY: [1, 1.03, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FrogToes toeColor={config.toeColor} />
          <FrogBody bodyColor={config.bodyColor} pattern={config.pattern} />
          <FrogBelly bellyColor={config.bellyColor} />
          <FrogMouth smile={config.smile} />
          <FrogEyes
            eyeColor={config.eyeColor}
            eyeStyle={config.eyeStyle}
            blinking={animationState === "blinking"}
          />
        </motion.g>
      </g>
    </svg>
  );
}

export const FrogRenderer = memo(FrogRendererComponent);
