import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage/persist";
import type { FrogConfig, Personality, SavedFrog } from "@/types/frog";

export const MAX_COLLECTION_SIZE = 60;

interface CollectionState {
  frogs: SavedFrog[];
  add: (frog: { name: string; config: FrogConfig; personality: Personality }) => SavedFrog;
  rename: (id: string, name: string) => void;
  toggleFavorite: (id: string) => void;
  remove: (id: string) => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      frogs: [],

      add: (frog) => {
        const saved: SavedFrog = {
          id: crypto.randomUUID(),
          name: frog.name,
          config: frog.config,
          personality: frog.personality,
          favorite: false,
          createdAt: Date.now(),
        };
        set((state) => ({
          frogs: [saved, ...state.frogs].slice(0, MAX_COLLECTION_SIZE),
        }));
        return saved;
      },

      rename: (id, name) =>
        set((state) => ({
          frogs: state.frogs.map((frog) => (frog.id === id ? { ...frog, name } : frog)),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          frogs: state.frogs.map((frog) =>
            frog.id === id ? { ...frog, favorite: !frog.favorite } : frog
          ),
        })),

      remove: (id) => set((state) => ({ frogs: state.frogs.filter((frog) => frog.id !== id) })),
    }),
    {
      name: "coquis:collection:v1",
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage()),
    }
  )
);
