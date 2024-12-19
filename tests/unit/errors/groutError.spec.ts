import { describe, expect, test, vi, beforeEach } from "vitest";
import { GroutError } from "../../../src/errors/groutError";
import { ErrorType } from "../../../src/errors/errorType";

describe("GroutError", () => {
    test("is constructed with expected status value", () => {
        expect(new GroutError("test", ErrorType.BAD_REQUEST).status).toBe(400);
        expect(new GroutError("test", ErrorType.NOT_FOUND).status).toBe(404);
        expect(new GroutError("test", ErrorType.UNEXPECTED_ERROR).status).toBe(
            500
        );
    });
});
