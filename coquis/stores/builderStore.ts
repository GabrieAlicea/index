import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage/persist";
import { DEFAULT_FROG_CONFIG } from "@/lib/frog/frogConfig";
import { DEFAULT_PERSONALITY, DEFAULT_NAME } from "@/lib/frog/personality";
import { randomizeFrogConfig } from "@/lib/frog/randomize";
import { generateName } from "@/lib/frog/nameGenerator";
import { generatePersonality } from "@/lib/frog/personalityGenerator";
import type { FrogConfig, Personality } from "@/types/frog";

interface BuilderState {
  config: FrogConfig;
  name: string;
  personality: Personality;
  setField: <K extends keyof FrogConfig>(key: K, value: FrogConfig[K]) => void;
  setName: (name: string) => void;
  regenerateName: () => void;
  regeneratePersonality: () => void;
  randomize: () => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      config: DEFAULT_FROG_CONFIG,
      name: DEFAULT_NAME,
      personality: DEFAULT_PERSONALITY,

      setField: (key, value) =>
        set((state) => ({ config: { ...state.config, [key]: value } })),

      setName: (name) => set({ name }),

      regenerateName: () => set({ name: generateName() }),

      regeneratePersonality: () => set({ personality: generatePersonality() }),

      randomize: () =>
        set({
          config: randomizeFrogConfig(),
          name: generateName(),
          personality: generatePersonality(),
        }),

      reset: () =>
        set({
          config: DEFAULT_FROG_CONFIG,
          name: DEFAULT_NAME,
          personality: DEFAULT_PERSONALITY,
        }),
    }),
    {
      // v2: added name/personality alongside the draft config. Old v1 drafts
      // (no user data exists yet) simply merge with these fields' defaults.
      name: "coquis:draft:v1",
      version: 2,
      storage: createJSONStorage(() => safeLocalStorage()),
    }
  )
);
