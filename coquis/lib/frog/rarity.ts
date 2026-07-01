import type { Rarity } from "@/types/frog";

/** Cumulative odds when rolling a random rarity (e.g. via Randomize). */
export const RARITY_ODDS: Record<Rarity, number> = {
  common: 0.9,
  golden: 0.07,
  albino: 0.03,
};

export function rollRarity(): Rarity {
  const roll = Math.random();
  if (roll < RARITY_ODDS.golden) return "golden";
  if (roll < RARITY_ODDS.golden + RARITY_ODDS.albino) return "albino";
  return "common";
}

export interface RarityPalette {
  body: string;
  belly: string;
  toe: string;
}

/** Rare skins are a fixed special material, not user-recolorable. */
export const RARITY_PALETTES: Record<Rarity, RarityPalette | null> = {
  common: null,
  golden: { body: "#F4B942", belly: "#FFE9A8", toe: "#C9A57A" },
  albino: { body: "#FDFBF7", belly: "#F6D9D2", toe: "#F6D9D2" },
};
