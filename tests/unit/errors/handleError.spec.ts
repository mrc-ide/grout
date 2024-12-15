import { describe, expect, test, vi, beforeEach } from "vitest";
import {GroutError} from "../../../src/errors/groutError";
import {handleError} from "../../../src/errors/handleError";
import {ErrorType} from "../../../src/errors/errorType";

const mockJsonResponseError = vi.hoisted(() => vi.fn());
vi.mock("../../../src/jsonResponse", () => ({
    jsonResponseError: mockJsonResponseError
}));
vi.mock("uid", () => ({
    uid: () => "123"
}));

describe("handleError", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("handles GroutError", () => {
        const err = new GroutError("test message", 400, ErrorType.BAD_REQUEST);
        const mockReq = {} as any;
        const mockRes = {} as any;

        handleError(err, mockReq, mockRes, vi.fn());
        expect(mockReq.errorType).toBe(ErrorType.BAD_REQUEST);
        expect(mockReq.errorDetail).toBe("test message");
        expect(mockReq.errorStack).toBe(err.stack);

        expect(mockJsonResponseError).toHaveBeenCalledWith(400, ErrorType.BAD_REQUEST, "test message", mockRes);
    });

    test("handles unexpected error", () => {
        const err = new Error("Embarrassing catastrophe!");
        const mockReq = {} as any;
        const mockRes = {} as any;

        handleError(err, mockReq, mockRes, vi.fn());
        expect(mockReq.errorType).toBe(ErrorType.UNEXPECTED_ERROR);
        const expectedDetail = "An unexpected error occurred. Please contact support and quote error code 123";
        expect(mockReq.errorDetail).toBe(expectedDetail);
        expect(mockReq.errorStack).toBe(err.stack);

        expect(mockJsonResponseError).toHaveBeenCalledWith(500, ErrorType.UNEXPECTED_ERROR, expectedDetail, mockRes);
    });
});
