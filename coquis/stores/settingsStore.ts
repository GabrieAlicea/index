import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage/persist";

interface SettingsState {
  /** Ambient rain/forest sound. Starts off — never autoplays. */
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: false,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: "coquis:settings:v1",
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage()),
    }
  )
);
