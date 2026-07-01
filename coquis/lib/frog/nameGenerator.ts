import { COQUI_NAMES } from "@/data/names";
import { pick } from "@/lib/frog/random";

export function generateName(): string {
  return pick(COQUI_NAMES);
}
