import { describe, expect, test, vi, beforeEach } from "vitest";
import {buildMetadata} from "../../../src/server/buildMetadata";

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
        const result = buildMetadata(mockTileDatasets);
        expect(result).toStrictEqual({
            datasets: {
                tile: {
                    ds1: {
                        levels: ["level0", "level1"]
                    },
                    ds2: {
                        levels: ["level2"]
                    }
                }
            }
        });
    });
});