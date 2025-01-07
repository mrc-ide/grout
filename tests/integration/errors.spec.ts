import { describe, expect, test, beforeAll, afterAll } from "vitest";
import { grout, validateResponse } from "./integrationTest";
import * as fs from "fs";

const expect404Response = async (url: string) => {
    const response = await grout.get(url);
    await validateResponse(response);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
        status: "failure",
        data: null,
        errors: [{ error: "NOT_FOUND", detail: `Route not found: ${url}` }]
    });
};

const expect400Response = async (url: string, error: string) => {
    const response = await grout.get(url);
    await validateResponse(response);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
        status: "failure",
        data: null,
        errors: [{ error: "BAD_REQUEST", detail: error }]
    });
};

describe("404 error response", () => {
    test("from nonexistent endpoint", async () => {
        await expect404Response("/notAnEndpoint");
    });

    test("from unknown dataset", async () => {
        await expect404Response("/tile/unknown/admin0/3/1/4");
    });

    test("from unknown level", async () => {
        await expect404Response("/tile/gadm41/unknown/3/1/4");
    });

    test("from unknown tile", async () => {
        await expect404Response("/tile/gadm41/admin0/3/1/4000");
    });
});

describe("400 error response", () => {
    test("from non-integer z value", async () => {
        await expect400Response(
            "/tile/gadm41/admin0/a/1/4",
            '"a" is not an integer'
        );
    });

    test("from non-integer x value", async () => {
        await expect400Response(
            "/tile/gadm41/admin0/3/1a/4",
            '"1a" is not an integer'
        );
    });

    test("from non-integer y value", async () => {
        await expect400Response(
            "/tile/gadm41/admin0/3/1/4.3",
            '"4.3" is not an integer'
        );
    });
});

describe("500 error response", () => {
    test("when request error test endpoint", async () => {
        // NB The error-test endpoint is only enabled when the GROUT_ERROR_TEST env var is set when the server starts
        // up, e.g. when running through ./docker/run
        const response = await grout.get("/error-test");
        await validateResponse(response);
        expect(response.status).toBe(500);
        expect(response.body.status).toBe("failure");
        expect(response.body.data).toBe(null);
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0].error).toBe("UNEXPECTED_ERROR");
        expect(response.body.errors[0].detail).toMatch(
            /^An unexpected error occurred. Please contact support and quote error code [0-9a-f]{11}$/
        );
    });
});
