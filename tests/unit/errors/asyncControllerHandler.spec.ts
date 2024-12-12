import { describe, expect, test, vi, beforeEach } from "vitest";
import asyncControllerHandler from "../../../src/errors/asyncControllerHandler";

const mockNext = vi.fn();

describe("asyncControllerHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("calls controller method, catches error and passes to next", async () => {
        const err = new Error("nope");
        const method = async () => {
            throw err;
        };
        await asyncControllerHandler(mockNext, method);
        expect(mockNext).toHaveBeenCalledWith(err);
    });

    test("does not call next if no error thrown by controller method", async () => {
        const method = async () => {
            const s = 1 + 1;
        };
        await asyncControllerHandler(mockNext, method);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
