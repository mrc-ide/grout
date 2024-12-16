import { describe, expect, test, beforeAll, afterAll } from "vitest";
import {grout} from "./integrationTest";
import * as fs from "fs";

const expect404Response = async (url: string) => {
    const response = await grout.get(url);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
        status: "failure",
        data: null,
        errors: [
            { error: "NOT_FOUND", detail: `Route not found: ${url}` }
        ]
    });
};

const expect400Response = async(url: string, error: string) => {
    const response = await grout.get(url);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
        status: "failure",
        data: null,
        errors: [
            { error: "BAD_REQUEST", detail: error }
        ]
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
        await expect400Response("/tile/gadm41/admin0/a/1/4", "\"a\" is not an integer");
    });

    test("from non-integer x value", async () => {
        await expect400Response("/tile/gadm41/admin0/3/1a/4", "\"1a\" is not an integer");
    });

    test("from non-integer y value", async () => {
        await expect400Response("/tile/gadm41/admin0/3/1/4.3", "\"4.3\" is not an integer");
    });
})

describe("500 error response", () => {
    test("when db file is inaccessible", async () => {
       await expect400Response("/tile/gadm41/admin1/3/1/4", "\"4.3\" is not an integer");
    });
});