import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

// https://vitejs.dev/config/
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
    ],
    server: {
        port: 5000,
        open: false // do not open browser on dev run
    }
});