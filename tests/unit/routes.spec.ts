import { beforeEach, describe, expect, test, vi } from "vitest";
import { registerRoutes } from "../../src/routes";
import { IndexController } from "../../src/controllers/indexController";
import { TileController } from "../../src/controllers/tileController";
import notFound from "../../src/errors/notFound";

const { mockRouterConstructor, mockRouter } = vi.hoisted(() => {
    const mockRouter = {
        get: vi.fn(),
        use: vi.fn()
    };
    const mockRouterConstructor = vi.fn().mockImplementation(() => mockRouter);
    return { mockRouterConstructor, mockRouter };
});
vi.mock("express", () => ({ Router: mockRouterConstructor }));

describe("registerRoutes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("registers expected routes", () => {
        const result = registerRoutes();
        expect(result).toBe(mockRouter);
        expect(mockRouter.get).toHaveBeenNthCalledWith(
            1,
            "/",
            IndexController.getIndex
        );
        expect(mockRouter.get).toHaveBeenNthCalledWith(
            2,
            "/tile/:dataset/:level/:z/:x/:y",
            TileController.getTile
        );
        expect(mockRouter.use).toHaveBeenCalledWith(notFound);
    });
});
