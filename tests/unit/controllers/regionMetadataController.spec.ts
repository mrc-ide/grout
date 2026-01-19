import { describe, expect, test, vi, beforeEach } from "vitest";
import { fs, vol } from "memfs";
import * as jsonResponse from "../../../src/jsonResponse";
import { jsonResponseSuccess } from "../../../src/jsonResponse";
import { RegionMetadataController } from "../../../src/controllers/regionMetadataController";

// tell vitest to use fs mock from __mocks__ folder
vi.mock("fs");
const mockJsonResponseSuccess = vi
    .spyOn(jsonResponse, "jsonResponseSuccess")
    .mockImplementation(() => {});

beforeEach(() => {
    // reset the state of in-memory fs
    vol.reset();
    vi.clearAllMocks();
});

const dataset = "gadm41";

const writeTestFile = (folder: string, filename: string, contents: any) => {
    const path = `${folder}/${filename}`;
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path, JSON.stringify(contents));
};

describe("RegionMetadataController", () => {
    test("returns global level 0 metadata", () => {
        const testLevel0Metadata = [{ id: "SC", name: "some country" }];
        writeTestFile(
            `/testRoot/data/region_metadata/${dataset}/admin0`,
            "region_metadata_0.json",
            testLevel0Metadata
        );

        const mockReq = {
            app: {
                locals: {
                    rootDir: "/testRoot"
                }
            },
            params: {
                dataset
            }
        } as any;

        const mockRes = {} as any;

        RegionMetadataController.getGlobalLevel0Metadata(mockReq, mockRes);

        expect(mockJsonResponseSuccess).toHaveBeenCalledWith(
            testLevel0Metadata,
            mockRes
        );
    });

    test("returns metadata by request ISO", () => {
        const testLevel2Metadata = [{ id: "SR", name: "some region" }];
        writeTestFile(
            `/testRoot/data/region_metadata/${dataset}/admin2`,
            "region_metadata_FRA_2.json",
            testLevel2Metadata
        );

        const mockReq = {
            app: {
                locals: {
                    rootDir: "/testRoot"
                }
            },
            params: {
                dataset,
                level: "admin2",
                iso: "FRA"
            }
        } as any;

        const mockRes = {} as any;

        RegionMetadataController.getMetadataByISO(mockReq, mockRes);

        expect(mockJsonResponseSuccess).toHaveBeenCalledWith(
            testLevel2Metadata,
            mockRes
        );
    });
});
