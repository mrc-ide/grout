import { describe, expect, test, vi, beforeEach } from "vitest";
import notFound from "../../../src/errors/notFound";
import { ErrorType } from "../../../src/errors/errorType";

describe("notFound", () => {
    test("throws expected error", () => {
        const mockReq = { url: "/testUrl" } as any;
        // Don't use expect..toThrowError as we want to test more than the message
        let err = null;
        try {
            notFound(mockReq);
        } catch (e) {
            err = e;
        }
        expect(err.message).toBe("Route not found: /testUrl");
        expect(err.status).toBe(404);
        expect(err.errorType).toBe(ErrorType.NOT_FOUND);
    });
});
