import type { Personality } from "@/types/frog";
import { pick, randomInt } from "@/lib/frog/random";
import {
  PERSONALITY_TRAITS,
  FAVORITE_FOODS,
  FAVORITE_WEATHERS,
  FAVORITE_ACTIVITIES,
  FAVORITE_PLACES,
  FAVORITE_TIMES_OF_DAY,
  FAVORITE_FLOWERS,
  VOICE_PITCHES,
} from "@/data/personalityTraits";

const METER_MIN = 20;
const METER_MAX = 100;

export function generatePersonality(): Personality {
  return {
    trait: pick(PERSONALITY_TRAITS),
    favoriteFood: pick(FAVORITE_FOODS),
    favoriteWeather: pick(FAVORITE_WEATHERS),
    favoriteActivity: pick(FAVORITE_ACTIVITIES),
    favoritePlace: pick(FAVORITE_PLACES),
    favoriteTimeOfDay: pick(FAVORITE_TIMES_OF_DAY),
    favoriteFlower: pick(FAVORITE_FLOWERS),
    energy: randomInt(METER_MIN, METER_MAX),
    curiosity: randomInt(METER_MIN, METER_MAX),
    friendliness: randomInt(METER_MIN, METER_MAX),
    bravery: randomInt(METER_MIN, METER_MAX),
    voicePitch: pick(VOICE_PITCHES),
  };
}
