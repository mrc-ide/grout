import { Request, Response } from "express";
import { jsonResponseSuccess } from "../jsonResponse";

export class IndexController {
    static getIndex = (_req: Request, res: Response) => {
        const version = process.env.npm_package_version;
        jsonResponseSuccess({ version }, res);
    };
}
