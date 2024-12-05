import {Request, Response} from "express";
import {AppLocals} from "../types/app";

export class TileController {
    static getTile = async (req: Request, res: Response) => {
        const {
            dataset,
            level,
            z,
            x,
            y
        } = req.params;
        const { tileDatasets } = req.app.locals as AppLocals;

        let tileData = null;
        if (tileDatasets[dataset] && tileDatasets[dataset][level]) {
            const db = tileDatasets[dataset][level];
            tileData = await db.getTileData(parseInt(z), parseInt(x), parseInt(y));
        }

        if (tileData) {
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Encoding": "gzip" // TODO: shouldn't compression middleware add this?
            }).end(tileData);
        } else {
            res.writeHead(404).end();
        }
    }
}