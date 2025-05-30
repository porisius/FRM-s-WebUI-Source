import { defineConfig } from "eslint/config";
import pluginNext from "@next/eslint-plugin-next";

export default defineConfig([
  {
    plugins: {
      "@next/next": pluginNext,
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "sort-keys": ["error", "asc"],
    },
  },
]);
