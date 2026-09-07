import { fileURLToPath } from "node:url";

import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    exclude: [
      ...defaultExclude,
      // Kumpulan skill agent (.claude/.agents) dipakai runner node:test milik
      // tooling caveman, bukan Vitest — jangan dikumpulkan ke suite proyek.
      "**/.claude/**",
      "**/.agents/**",
    ],
  },
});
