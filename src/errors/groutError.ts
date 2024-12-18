import { ErrorType, ErrorTypeStatuses } from "./errorType";

export class GroutError extends Error {
    status: number;
    errorType: ErrorType;

    constructor(message: string, errorType: ErrorType) {
        super(message);

        this.name = "GroutError";
        this.status = ErrorTypeStatuses[errorType];
        this.errorType = errorType;
    }
}
