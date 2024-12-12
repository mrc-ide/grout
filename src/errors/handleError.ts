import { Request, Response } from "express";
import { uid } from "uid";
import { GroutError } from "./groutError";
import { ErrorType } from "./errorType";
import { reqWithError } from "../logging";
import { jsonResponseError } from "../jsonResponse";

export const handleError = (
    err: Error,
    req: Request,
    res: Response,
    _: Function
) => {
    const groutError = err instanceof GroutError;

    const status = groutError ? err.status : 500;
    const type = groutError ? err.errorType : ErrorType.UNEXPECTED_ERROR;

    // Do not return raw messages from unexpected errors to the front end
    const detail = groutError
        ? err.message
        : `An unexpected error occurred. Please contact support and quote error code ${uid()}`;

    // Set error type, detail and stack on req so morgan logs them
    reqWithError(req).errorType = type;
    reqWithError(req).errorDetail = detail;
    reqWithError(req).errorStack = err.stack;

    jsonResponseError(status, type, detail, res);
};
