import type { StateStorage } from "zustand/middleware";

function createMemoryStorage(): StateStorage {
  const store = new Map<string, string>();
  return {
    getItem: (name) => store.get(name) ?? null,
    setItem: (name, value) => {
      store.set(name, value);
    },
    removeItem: (name) => {
      store.delete(name);
    },
  };
}

/**
 * localStorage is unavailable or throws in private browsing / quota-exceeded
 * situations. Falls back to an in-memory store so the app keeps working —
 * the caller just won't persist across reloads in that case.
 */
export function safeLocalStorage(): StateStorage {
  if (typeof window === "undefined") return createMemoryStorage();
  try {
    const testKey = "__frogies_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return createMemoryStorage();
  }
}
