import { NextFunction, Request, Response } from "express";
import { uid } from "uid";
import { GroutError } from "./groutError";
import { ErrorType } from "./errorType";
import { RequestWithError } from "../logging";
import { jsonResponseError } from "../jsonResponse";

// We need to include the unused next var for this to be used correctly as an error handler
export const handleError = (
    err: Error,
    req: Request,
    res: Response,
    _: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
    const groutError = err instanceof GroutError;

    const status = groutError ? err.status : 500;
    const type = groutError ? err.errorType : ErrorType.UNEXPECTED_ERROR;

    // Do not return raw messages from unexpected errors to the front end
    const detail = groutError
        ? err.message
        : `An unexpected error occurred. Please contact support and quote error code ${uid()}`;

    // Set error type, detail and stack on req so morgan logs them
    const reqWithError = req as RequestWithError;
    reqWithError.errorType = type;
    reqWithError.errorDetail = detail;
    reqWithError.errorStack = err.stack;

    jsonResponseError(status, type, detail, res);
};
