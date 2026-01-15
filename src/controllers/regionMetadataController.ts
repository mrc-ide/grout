import { Request, Response } from "express";
import { AppLocals } from "../types/app.js";
import * as path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { jsonResponseSuccess } from "../jsonResponse.js";
import { GroutError } from "../errors/groutError.js";
import { ErrorType } from "../errors/errorType.js";

const readJsonFile = (
    rootDir: string,
    dataset: string,
    level: string,
    filename: string
) => {
    const filePath = path.join(
        rootDir,
        "data",
        "region_metadata",
        dataset,
        level,
        filename
    );
    if (!existsSync(filePath)) {
        throw new GroutError("Region metadata not found", ErrorType.NOT_FOUND);
    }
    return JSON.parse(readFileSync(filePath, "utf-8"));
};

// We expect to find region metadata data in folders at ./region_metadata/:dataset/:level
// All level 0 metadata should be concatenated in a single file named :dataset_0.json
// Level 1 and level 2 metadata should be in one file per country iso named :dataset_:iso_:level.json
export class RegionMetadataController {
    static getLevel0Metadata = (req: Request, res: Response) => {
        const { rootDir } = req.app.locals as AppLocals;
        const { dataset } = req.params;
        const json = readJsonFile(
            rootDir,
            dataset,
            "admin0",
            "region_metadata_0.json"
        );
        jsonResponseSuccess(json, res);
    };

    static getCountryMetadata = (req: Request, res: Response) => {
        const { rootDir } = req.app.locals as AppLocals;
        const { dataset, iso, level } = req.params;
        const levelNumber = level.replace("admin", "");
        const json = readJsonFile(
            rootDir,
            dataset,
            level,
            `region_metadata_${iso}_${levelNumber}.json`
        );
        jsonResponseSuccess(json, res);
    };
}
