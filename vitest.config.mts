import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        coverage: {
            provider: "istanbul",
            include: ["src"],
            exclude: ["**/tests/**", "src/server.ts"]
        }
    }
});
