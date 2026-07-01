"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { FrogBody } from "@/components/frog/FrogBody";
import { FrogBelly } from "@/components/frog/FrogBelly";
import { FrogMouth } from "@/components/frog/FrogMouth";
import { FrogEyes } from "@/components/frog/FrogEyes";
import { FrogToes } from "@/components/frog/FrogToes";
import { FrogAccessories } from "@/components/frog/FrogAccessories";
import { RaritySheen } from "@/components/frog/RaritySheen";
import { useFrogAnimationState } from "@/hooks/useFrogAnimationState";
import { RARITY_PALETTES } from "@/lib/frog/rarity";
import type { FrogConfig } from "@/types/frog";

export interface FrogRendererProps {
  config: FrogConfig;
  className?: string;
}

const ALBINO_GLOW = [
  "drop-shadow(0 0 6px rgba(253,251,247,0.6))",
  "drop-shadow(0 0 14px rgba(253,251,247,0.9))",
  "drop-shadow(0 0 6px rgba(253,251,247,0.6))",
];

function FrogRendererComponent({ config, className }: FrogRendererProps) {
  const animationState = useFrogAnimationState();
  const scale = 0.7 + (config.size / 100) * 0.6;

  const rarityPalette = RARITY_PALETTES[config.rarity];
  const bodyColor = rarityPalette?.body ?? config.bodyColor;
  const bellyColor = rarityPalette?.belly ?? config.bellyColor;
  const toeColor = rarityPalette?.toe ?? config.toeColor;
  const isAlbino = config.rarity === "albino";

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
          animate={{
            scaleY: [1, 1.03, 1],
            ...(isAlbino ? { filter: ALBINO_GLOW } : {}),
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FrogToes toeColor={toeColor} />
          <FrogBody bodyColor={bodyColor} pattern={config.pattern} />
          <FrogBelly bellyColor={bellyColor} />
          <FrogMouth smile={config.smile} />
          <FrogEyes
            eyeColor={config.eyeColor}
            eyeStyle={config.eyeStyle}
            blinking={animationState === "blinking"}
          />
          <FrogAccessories accessories={config.accessories} />
          <RaritySheen rarity={config.rarity} />
        </motion.g>
      </g>
    </svg>
  );
}

export const FrogRenderer = memo(FrogRendererComponent);
