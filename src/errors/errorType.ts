export enum ErrorType {
    BAD_REQUEST = "BAD_REQUEST", // eslint-disable-line no-unused-vars
    NOT_FOUND = "NOT_FOUND", // eslint-disable-line no-unused-vars
    UNEXPECTED_ERROR = "UNEXPECTED_ERROR" // eslint-disable-line no-unused-vars
}

// eslint-disable-next-line no-unused-vars
export const ErrorTypeStatuses: { [key in ErrorType]: number } = {
    [ErrorType.BAD_REQUEST]: 400,
    [ErrorType.NOT_FOUND]: 404,
    [ErrorType.UNEXPECTED_ERROR]: 500
};
