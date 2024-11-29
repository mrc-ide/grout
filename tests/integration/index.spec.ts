import { describe, expect, test } from "vitest";
import { grout } from "./integrationTest";

describe("index endpoint" , () => {
    test("returns package version", async () => {
        const response = await grout.get("/");
        expect(response.status).toBe(200);
        const data = response.body;

        const expectedVersion = process.env.npm_package_version;
        expect(data.version).toBe(expectedVersion);
    });
});