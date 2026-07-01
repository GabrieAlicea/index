import type { FrogConfig, BodyPattern, EyeStyle } from "@/types/frog";
import {
  BODY_COLOR_PALETTE,
  BELLY_COLOR_PALETTE,
  EYE_COLOR_PALETTE,
  TOE_COLOR_PALETTE,
} from "@/data/colorPalettes";
import { ACCESSORY_CATALOG } from "@/data/accessories";

const PATTERNS: BodyPattern[] = ["solid", "spots", "stripes"];
const EYE_STYLES: EyeStyle[] = ["round", "sleepy", "wide"];
const MAX_RANDOM_ACCESSORIES = 2;

function pick<T>(options: readonly T[]): T {
  const option = options[Math.floor(Math.random() * options.length)];
  if (option === undefined) {
    throw new Error("pick() called with an empty options array");
  }
  return option;
}

export function randomizeFrogConfig(): FrogConfig {
  const accessoryCount = Math.floor(Math.random() * (MAX_RANDOM_ACCESSORIES + 1));
  const shuffledAccessories = [...ACCESSORY_CATALOG].sort(() => Math.random() - 0.5);

  return {
    bodyColor: pick(BODY_COLOR_PALETTE).value,
    bellyColor: pick(BELLY_COLOR_PALETTE).value,
    toeColor: pick(TOE_COLOR_PALETTE).value,
    eyeColor: pick(EYE_COLOR_PALETTE).value,
    eyeStyle: pick(EYE_STYLES),
    pattern: pick(PATTERNS),
    size: 30 + Math.floor(Math.random() * 60),
    smile: Math.round((Math.random() * 2 - 1) * 10) / 10,
    accessories: shuffledAccessories.slice(0, accessoryCount).map((a) => a.id),
    rarity: "common",
  };
}
