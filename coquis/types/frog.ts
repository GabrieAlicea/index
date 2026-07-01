export type EyeStyle = "round" | "sleepy" | "wide";
export type BodyPattern = "solid" | "spots" | "stripes";
export type Rarity = "common" | "golden" | "albino";
export type VoicePitch = "low" | "medium" | "high";

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
  accessories: string[];
  rarity: Rarity;
}

export interface SavedFrog {
  id: string;
  name: string;
  config: FrogConfig;
  personality: Personality;
  favorite: boolean;
  createdAt: number;
}

export interface Personality {
  /** Headline personality word, e.g. "Curious", "Bold". */
  trait: string;
  favoriteFood: string;
  favoriteWeather: string;
  favoriteActivity: string;
  favoritePlace: string;
  favoriteTimeOfDay: string;
  favoriteFlower: string;
  /** 0-100 meters. */
  energy: number;
  curiosity: number;
  friendliness: number;
  bravery: number;
  voicePitch: VoicePitch;
}
