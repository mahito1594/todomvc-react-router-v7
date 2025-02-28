import type { Config } from "@react-router/dev/config";
import { BASENAME } from "vite.config";

export default {
  // enable SPA mode
  ssr: false,
  basename: BASENAME ? `/${BASENAME}/` : "/",
} satisfies Config;
