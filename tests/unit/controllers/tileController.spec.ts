import { describe, expect, test, vi, beforeEach } from "vitest";
import { TileController } from "../../../src/controllers/tileController";
import { GroutError } from "../../../src/errors/groutError";
import { ErrorType } from "../../../src/errors/errorType";

const params = {
    dataset: "testDataset",
    level: "testLevel",
    z: "3",
    x: "1",
    y: "2"
};

const mockTileData = "some fake tile data";
const mockDb = {
    getTileData: vi
        .fn()
        .mockImplementation(async (z, x, y) => (z === 0 ? null : mockTileData))
};
const mockRequest = {
    params,
    url: "/mockUrl",
    app: {
        locals: {
            tileDatasets: {
                testDataset: {
                    testLevel: mockDb
                }
            }
        }
    }
} as any;

const mockResponse = {
    end: vi.fn()
} as any;
mockResponse.writeHead = vi.fn().mockImplementation(() => mockResponse);

const mockNext = vi.fn();

describe("TileController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("adds expected tile data and headers to response", async () => {
        await TileController.getTile(mockRequest, mockResponse, mockNext);
        expect(mockDb.getTileData).toHaveBeenCalledWith(3, 1, 2);
        const expectedHeaders = {
            "Content-Type": "application/octet-stream",
            "Content-Encoding": "gzip"
        };
        expect(mockResponse.writeHead).toHaveBeenCalledWith(
            200,
            expectedHeaders
        );
        expect(mockResponse.end).toHaveBeenCalledWith(mockTileData);
    });

    const expectThrowsNotFound = async (request: any) => {
        await TileController.getTile(request, mockResponse, mockNext);
        // expect the async controller handler to have been used, so the error will be caught and passed to next
        expect(mockNext).toHaveBeenCalledWith(
            new GroutError("Route not found: /mockUrl", ErrorType.NOT_FOUND)
        );
    };

    const expectThrowsBadRequest = async (request: any, badParam: string) => {
        await TileController.getTile(request, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledWith(
            new GroutError(
                `"${badParam}" is not an integer`,
                ErrorType.BAD_REQUEST
            )
        );
    };

    test("returns 404 if dataset not found", async () => {
        const requestUnknownDataset = {
            ...mockRequest,
            params: {
                ...mockRequest.params,
                dataset: "notadataset"
            }
        };
        await expectThrowsNotFound(requestUnknownDataset);
    });

    test("returns 404 if level not found", async () => {
        const requestUnknownLevel = {
            ...mockRequest,
            params: {
                ...mockRequest.params,
                level: "notalevel"
            }
        };
        await expectThrowsNotFound(requestUnknownLevel);
    });

    test("returns 404 if tile not found", async () => {
        const requestUnknownTile = {
            ...mockRequest,
            params: {
                ...mockRequest.params,
                z: "0"
            }
        };
        await expectThrowsNotFound(requestUnknownTile);
    });

    test("returns 400 if non-integer z, x, or y", async () => {
        await expectThrowsBadRequest(
            {
                ...mockRequest,
                params: {
                    ...mockRequest.params,
                    z: "abc"
                }
            },
            "abc"
        );
        await expectThrowsBadRequest(
            {
                ...mockRequest,
                params: {
                    ...mockRequest.params,
                    x: "1a"
                }
            },
            "1a"
        );
        await expectThrowsBadRequest(
            {
                ...mockRequest,
                params: {
                    ...mockRequest.params,
                    y: "1.2"
                }
            },
            "1.2"
        );
    });
});
