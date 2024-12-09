import { describe, expect, test } from "vitest";
import { grout } from "./integrationTest";

describe("tile endpoint", () => {
    test("returns tile data", async () => {
        const response = await grout.get("/tile/gadm41/admin0/3/1/4");
        expect(response.status).toBe(200);
        expect(response.header["content-type"]).toBe(
            "application/octet-stream"
        );
        expect(response.header["content-encoding"]).toBe("gzip");
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("returns 404 when dataset does not exist", async () => {
        const response = await grout.get("/tile/nonexistent/admin0/3/1/4");
        expect(response.status).toBe(404);
    });

    test("returns 404 when tile does not exist", async () => {
        const response = await grout.get("/tile/gadm41/admin0/3/1/9999");
        expect(response.status).toBe(404);
    });
});
