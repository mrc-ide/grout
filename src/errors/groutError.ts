import { ErrorType, ErrorTypeStatuses } from "./errorType";

export class GroutError extends Error {
    errorType: ErrorType;

    constructor(message: string, errorType: ErrorType) {
        super(message);

        this.name = "GroutError";
        this.errorType = errorType;
    }

    get status() {
        return ErrorTypeStatuses[this.errorType];
    }
}
