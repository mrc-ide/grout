import { describe, expect, test, vi, beforeEach } from "vitest";
import {TileDatabase} from "../../../src/db/tileDatabase";

const { mockDatabaseConstructor, mockDatabase } = vi.hoisted(() => {
    const mockDatabase = {
        get: vi.fn()
    };
    const mockDatabaseConstructor = vi.fn().mockImplementation(() => mockDatabase);
    return { mockDatabaseConstructor, mockDatabase };
});
vi.mock("sqlite3", () => ({
    Database: mockDatabaseConstructor,
    OPEN_READONLY: 99
}));


describe("TileDatabase", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const getDb = () => new TileDatabase("/testPath");

    test("constructor opens db file", () => {
        getDb();
        expect(mockDatabaseConstructor).toHaveBeenCalledWith("/testPath", 99);
    });

    test("get tile data runs expected query in db", () => {
        const sut = getDb();
        sut.getTileData(3, 2, 1);
        expect(mockDatabase.get).toHaveBeenCalled();
        expect(mockDatabase.get.mock.calls[0][0]).toBe(
            "SELECT tile_data FROM tiles WHERE zoom_level = 3 AND tile_column = 2 AND tile_row = 1"
        );
    });

    test("get tile data returns Promise which provides data", async () => {
        const sut = getDb();
        const promise = sut.getTileData(3, 2, 1);

        // Expect callback to have been passed which returns tile_data
        const callback = mockDatabase.get.mock.calls[0][1];
        // mock sqlite3 using the callback to provide row data
        callback(null, { tile_data: "mock tile data" });
        const result = await promise;
        expect(result).toBe("mock tile data");
    });

    test("get tile data returns null data when no row is found", async () => {
        const sut = getDb();
        const promise = sut.getTileData(3, 2, 1);

        const callback = mockDatabase.get.mock.calls[0][1];
        callback(null, undefined);
        const result = await promise;
        expect(result).toBeNull();
    });

    test("get tile data throws on database error", async () => {
        const sut = getDb();
        const promise = sut.getTileData(3, 2, 1);

        const callback = mockDatabase.get.mock.calls[0][1];
        const err = Error("test err");
        callback(err, undefined);
        await expect(() => promise).rejects.toThrowError("test err");
    });
});