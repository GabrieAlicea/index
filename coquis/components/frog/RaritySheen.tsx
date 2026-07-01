"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { BODY_PATH } from "@/components/frog/bodyPath";
import type { Rarity } from "@/types/frog";

export interface RaritySheenProps {
  rarity: Rarity;
}

/**
 * Golden frogs get a shimmer sweep across the body. Albino frogs get a soft
 * glow instead, applied as a drop-shadow filter on FrogRenderer's root group
 * (a filter naturally halos the whole silhouette, where an extra draw layer
 * here could only sit in front of or behind the body — not around it).
 */
export function RaritySheen({ rarity }: RaritySheenProps) {
  const clipId = useId();

  if (rarity !== "golden") return null;

  return (
    <g clipPath={`url(#${clipId})`}>
      <defs>
        <clipPath id={clipId}>
          <path d={BODY_PATH} />
        </clipPath>
      </defs>
      <motion.rect
        x={-40}
        y={30}
        width={40}
        height={190}
        fill="rgba(255,233,168,0.55)"
        transform="skewX(-20)"
        animate={{ x: [-40, 200] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
      />
    </g>
  );
}
