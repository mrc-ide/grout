import * as sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { TileDataResultRow } from "../types/db";

export class TileDatabase {
    dbFileName: string;
    db: Database;

    constructor(dbFileName: string) {
        this.dbFileName = dbFileName;
    }

    async open() {
        this.db = await open({
            filename: this.dbFileName,
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READONLY
        });
    }

    async getTileData(z: number, x: number, y: number): Promise<object | null> {
        const result = await this.db.get<TileDataResultRow>(
            "SELECT tile_data FROM tiles WHERE zoom_level = :z AND tile_column = :x AND tile_row = :y",
            {
                ":x": x,
                ":y": y,
                ":z": z
            }
        );
        return result?.tile_data || null;
    }
}
