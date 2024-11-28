import { Application, Request, Response } from "express";
import morgan from "morgan";

export const initialiseLogging = (app: Application) => {
    const customFormat = (tokens: any, req: Request, res: Response) => {
        return [
            tokens["remote-addr"](req, res),
            tokens["remote-user"](req, res),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"), "-",
            tokens["response-time"](req, res), "ms"
        ].join(" ");
    };

    app.use(morgan(customFormat));
};
