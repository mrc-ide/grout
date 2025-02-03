import { Request, Response } from "express";
import { AppLocals } from "../types/app.js";

export class TestPageController {
    static getTestPage = (req: Request, res: Response) => {
        const { rootDir } = req.app.locals as AppLocals;
        res.sendFile(`${rootDir}/static/test.html`); // TODO: use path
    };
}
