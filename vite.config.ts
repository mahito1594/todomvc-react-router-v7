import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// To deploy to GitHub Pages, we need to set the base path to the repository name
export const BASENAME = "todomvc-react-router-v7";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  base: `/${BASENAME}/`,
});
