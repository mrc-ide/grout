import compression from "compression";
import cors from "cors";
import express from "express";
import url from "url";
import * as path from "node:path";
import { ConfigReader } from "./server/configReader";
import { GroutConfig } from "./types/app";
import { registerRoutes } from "./routes";
import { initialiseLogging } from "./logging";
import { discoverTileDatasets } from "./server/discover";
import { handleError } from "./errors/handleError";
import { buildMetadata } from "./server/buildMetadata";

// Set __dirname for ESM
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const metadata = buildMetadata(tileDatasets);

Object.assign(app.locals, {
    tileDatasets,
    metadata
});
Object.freeze(app.locals); // We don't expect anything else to modify app.locals

app.use("/", registerRoutes());
app.use(handleError);
app.listen(port, () => {
    console.log(`Grout is running on port ${port}`);
});

export const viteNodeApp = app;
