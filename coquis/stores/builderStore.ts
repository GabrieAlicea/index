import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage/persist";
import { DEFAULT_FROG_CONFIG } from "@/lib/frog/frogConfig";
import { randomizeFrogConfig } from "@/lib/frog/randomize";
import type { FrogConfig } from "@/types/frog";

interface BuilderState {
  config: FrogConfig;
  setField: <K extends keyof FrogConfig>(key: K, value: FrogConfig[K]) => void;
  randomize: () => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      config: DEFAULT_FROG_CONFIG,

      setField: (key, value) =>
        set((state) => ({ config: { ...state.config, [key]: value } })),

      randomize: () => set({ config: randomizeFrogConfig() }),

      reset: () => set({ config: DEFAULT_FROG_CONFIG }),
    }),
    {
      name: "coquis:draft:v1",
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage()),
    }
  )
);
