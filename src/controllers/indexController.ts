import { Request, Response } from "express";

const version = process.env.npm_package_version;

export class IndexController {
    static getIndex = (_req: Request, res: Response) => {
        res.status(200).json({ version });
    };
}