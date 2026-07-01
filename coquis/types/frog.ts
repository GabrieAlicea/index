export type EyeStyle = "round" | "sleepy" | "wide";
export type BodyPattern = "solid" | "spots" | "stripes";
export type Rarity = "common" | "golden" | "albino";

export interface FrogConfig {
  bodyColor: string;
  bellyColor: string;
  toeColor: string;
  eyeColor: string;
  eyeStyle: EyeStyle;
  pattern: BodyPattern;
  /** 0-100, maps to a visual scale range. */
  size: number;
  /** -1 (frown) to 1 (big smile), 0 is neutral. */
  smile: number;
  /** Accessory ids — rendering arrives in M3. */
  accessories: string[];
  rarity: Rarity;
}
