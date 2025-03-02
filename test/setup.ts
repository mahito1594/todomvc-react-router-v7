import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  // cleanup manually instead of set `globals: true`
  cleanup();
});

const mockLocalStorage = (() => {
  const _store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => _store.get(key)),
    setItem: vi.fn((key: string, value: string) => _store.set(key, value)),
    removeItem: vi.fn((key: string) => _store.delete(key)),
    clear: vi.fn(() => _store.clear()),
  };
})();
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});
