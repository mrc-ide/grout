import { Application, Request, Response } from "express";
import morgan from "morgan";
import { Dict } from "./types/utils";

interface RequestWithError {
    errorType: string;
    errorDetail: string;
    errorStack: string | undefined;
}
export const reqWithError = (req: Request) =>
    req as unknown as RequestWithError;

export const initialiseLogging = (app: Application) => {
    // Log error details appended to request by handleError
    morgan.token("error-type", (req: Request) => reqWithError(req).errorType);
    morgan.token(
        "error-detail",
        (req: Request) => reqWithError(req).errorDetail
    );
    morgan.token("error-stack", (req: Request) => reqWithError(req).errorStack);

    const customFormat = (
        tokens: Dict<(req: Request, res: Response, header?: string) => string>,
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
            tokens["error-type"](req, res),
            tokens["error-detail"](req, res),
            tokens["error-stack"](req, res)
        ].join(" ");
    };

    app.use(morgan(customFormat));
};
