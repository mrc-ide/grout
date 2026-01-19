import { describe, expect, test } from "vitest";
import { buildMetadata } from "../../../src/server/buildMetadata";

describe("buildMetadata", () => {
    test("builds expected metadata from datasets", () => {
        const mockTileDatasets = {
            ds1: {
                level0: {
                    db: {}
                },
                level1: {
                    db: {}
                }
            },
            ds2: {
                level2: {
                    db: {}
                }
            }
        } as any;

        const mockRegionMetadata = {
            ds1: ["admin0", "admin1"],
            ds2: ["admin0", "admin1", "admin2"]
        };

        const result = buildMetadata(mockTileDatasets, mockRegionMetadata);
        expect(result).toStrictEqual({
            datasets: {
                tile: {
                    ds1: {
                        levels: ["level0", "level1"]
                    },
                    ds2: {
                        levels: ["level2"]
                    }
                },
                regionMetadata: mockRegionMetadata
            }
        });
    });
});
