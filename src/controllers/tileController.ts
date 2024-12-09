import {NextFunction, Request, Response} from "express";
import { AppLocals } from "../types/app";
import asyncControllerHandler from "../errors/asyncControllerHandler";

export class TileController {
    static getTile = async (req: Request, res: Response, next: NextFunction) => {
        await asyncControllerHandler(next, async () => {
            const {dataset, level, z, x, y} = req.params;
            const {tileDatasets} = req.app.locals as AppLocals;

            // TODO: check coords params are throw 400 GroutError if not ints
            let tileData = null;
            if (tileDatasets[dataset] && tileDatasets[dataset][level]) {
                const db = tileDatasets[dataset][level];
                tileData = await db.getTileData(
                    parseInt(z),
                    parseInt(x),
                    parseInt(y)
                );
            }

            if (tileData) {
                res.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-Encoding": "gzip"
                }).end(tileData);
            } else {
                res.writeHead(404).end();
            }
        });
    };
}
