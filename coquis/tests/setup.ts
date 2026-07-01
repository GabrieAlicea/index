import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Without this, DOM from one test's render() leaks into the next (they all
// mount to document.body by default), which silently breaks any query that
// searches document.body directly, like the default-scoped getByRole().
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement matchMedia — polyfill so hooks reading
// prefers-reduced-motion / prefers-color-scheme don't throw in tests.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
