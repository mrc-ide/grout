import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
    esbuild: {
        supported: {
            "top-level-await": true
        }
    },
    plugins: [
        ...VitePluginNode({
            adapter: "express",
            appPath: "./src/server.ts",
            exportName: "viteNodeApp",
            initAppOnBoot: true,
            outputFormat: "esm"
        })
    ]
});