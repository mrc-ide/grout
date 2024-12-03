import * as sqlite3 from "sqlite3";
import {TilesRow} from "../types/db";

export class TileDatabase {
    dbFileName: string;
    db: sqlite3.Database;

    constructor(dbFileName: string) {
        this.dbFileName = dbFileName;
        // TODO: error calback
        this.db = new sqlite3.Database(dbFileName, sqlite3.OPEN_READONLY);
    }

    getTileData(z: number, x: number, y: number): any {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT tile_data FROM tiles WHERE zoom_level = ${z} AND tile_column = ${x} AND tile_row = ${y}`,
                (err, row) => {
                    if (err || row == undefined) {
                        resolve(null);
                    } else {
                        resolve((row as TilesRow).tile_data);
                    }
                }
            )
        });
    }
}
