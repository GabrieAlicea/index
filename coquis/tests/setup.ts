import "@testing-library/jest-dom/vitest";

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
