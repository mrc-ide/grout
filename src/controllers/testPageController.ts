import { Request, Response } from "express";
import { AppLocals } from "../types/app.js";
import * as path from "node:path";

export class TestPageController {
    static getTestPage = (req: Request, res: Response) => {
        const { rootDir } = req.app.locals as AppLocals;
        res.sendFile(path.join(rootDir, "static", "test.html"));
    };
}
