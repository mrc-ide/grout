import { describe, expect, test } from "vitest";
import { grout } from "./integrationTest";

describe("index endpoint", () => {
    test("returns package version", async () => {
        const response = await grout.get("/");
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.errors).toBe(null);
        const data = response.body.data;

        const expectedVersion = process.env.npm_package_version;
        expect(data.version).toBe(expectedVersion);
    });
});
