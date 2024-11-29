import { describe, expect, test, vi } from "vitest";
import { registerRoutes } from "../../src/routes";
import { IndexController } from "../../src/controllers/indexController";

const { mockRouterConstructor, mockRouter } = vi.hoisted(() => {
    const mockRouter = {
        get: vi.fn()
    };
    const mockRouterConstructor = vi.fn().mockImplementation(() => mockRouter);
    return { mockRouterConstructor, mockRouter };
});
vi.mock("express", () => ({ Router: mockRouterConstructor }));

describe("registerRoutes", () => {
    test("registers index route", () => {
        const result = registerRoutes();
        expect(result).toBe(mockRouter);
        expect(mockRouter.get).toHaveBeenCalledWith(
            "/",
            IndexController.getIndex
        );
    });
});
