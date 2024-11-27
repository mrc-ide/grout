import compression from "compression";
import cors from "cors";
import express from "express";
import * as path from "node:path";
import {ConfigReader} from "./configReader";
import {GroutConfig} from "./types";

const app = express();
app.use(cors());
app.use(compression({ level: 9 })); // Use best compression

const rootDir = path.resolve(path.join(__dirname, ".."));
const configReader = new ConfigReader(path.join(rootDir, "data"));
const { port } = configReader.readConfigFile("grout.config.json") as GroutConfig;

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Hello grout" });
});

app.listen(port, () => {
    console.log(`Grout is running on port ${port}`);
});