import { Request } from "express";
import { ErrorType } from "./errorType";
import { GroutError } from "./groutError";

export default (req: Request) => {
    const { url } = req;
    throw new GroutError(`Route not found: ${url}`, ErrorType.NOT_FOUND);
};
