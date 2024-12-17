import { describe, expect, test, vi, beforeEach } from "vitest";
import { TileDatabase } from "../../../src/db/tileDatabase";
import * as sqlite3 from "sqlite3";

const { mockDatabase, mockOpen } = vi.hoisted(() => {
    const mockDatabase = {
        get: vi.fn()
    };
    const mockOpen = vi.fn().mockImplementation(() => mockDatabase);
    return { mockDatabase, mockOpen };
});
vi.mock("sqlite", () => ({
    open: mockOpen
}));

describe("TileDatabase", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const getDb = () => new TileDatabase("/testPath");

    test("opens db file", async () => {
        const sut = getDb();
        await sut.open();
        expect(mockOpen).toHaveBeenCalledWith({
            filename: "/testPath",
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READONLY
        });
    });

    test("get tile data runs expected query in db, and returns tile_data", async () => {
        const mockRow = { tile_data: { mock: "blob" } };
        mockDatabase.get.mockImplementation(() => mockRow);
        const sut = getDb();
        await sut.open();
        const result = await sut.getTileData(3, 2, 1);
        expect(mockDatabase.get).toHaveBeenCalledWith(
            "SELECT tile_data FROM tiles WHERE zoom_level = :z AND tile_column = :x AND tile_row = :y",
            {
                ":x": 2,
                ":y": 1,
                ":z": 3
            }
        );
        expect(result).toBe(mockRow.tile_data);
    });

    test("get tile data returns null data when no row is found", async () => {
        mockDatabase.get.mockImplementation(() => undefined);
        const sut = getDb();
        await sut.open();
        const result = await sut.getTileData(3, 2, 1);
        expect(result).toBe(null);
    });
});
