/// <reference types="vitest" />
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { coverageConfigDefaults } from "vitest/config";

// To deploy to GitHub Pages, we need to set the base path to the repository name
export const BASENAME = "todomvc-react-router-v7";

export default defineConfig({
  plugins: [!process.env.VITEST && reactRouter()],
  resolve: { tsconfigPaths: true },
  base: `/${BASENAME}/`,
  test: {
    environment: "happy-dom",
    setupFiles: "./test/setup.ts",
    coverage: {
      include: ["app/**/*"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "app/routes.ts",
        "app/root.tsx",
      ],
      reporter: ["text", "html", "json-summary", "json"],
      reportOnFailure: true,
    },
  },
});
