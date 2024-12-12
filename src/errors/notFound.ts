import { Request } from "express";
import { ErrorType } from "./errorType";
import { GroutError } from "./groutError";

export default (req: Request) => {
    const { url } = req;
    throw new GroutError(`Route not found: ${url}`, 404, ErrorType.NOT_FOUND);
};
