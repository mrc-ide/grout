import { describe, expect, test, vi } from "vitest";
import { IndexController } from "../../../src/controllers/indexController";

vi.stubEnv("npm_package_version", "1.2.3");

const mockJsonResponseSuccess = vi.hoisted(() => vi.fn());
vi.mock("../../../src/jsonResponse", () => ({
    jsonResponseSuccess: mockJsonResponseSuccess
}));
vi.mock("uid", () => ({
    uid: () => "123"
}));

describe("IndexController", () => {
    test("returns expected content and status", () => {
        const mockResponse = {};
        IndexController.getIndex({}, mockResponse);
        expect(mockJsonResponseSuccess).toHaveBeenCalledWith(
            { version: "1.2.3" },
            mockResponse
        );
    });
});
