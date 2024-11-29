import { describe, expect, test, vi } from "vitest";
import {IndexController} from "../../../src/controllers/indexController";

vi.stubEnv("npm_package_version", "1.2.3");

describe("IndexController", () => {
    test("returns expected content and status", () => {
        const mockResponse = {
            json: vi.fn()
        };
        mockResponse.status = vi.fn().mockImplementation(() => mockResponse);

        IndexController.getIndex({}, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ version: "1.2.3" });
    });
});