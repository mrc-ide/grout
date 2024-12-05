import { describe, expect, test, vi, beforeEach } from "vitest";
import { TileController } from "../../../src/controllers/tileController";

const params = {
    dataset: "testDataset",
    level: "testLevel",
    z: "3",
    x: "1",
    y: "2"
};

const mockTileData = "some fake tile data"
const mockDb = {
    getTileData: vi.fn().mockImplementation(async (z, x, y) => z === 0 ? null : mockTileData)
};
const mockRequest = {
    params,
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

describe("TileController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("adds expected tile data and headers to response", async () => {
        await TileController.getTile(mockRequest, mockResponse);
        expect(mockDb.getTileData).toHaveBeenCalledWith(3, 1, 2);
        const expectedHeaders = {
            "Content-Type": "application/octet-stream",
            "Content-Encoding": "gzip"
        };
        expect(mockResponse.writeHead).toHaveBeenCalledWith(200, expectedHeaders);
        expect(mockResponse.end).toHaveBeenCalledWith(mockTileData);
    });

    const expect404Response = async (request: any) => {
        await TileController.getTile(request, mockResponse);
        expect(mockResponse.writeHead).toHaveBeenCalledWith(404);
        expect(mockResponse.end).toHaveBeenCalledWith();
    };

    test("returns 404 if dataset not found", async () => {
        const requestUnknownDataset = {
          ...mockRequest,
          params: {
              ...mockRequest.params,
              dataset: "notadataset"
          }
        };
        await expect404Response(requestUnknownDataset);
    });

    test("returns 404 if level not found", async () => {
        const requestUnknownLevel = {
            ...mockRequest,
            params: {
                ...mockRequest.params,
                level: "notalevel"
            }
        };
        await expect404Response(requestUnknownLevel);
    });

    test("returns 404 if tile not found", async () => {
        const requestUnknownTile = {
            ...mockRequest,
            params: {
                ...mockRequest.params,
                z: "0"
            }
        };
        await expect404Response(requestUnknownTile);
    });
});