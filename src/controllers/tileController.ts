import {NextFunction, Request, Response} from "express";
import {AppLocals} from "../types/app";
import asyncControllerHandler from "../errors/asyncControllerHandler";
import {GroutError} from "../errors/groutError";
import {ErrorType} from "../errors/errorType";

export class TileController {
    static getTile = async (req: Request, res: Response, next: NextFunction) => {
        await asyncControllerHandler(next, async () => {
            const {dataset, level, z, x, y} = req.params;
            const {tileDatasets} = req.app.locals as AppLocals;

            // TODO: check coords params and throw 400 GroutError if not ints
            // TODO: also throw error if requested dataset or level not found
            // TODO: also return JSON response if route is not matched (always return JSON response in all cases!)
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
