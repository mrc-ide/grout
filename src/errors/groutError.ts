import {ErrorType} from "./errorType";

export class GroutError extends Error {
    status: number;
    errorType: ErrorType;

    constructor(message: string, status: number, errorType: ErrorType) {
        super(message);

        this.name = "GroutError";
        this.status = status;
        this.errorType = errorType;
    }
}