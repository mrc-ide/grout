import { describe, expect, test } from "vitest";
import { getData, grout } from "./integrationTest";

describe("region metadata endpoints", () => {
    test("returns global level 0 metadata", async () => {
        const data = await getData(
            "/region-metadata/gadm41/admin0",
            "RegionMetadata"
        );
        expect(data.length).toBe(247);
        const first = data[0];
        expect(first.id).toBe("ABW");
        expect(first.name).toBe("Aruba");
        expect(first.bounds.min).toStrictEqual({ lng: -70.0635, lat: 12.4124 });
    });

    test("returns country level 1 metadata", async () => {
        const data = await getData(
            "/region-metadata/gadm41/admin1/FRA",
            "RegionMetadata"
        );
        const first = data[0];
        expect(first.id).toBe("FRA.1_1");
        expect(first.name).toBe("Auvergne-Rhône-Alpes");
        expect(first.bounds.max).toStrictEqual({ lng: 7.1851, lat: 46.8039 });
    });
});
