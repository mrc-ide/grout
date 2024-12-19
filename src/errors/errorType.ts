export const enum ErrorType {
    BAD_REQUEST = "BAD_REQUEST",
    NOT_FOUND = "NOT_FOUND",
    UNEXPECTED_ERROR = "UNEXPECTED_ERROR"
}

export const ErrorTypeStatuses: { [key in ErrorType]: number } = {
    [ErrorType.BAD_REQUEST]: 400,
    [ErrorType.NOT_FOUND]: 404,
    [ErrorType.UNEXPECTED_ERROR]: 500
};
