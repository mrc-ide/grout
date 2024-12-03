import compression from "compression";
import cors from "cors";
import express from "express";
import * as path from "node:path";
import { ConfigReader } from "./configReader";
import { GroutConfig } from "./types/app";
import { registerRoutes } from "./routes";
import { initialiseLogging } from "./logging";
import {discoverTileDatasets} from "./discover";

const app = express();
initialiseLogging(app);
app.use(cors());
app.use(compression({ level: 9 })); // Use best compression

const rootDir = path.resolve(path.join(__dirname, ".."));
const configReader = new ConfigReader(path.join(rootDir, "config"));
const { port } = configReader.readConfigFile(
    "grout.config.json"
) as GroutConfig;

const tileDatasets = discoverTileDatasets(path.resolve(path.join(rootDir, "data")));

Object.assign(app.locals, {
    tileDatasets
});

app.use("/", registerRoutes());

app.listen(port, () => {
    console.log(`Grout is running on port ${port}`);
});
