import { Application, Request, Response } from "express";
import morgan from "morgan";
import { Dict } from "./types/utils";

export type RequestWithError = Request & {
    errorType?: string;
    errorDetail?: string;
    errorStack?: string;
};

export const initialiseLogging = (app: Application) => {
    // Log error details appended to request by handleError
    morgan.token("error-type", (req: RequestWithError) => req.errorType);
    morgan.token("error-detail", (req: RequestWithError) => req.errorDetail);
    morgan.token("error-stack", (req: RequestWithError) => req.errorStack);

    const customFormat = (
        tokens: Dict<(req: Request, res?: Response, header?: string) => string>,
        req: Request,
        res: Response
    ) => {
        return [
            tokens["remote-addr"](req, res),
            tokens["remote-user"](req, res),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"),
            "-",
            tokens["response-time"](req, res),
            "ms",
            tokens["error-type"](req),
            tokens["error-detail"](req),
            tokens["error-stack"](req)
        ].join(" ");
    };

    app.use(morgan(customFormat));
};
