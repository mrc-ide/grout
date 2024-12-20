import { describe, expect, test } from "vitest";
import { getData } from "./integrationTest";

describe("index endpoint", () => {
    test("returns package version", async () => {
        const data = await getData("/");
        const expectedVersion = process.env.npm_package_version;
        expect(data.version).toBe(expectedVersion);
    });
});
