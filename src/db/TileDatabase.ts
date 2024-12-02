import * as fs from "fs";
import * as path from "node:path";

// initialise with dataset and level... or with filehandle

// open

// select

// TODO: close db!

// discover tile databases. create them and return a dictionary of dictonaries of them
export const discoverTileDatabases = (root: string) => {
    // We expect to find tile databases in a single nesting of folders under root, where each folder has the dataset name,
    // and each *.mbtiles files in the folder has the level name. These are the dataset and level identifiers which should
    // be used in urls to access the tile data
    const folders = fs.readdirSync(root, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);

    console.log("Found tile databases:")
    folders.forEach(folder => {
        const files = fs.readdirSync(path.resolve(path.join(root, folder)))
            .filter(entry => path.extname(entry).toLowerCase() === ".mbtiles");
        files.forEach(file => {
            console.log(`${folder}/${file}`);
        });
    });
}