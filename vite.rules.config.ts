import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/Features/Groups/**/*.emulator.test.ts"],
  },
});
