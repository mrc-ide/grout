import * as fs from "fs";
import * as path from "node:path";
import {TileDatabase} from "./db/tileDatabase";
import {TileDataset} from "./types/app";
import {Dict} from "./types/utils";

// TODO: include a metadata endpoint with all discovered dbs!

export const discoverTileDatasets = (root: string): Dict<TileDataset> => {
    // We expect to find tile databases in a single nesting of folders under root, where each folder has the dataset name,
    // and each *.mbtiles files in the folder has the level name. These are the dataset and level identifiers which should
    // be used in urls to access the tile data
    const folders = fs.readdirSync(root, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);

    if (folders.length) {
        console.log("Found tile databases:");
    } else {
        console.warn("No tile databases found!");
    }
    const result = {};
    folders.forEach(folder => {
        const datasetDbs = {};
        const files = fs.readdirSync(path.resolve(path.join(root, folder)))
            .filter(entry => path.extname(entry).toLowerCase() === ".mbtiles");
        files.forEach(file => {
            const level = path.parse(file).name;
            datasetDbs[level] = new TileDatabase(path.resolve(root, folder, file));
            console.log(`${folder}/${file}`);
        });
        result[folder] = datasetDbs;
    });
    return result;
};