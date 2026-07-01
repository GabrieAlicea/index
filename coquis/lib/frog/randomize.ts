import type { FrogConfig, BodyPattern, EyeStyle } from "@/types/frog";
import {
  BODY_COLOR_PALETTE,
  BELLY_COLOR_PALETTE,
  EYE_COLOR_PALETTE,
  TOE_COLOR_PALETTE,
} from "@/data/colorPalettes";
import { ACCESSORY_CATALOG } from "@/data/accessories";
import { pick, randomInt } from "@/lib/frog/random";
import { rollRarity } from "@/lib/frog/rarity";

const PATTERNS: BodyPattern[] = ["solid", "spots", "stripes"];
const EYE_STYLES: EyeStyle[] = ["round", "sleepy", "wide"];
const MAX_RANDOM_ACCESSORIES = 2;

export function randomizeFrogConfig(): FrogConfig {
  const accessoryCount = randomInt(0, MAX_RANDOM_ACCESSORIES);
  const shuffledAccessories = [...ACCESSORY_CATALOG].sort(() => Math.random() - 0.5);

  return {
    bodyColor: pick(BODY_COLOR_PALETTE).value,
    bellyColor: pick(BELLY_COLOR_PALETTE).value,
    toeColor: pick(TOE_COLOR_PALETTE).value,
    eyeColor: pick(EYE_COLOR_PALETTE).value,
    eyeStyle: pick(EYE_STYLES),
    pattern: pick(PATTERNS),
    size: randomInt(30, 90),
    smile: Math.round((Math.random() * 2 - 1) * 10) / 10,
    accessories: shuffledAccessories.slice(0, accessoryCount).map((a) => a.id),
    rarity: rollRarity(),
  };
}
