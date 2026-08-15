import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "firebase",
              test: /node_modules[\\/](@firebase|firebase)[\\/]/,
              maxSize: 400_000,
              priority: 20,
            },
            {
              name: "react",
              test: /node_modules[\\/](react|react-dom|react-router)[\\/]/,
              priority: 20,
            },
            {
              name: "bootstrap",
              test: /node_modules[\\/](bootstrap|@popperjs)[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
