import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage/persist";
import type { TimeOfDay } from "@/types/environment";

interface SettingsState {
  /** Ambient rain/forest sound — also drives the visual rain layer. Starts off, never autoplays. */
  soundEnabled: boolean;
  toggleSound: () => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (timeOfDay: TimeOfDay) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: false,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      timeOfDay: "day",
      setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
    }),
    {
      // v2: added timeOfDay.
      name: "coquis:settings:v1",
      version: 2,
      storage: createJSONStorage(() => safeLocalStorage()),
    }
  )
);
