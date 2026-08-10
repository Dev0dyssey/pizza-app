import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // React 16 does not ship the automatic JSX runtime
      jsxRuntime: "classic",
    }),
  ],
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
