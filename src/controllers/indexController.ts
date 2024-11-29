import { Request, Response } from "express";

export class IndexController {
    static getIndex = (_req: Request, res: Response) => {
        const version = process.env.npm_package_version;
        res.status(200).json({ version });
    };
}
