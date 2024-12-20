import { describe, expect, test, vi } from "vitest";
import { MetadataController } from "../../../src/controllers/metadataController";

const mockJsonResponseSuccess = vi.hoisted(() => vi.fn());
vi.mock("../../../src/jsonResponse", () => ({
    jsonResponseSuccess: mockJsonResponseSuccess
}));

describe("MetadataController", () => {
    test("returns metadata from app locals", () => {
        const mockMetadata = {
            datasets: {}
        };
        const mockReq = {
            app: {
                locals: {
                    metadata: mockMetadata
                }
            }
        } as any;
        const mockRes = {} as any;
        MetadataController.getMetadata(mockReq, mockRes);
        expect(mockJsonResponseSuccess).toHaveBeenCalledWith(
            mockMetadata,
            mockRes
        );
    });
});
