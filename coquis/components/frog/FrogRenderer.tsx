"use client";

import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import { FrogBody } from "@/components/frog/FrogBody";
import { FrogBelly } from "@/components/frog/FrogBelly";
import { FrogMouth } from "@/components/frog/FrogMouth";
import { FrogTongue } from "@/components/frog/FrogTongue";
import { FrogEyes } from "@/components/frog/FrogEyes";
import { FrogToes } from "@/components/frog/FrogToes";
import { FrogAccessories } from "@/components/frog/FrogAccessories";
import { RaritySheen } from "@/components/frog/RaritySheen";
import { useFrogAnimationState } from "@/hooks/useFrogAnimationState";
import { RARITY_PALETTES } from "@/lib/frog/rarity";
import { cn } from "@/lib/cn";
import type { FrogConfig } from "@/types/frog";

export interface FrogRendererProps {
  config: FrogConfig;
  className?: string;
  /** Fires when the jump pose animation finishes — e.g. to trigger a water ripple. */
  onJumpLand?: () => void;
}

const ALBINO_GLOW = [
  "drop-shadow(0 0 6px rgba(253,251,247,0.6))",
  "drop-shadow(0 0 14px rgba(253,251,247,0.9))",
  "drop-shadow(0 0 6px rgba(253,251,247,0.6))",
];

const POSE_ORIGIN = "100px 200px";

/** One state per FrogActivity — the whole-frog pose layer, above the always-on breathing loop. */
const POSE_VARIANTS: Variants = {
  idle: { y: 0, scaleX: 1, scaleY: 1, transition: { duration: 0.4 } },
  lookingAround: { y: 0, scaleX: 1, scaleY: 1, transition: { duration: 0.4 } },
  stretching: {
    scaleX: [1, 0.92, 1.06, 1],
    scaleY: [1, 1.12, 0.96, 1],
    transition: { duration: 0.9, ease: "easeInOut" },
  },
  croaking: {
    scaleX: [1, 1.1, 1, 1.1, 1],
    scaleY: [1, 0.94, 1, 0.94, 1],
    transition: { duration: 1.1, ease: "easeInOut" },
  },
  jumping: {
    y: [0, 8, -50, -50, 8, 0],
    scaleX: [1, 1.1, 0.9, 0.9, 1.06, 1],
    scaleY: [1, 0.88, 1.14, 1.14, 0.9, 1],
    transition: { duration: 0.7, ease: "easeInOut" },
  },
  sleeping: { y: 3, scaleX: 1, scaleY: 1, transition: { duration: 0.6 } },
  tongueFlick: { y: 0, scaleX: 1, scaleY: 1, transition: { duration: 0.4 } },
};

function FrogRendererComponent({ config, className, onJumpLand }: FrogRendererProps) {
  const { activity, blinking, triggerCroak } = useFrogAnimationState();
  const scale = 0.7 + (config.size / 100) * 0.6;

  const rarityPalette = RARITY_PALETTES[config.rarity];
  const bodyColor = rarityPalette?.body ?? config.bodyColor;
  const bellyColor = rarityPalette?.belly ?? config.bellyColor;
  const toeColor = rarityPalette?.toe ?? config.toeColor;
  const isAlbino = config.rarity === "albino";

  return (
    <button
      type="button"
      onClick={triggerCroak}
      aria-label="Tap to hear your Coquí croak"
      className={cn(
        "inline-block aspect-[200/220] cursor-pointer border-0 bg-transparent p-0 focus-visible:focus-ring",
        className
      )}
    >
      <svg viewBox="0 0 200 220" className="block h-full w-full" aria-hidden="true">
        <g style={{ transform: `scale(${scale})`, transformOrigin: POSE_ORIGIN }}>
          <motion.g
            style={{ transformOrigin: POSE_ORIGIN }}
            variants={POSE_VARIANTS}
            animate={activity}
            initial="idle"
            onAnimationComplete={(definition) => {
              if (definition === "jumping") onJumpLand?.();
            }}
          >
            <motion.g
              style={{ transformOrigin: POSE_ORIGIN }}
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
              <FrogTongue activity={activity} />
              <FrogEyes
                eyeColor={config.eyeColor}
                eyeStyle={config.eyeStyle}
                blinking={blinking}
                activity={activity}
              />
              <FrogAccessories accessories={config.accessories} />
              <RaritySheen rarity={config.rarity} />
            </motion.g>
          </motion.g>
        </g>
      </svg>
    </button>
  );
}

export const FrogRenderer = memo(FrogRendererComponent);
