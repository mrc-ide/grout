import { Request, Response } from "express";
import { jsonResponseSuccess } from "../jsonResponse";

export class MetadataController {
    static getMetadata = (req: Request, res: Response) => {
        const metadata = req.app.locals.metadata;
        jsonResponseSuccess(metadata, res);
    };
}
