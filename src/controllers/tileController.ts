import {NextFunction, Request, Response} from "express";
import {AppLocals} from "../types/app";
import asyncControllerHandler from "../errors/asyncControllerHandler";
import notFound from "../errors/notFound";
import {GroutError} from "../errors/groutError";
import {ErrorType} from "../errors/errorType";

const parseIntParam = (param: string): number => {
    // Native parseInt is not strict (ignores whitespace and trailing chars) so test with a regex
    if (!(/^\d+$/.test(param))) {
        throw new GroutError(`"${param}" is not an integer`, 400, ErrorType.BAD_REQUEST);
    }
    return parseInt(param, 10);
}

export class TileController {
    static getTile = async (req: Request, res: Response, next: NextFunction) => {
        await asyncControllerHandler(next, async () => {
            const {dataset, level, z, x, y} = req.params;
            const {tileDatasets} = req.app.locals as AppLocals;

            let tileData = null;
            if (tileDatasets[dataset] && tileDatasets[dataset][level]) {
                const db = tileDatasets[dataset][level];
                tileData = await db.getTileData(
                    parseIntParam(z),
                    parseIntParam(x),
                    parseIntParam(y)
                );
            }

            if (tileData) {
                res.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-Encoding": "gzip"
                }).end(tileData);
            } else {
                notFound(req);
            }
        });
    };
}
