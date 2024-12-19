import compression from "compression";
import cors from "cors";
import express from "express";
import * as path from "node:path";
import { ConfigReader } from "./configReader";
import { GroutConfig } from "./types/app";
import { registerRoutes } from "./routes";
import { initialiseLogging } from "./logging";
import { discoverTileDatasets } from "./discover";

// Wrap the main server set-up functionality in a non-top-level method so we can use async - we can revert this in
// https://mrc-ide.myjetbrains.com/youtrack/issue/mrc-6134/Add-Vite-build-and-related-tidy-up
const main = async () => {
    const app = express();
    initialiseLogging(app);
    app.use(cors());
    app.use(compression({ level: 9 })); // Use best compression

    const rootDir = path.resolve(path.join(__dirname, ".."));
    const configReader = new ConfigReader(path.join(rootDir, "config"));
    const { port } = configReader.readConfigFile(
        "grout.config.json"
    ) as GroutConfig;

    const tileDatasets = await discoverTileDatasets(
        path.resolve(path.join(rootDir, "data"))
    );

    Object.assign(app.locals, {
        tileDatasets
    });
    Object.freeze(app.locals); // We don't expect anything else to modify app.locals

    app.use("/", registerRoutes());

    app.listen(port, () => {
        console.log(`Grout is running on port ${port}`);
    });
};
main();
