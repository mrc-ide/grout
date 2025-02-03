import { describe, expect, test, vi } from "vitest";
import { TestPageController } from "../../../src/controllers/testPageController";

describe("TestPageController", () => {
    test("sends test page file", () => {
        const req = {
            app: {
                locals: {
                    rootDir: "testRoot"
                }
            }
        } as any;
        const res = {
            sendFile: vi.fn()
        } as any;
        TestPageController.getTestPage(req, res);
        expect(res.sendFile).toHaveBeenCalledWith("testRoot/static/test.html");
    });
});
