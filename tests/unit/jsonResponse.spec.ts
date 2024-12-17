import { describe, expect, test, vi, beforeEach } from "vitest";
import { jsonResponseError, jsonResponseSuccess } from "../../src/jsonResponse";

const mockResponse = {
    header: vi.fn(),
    status: vi.fn(),
    end: vi.fn()
} as any;

beforeEach(() => {
    vi.clearAllMocks();
});

describe("jsonResponseSuccess", () => {
    test("adds expected header and content", () => {
        const data = { value: "test" };
        jsonResponseSuccess(data, mockResponse);
        expect(mockResponse.header).toHaveBeenCalledWith(
            "Content-Type",
            "application/json"
        );
        expect(mockResponse.end).toHaveBeenCalled();
        const responseObj = JSON.parse(mockResponse.end.mock.calls[0][0]);
        expect(responseObj).toStrictEqual({
            status: "success",
            errors: null,
            data
        });
    });
});

describe("jsonResponseError", () => {
    test("adds expected header and content", () => {
        jsonResponseError(400, "BAD_REQUEST", "test error", mockResponse);
        expect(mockResponse.header).toHaveBeenCalledWith(
            "Content-Type",
            "application/json"
        );
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.end).toHaveBeenCalled();
        const responseObj = JSON.parse(mockResponse.end.mock.calls[0][0]);
        expect(responseObj).toStrictEqual({
            status: "failure",
            errors: [
                {
                    error: "BAD_REQUEST",
                    detail: "test error"
                }
            ],
            data: null
        });
    });
});
