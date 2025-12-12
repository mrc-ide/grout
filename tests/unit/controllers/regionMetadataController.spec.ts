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
const testMetadata = [{ id: "SW", name: "somewhere" }];

const writeTestFile = (folder: string, filename: string, contents: any) => {
    const path = `${folder}/${filename}`;
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path, JSON.stringify(testMetadata));
};

describe("RegionMetadataController", () => {
    test("returns level 0 metadata", () => {
        writeTestFile(
            `/testRoot/region_metadata/${dataset}/0`,
            "region_metadata_0.json",
            testMetadata
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

        RegionMetadataController.getLevel0Metadata(mockReq, mockRes);

        expect(mockJsonResponseSuccess).toHaveBeenCalledWith(
            testMetadata,
            mockRes
        );
    });

    test("returns country metadata", () => {
        writeTestFile(
            `/testRoot/region_metadata/${dataset}/2`,
            "region_metadata_FRA_2.json",
            testMetadata
        );

        const mockReq = {
            app: {
                locals: {
                    rootDir: "/testRoot"
                }
            },
            params: {
                dataset,
                level: "2",
                iso: "FRA"
            }
        } as any;

        const mockRes = {} as any;

        RegionMetadataController.getCountryMetadata(mockReq, mockRes);

        expect(mockJsonResponseSuccess).toHaveBeenCalledWith(
            testMetadata,
            mockRes
        );
    });
});
