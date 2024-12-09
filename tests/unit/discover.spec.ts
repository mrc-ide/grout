import { describe, expect, test, vi, beforeEach } from "vitest";
import { fs, vol } from "memfs";
import { discoverTileDatasets } from "../../src/discover";

// tell vitest to use fs mock from __mocks__ folder
vi.mock("fs");

const dataRoot = "/data";
const consoleLogSpy = vi.spyOn(console, "log");
const consoleWarnSpy = vi.spyOn(console, "warn");

const mockDatabaseConstructor = vi.hoisted(() => {
    // Make a mock Tile db constructor that returns an object containing its path constructor param
    // so we can test the correctly constructoed dbs are returned in the dictionary by the discover method.
    return vi.fn().mockImplementation((path: string) => ({ path }));
});

vi.mock("../../src/db/tileDatabase", () => ({
    TileDatabase: mockDatabaseConstructor
}));

beforeEach(() => {
    // reset the state of in-memory fs
    vol.reset();
    vi.clearAllMocks();
});

describe("discoverTileDatasets", () => {
    test("reads data folder and creates database for each mbtiles file", () => {
        const ds1 = "dataset1";
        fs.mkdirSync(`${dataRoot}/${ds1}`, { recursive: true });
        fs.writeFileSync(`${dataRoot}/${ds1}/level0.mbtiles`, "fake data 0");
        fs.writeFileSync(`${dataRoot}/${ds1}/level1.MBTILES`, "fake data 1");
        const ds2 = "dataset2";
        fs.mkdirSync(`${dataRoot}/${ds2}`);
        fs.writeFileSync(`${dataRoot}/${ds2}/level2.mbtiles`, "fake data 2");
        fs.writeFileSync(`${dataRoot}/${ds2}/notadatabase.txt`, "red herring");

        const result = discoverTileDatasets(dataRoot);
        expect(result).toStrictEqual({
            dataset1: {
                level0: { path: "/data/dataset1/level0.mbtiles" },
                level1: { path: "/data/dataset1/level1.MBTILES" }
            },
            dataset2: {
                level2: { path: "/data/dataset2/level2.mbtiles" }
            }
        });

        expect(consoleLogSpy).toHaveBeenCalledTimes(4);
        expect(consoleLogSpy).toHaveBeenNthCalledWith(
            1,
            "Found tile datasets:"
        );
        expect(consoleLogSpy).toHaveBeenNthCalledWith(
            2,
            "dataset1/level0.mbtiles"
        );
        expect(consoleLogSpy).toHaveBeenNthCalledWith(
            3,
            "dataset1/level1.MBTILES"
        );
        expect(consoleLogSpy).toHaveBeenNthCalledWith(
            4,
            "dataset2/level2.mbtiles"
        );

        expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test("logs warning when no datasets found", () => {
        fs.mkdirSync(dataRoot);
        const result = discoverTileDatasets(dataRoot);
        expect(result).toStrictEqual({});
        expect(consoleWarnSpy).toHaveBeenCalledWith("No tile datasets found!");
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });
});
