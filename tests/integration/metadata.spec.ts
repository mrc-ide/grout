import { describe, expect, test } from "vitest";
import { getData } from "./integrationTest";

describe("metadata endpoint", () => {
    test("returns expected dataset metadata", async () => {
        const data = await getData("/metadata");
        expect(data).toStrictEqual({
            datasets: {
                tile: {
                    gadm41: {
                        levels: ["admin0", "admin1"]
                    }
                }
            }
        });
    });
});
