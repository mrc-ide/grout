import * as fs from "fs";
import * as path from "node:path";
import { TileDatabase } from "./db/tileDatabase";
import { TileDataset } from "./types/app";
import { Dict } from "./types/utils";

export const discoverTileDatasets = async (
    root: string
): Promise<Dict<TileDataset>> => {
    // We expect to find tile databases in a single nesting of folders under root, where each folder has the dataset
    // name (e.g. gadm41), and each *.mbtiles file contains data for an administrative level within that dataset,
    // with an appropriate filename (e.g. admin0.mbtiles). These names are the dataset and level identifiers
    // which should be used in urls to access the tile data (e.g. /tile/gadm41/admin0/1/1/1)
    const folders = fs
        .readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);

    if (folders.length) {
        console.log(`Found ${folders.length} tile dataset(s):`);
    } else {
        console.warn("No tile datasets found!");
    }
    const result = {};
    for (const folder of folders) {
        const datasetDbs = {};
        const files = fs
            .readdirSync(path.resolve(path.join(root, folder)))
            .filter(
                (entry) => path.extname(entry).toLowerCase() === ".mbtiles"
            );
        for (const file of files) {
            const level = path.parse(file).name;
            datasetDbs[level] = new TileDatabase(
                path.resolve(root, folder, file)
            );
            await datasetDbs[level].open(); // open the database
            console.log(`${folder}/${file}`);
        }
        result[folder] = datasetDbs;
    }
    return result;
};
